
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VideoCleaner.css';
import { API_BASE_URL } from '../../config';

const VideoCleaner = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState({});
  const [activeJobIds, setActiveJobIds] = useState([]);
  const [retryCount, setRetryCount] = useState(0);
  const [copies, setCopies] = useState(1);
  const navigate = useNavigate();

  const cleanup = useCallback(async () => {
    if (activeJobIds.length > 0) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/cancel-jobs`,
          { jobIds: activeJobIds },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );
        console.log('Jobs cancelled successfully');
      } catch (error) {
        console.error('Error canceling jobs:', error);
      }
    }
  }, [activeJobIds]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
        cleanup();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (isProcessing) {
        cleanup();
      }
    };
  }, [isProcessing, cleanup]);

  const checkJobStatus = useCallback(async (jobIds) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-status`, {
        params: { jobIds: jobIds.join(',') },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 10000
      });

      const { statuses, allCompleted } = response.data;

      setRetryCount(0);

      const newProgress = {};
      statuses.forEach(({ jobId, status, progress, originalName, copyNumber }) => {
        newProgress[jobId] = {
          status,
          progress: progress || 0,
          originalName,
          copyNumber
        };
      });
      setProgress(newProgress);

      if (allCompleted) {
        await downloadProcessedVideos(jobIds);
        setIsProcessing(false);
        setActiveJobIds([]);
      } else {
        const baseDelay = 2000;
        const maxDelay = 10000;
        const delay = Math.min(baseDelay * Math.pow(1.5, retryCount), maxDelay);
        setTimeout(() => checkJobStatus(jobIds), delay);
      }
    } catch (error) {
      console.error('Error checking job status:', error);

      if (error.response?.status === 429) {
        setTimeout(() => checkJobStatus(jobIds), 5000);
        return;
      }

      if (error.response?.status === 401) {
        navigate('/login');
        return;
      }

      setRetryCount(prev => prev + 1);
      if (retryCount <= 3) {
        const retryDelay = 3000 * Math.pow(2, retryCount);
        setTimeout(() => checkJobStatus(jobIds), retryDelay);
      } else {
        setIsProcessing(false);
        alert('Lost connection to the server. The process continues in the background.');
      }
    }
  }, [retryCount, navigate]);

  const downloadProcessedVideos = async (jobIds) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/download-processed`, {
        params: { jobIds: jobIds.join(',') },
        responseType: 'blob',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_videos.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading processed videos:', error);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Error downloading videos. Please try again.');
      }
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    if (files.length > 10) {
      alert("Maximum 10 files allowed at once");
      return;
    }
    setSelectedFiles(files);
    setFileNames(Array.from(files).map(file => file.name));
  };

  const handleCopiesChange = (event) => {
    const value = parseInt(event.target.value) || 1;
    setCopies(Math.min(10, Math.max(1, value)));
  };

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return false;
      }

      const response = await axios.get(`${API_BASE_URL}/api/subscriptions/status`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.isSubscribed;
    } catch (error) {
      console.error('Error checking subscription:', error);
      if (error.response?.status === 401 || error.response?.status === 403) {
        navigate('/login');
      }
      return false;
    }
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload video files.");
      return;
    }

    if (selectedFiles.length > 10) {
      alert("Maximum 10 files allowed at once");
      return;
    }

    if (selectedFiles.length * copies > 50) {
      alert("Maximum total of 50 processed videos allowed (files × copies)");
      return;
    }

    const isSubscribed = await checkSubscription();
    if (!isSubscribed) {
      navigate('/subscription');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('videos', selectedFiles[i]);
    }
    formData.append('copies', copies.toString());

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/process-videos`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000
      });

      const jobIds = response.data.jobs.map(job => job.jobId);
      setActiveJobIds(jobIds);
      setRetryCount(0);
      checkJobStatus(jobIds);
    } catch (error) {
      console.error('Error processing videos:', error);
      setIsProcessing(false);
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to process videos. Please try again later.');
      }
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" style={{ cursor: 'pointer' }} className="upload-btn">
          Upload Files
        </label>
        <input
          type="file"
          id="fileUpload"
          accept="video/*"
          onChange={handleFileChange}
          className="file-input"
          multiple
          disabled={isProcessing}
        />
        <input
          type="text"
          value={fileNames.join(', ')}
          placeholder="No files selected"
          readOnly
          className="file-name-display"
        />

        <div className="copies-input">
          <label htmlFor="copiesInput">Number of copies (1-10):</label>
          <input
            type="number"
            id="copiesInput"
            min="1"
            max="10"
            value={copies}
            onChange={handleCopiesChange}
            disabled={isProcessing}
            className="copies-number"
          />
        </div>

        <button
          onClick={handleClean}
          className="clean-btn"
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      {isProcessing && (
        <div className="progress-container">
          {Object.entries(progress).map(([jobId, { status, progress, originalName, copyNumber }]) => (
            <div key={jobId} className="progress-item">
              <div className="progress-label">
                {`${originalName || `Video ${jobId}`} - Copy ${copyNumber}`}
              </div>
              <div className="progress-bar">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="progress-text">
                {`${status.charAt(0).toUpperCase() + status.slice(1)} - ${Math.round(progress)}%`}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: MP4, AVI, MOV
          <br />
          Maximum Files: 10 files at once
          <br />
          Maximum Copies: 10 per file (maximum total of 50 processed videos)
          <br />
          Multiple File Selection: You can select and upload multiple video files at once.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;