/* import React, { useState } from 'react';
import './VideoCleaner.css'


const VideoCleaner = () => {
  const [fileName, setFileName] = useState('');
  const [blackFrame, setBlackFrame] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleClean = () => {
    console.log(`Cleaning ${fileName}, with black frame: ${blackFrame}`);
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        
        <label htmlFor="fileUpload" className="upload-btn">
          Upload File
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
        />
        <input 
          type="text" 
          value={fileName} 
          placeholder="No file selected" 
          readOnly 
          className="file-name-display" 
        />
        <button onClick={handleClean} className="clean-btn">Clean</button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Black frame</label>
      </div>

      

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */

/* import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const VideoCleaner = () => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Store the actual file
  const [blackFrame, setBlackFrame] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Set the file itself
      setFileName(file.name); // Set the file name for display
    }
  };

  const handleClean = async () => {
    if (!selectedFile) {
      alert("Please upload a video file.");
      return;
    }

    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('blackFrame', blackFrame);

    try {
      const response = await axios.post('http://localhost:5000/api/process-video', formData, {
        responseType: 'blob', // Important: the response is going to be a file (binary)
      });

      // Create a URL for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_video.mp4'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup after download

      console.log('Video processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing video:', error);
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload File
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
        />
        <input 
          type="text" 
          value={fileName} 
          placeholder="No file selected" 
          readOnly 
          className="file-name-display" 
        />
        <button onClick={handleClean} className="clean-btn">Clean</button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Black frame</label>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */

/* import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const VideoCleaner = () => {
  const [fileName, setFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null); // Store the actual file
  const [blackFrame, setBlackFrame] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Set the file itself
      setFileName(file.name); // Set the file name for display
    }
  };

  const handleClean = async () => {
    if (!selectedFile) {
      alert("Please upload a video file.");
      return;
    }

    setIsProcessing(true); // Set processing state to true
    const formData = new FormData();
    formData.append('video', selectedFile);
    formData.append('blackFrame', blackFrame);

    try {
      const response = await axios.post('http://localhost:5000/api/process-video', formData, {
        responseType: 'blob', // Important: the response is going to be a file (binary)
      });

      // Create a URL for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_video.mp4'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup after download

      console.log('Video processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing video:', error);
      alert('Failed to process video. Please try again later.');
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload File
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
        />
        <input 
          type="text" 
          value={fileName} 
          placeholder="No file selected" 
          readOnly 
          className="file-name-display" 
        />
        <button 
          onClick={handleClean} 
          className="clean-btn" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Black frame</label>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */

/* import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const VideoCleaner = () => {
  const [fileNames, setFileNames] = useState([]); // Store the actual file names
  const [selectedFiles, setSelectedFiles] = useState([]); // Store the actual files
  const [blackFrame, setBlackFrame] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files); // Set the files themselves
    setFileNames(Array.from(files).map(file => file.name)); // Set the file names for display
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload video files.");
      return;
    }

    setIsProcessing(true); // Set processing state to true
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('videos', selectedFiles[i]); // Append multiple files
    }
    formData.append('blackFrame', blackFrame);

    try {
      const response = await axios.post('http://localhost:5000/api/process-videos', formData, {
        responseType: 'blob', // Important: the response is going to be a file (binary)
      });

      // Create a URL for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_videos.zip'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup after download

      console.log('Videos processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing videos:', error);
      alert('Failed to process videos. Please try again later.');
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload Files
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
          multiple // Allow multiple file selection
        />
        <input 
          type="text" 
          value={fileNames.join(', ')} 
          placeholder="No files selected" 
          readOnly 
          className="file-name-display" 
        />
        <button 
          onClick={handleClean} 
          className="clean-btn" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Black frame</label>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */

/* 

//FUNCIONA

import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const VideoCleaner = () => {
  const [fileNames, setFileNames] = useState([]); // Store the actual file names
  const [selectedFiles, setSelectedFiles] = useState([]); // Store the actual files
  const [blackFrame, setBlackFrame] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files); // Set the files themselves
    setFileNames(Array.from(files).map(file => file.name)); // Set the file names for display
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload video files.");
      return;
    }

    setIsProcessing(true); // Set processing state to true
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('videos', selectedFiles[i]); // Append multiple files
    }
    formData.append('blackFrame', blackFrame);

    try {
      const response = await axios.post('http://localhost:5000/api/process-videos', formData, {
        responseType: 'blob', // Important: the response is going to be a file (binary)
      });

      // Create a URL for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_videos.zip'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup after download

      console.log('Videos processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing videos:', error);
      alert('Failed to process videos. Please try again later.');
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload Files
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
          multiple // Allow multiple file selection
        />
        <input 
          type="text" 
          value={fileNames.join(', ')} 
          placeholder="No files selected" 
          readOnly 
          className="file-name-display" 
        />
        <button 
          onClick={handleClean} 
          className="clean-btn" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Black frame</label>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */


/* import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const VideoCleaner = () => {
  const [fileNames, setFileNames] = useState([]); // Store the actual file names
  const [selectedFiles, setSelectedFiles] = useState([]); // Store the actual files
  const [blackFrame, setBlackFrame] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files); // Set the files themselves
    setFileNames(Array.from(files).map(file => file.name)); // Set the file names for display
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload video files.");
      return;
    }

    setIsProcessing(true); // Set processing state to true
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('videos', selectedFiles[i]); // Append multiple files
    }
    formData.append('blackFrame', blackFrame);

    try {
      const response = await axios.post('http://localhost:5000/api/process-videos', formData, {
        responseType: 'blob', // Important: the response is going to be a file (binary)
      });

      // Create a URL for the processed file
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_videos.zip'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Cleanup after download

      console.log('Videos processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing videos:', error);
      alert('Failed to process videos. Please try again later.');
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload Files
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
          multiple // Allow multiple file selection
        />
        <input 
          type="text" 
          value={fileNames.join(', ')} 
          placeholder="No files selected" 
          readOnly 
          className="file-name-display" 
        />
        <button 
          onClick={handleClean} 
          className="clean-btn" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;
 */

/* import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './VideoCleaner.css';
import { API_BASE_URL } from '../../config';

const VideoCleaner = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [blackFrame, setBlackFrame] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setFileNames(Array.from(files).map(file => file.name));
  };

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token retrieved from localStorage:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return false;
      }
  
      console.log('Sending request to check subscription status');
      const response = await axios.get(`${API_BASE_URL}/api/subscriptions/status`, { 
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      console.log('Subscription status response:', response.data);
      return response.data.isSubscribed;
    } catch (error) {
      console.error('Error checking subscription:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        console.error('Error status:', error.response.status);
        if (error.response.status === 401 || error.response.status === 403) {
          console.log('Unauthorized or Forbidden, redirecting to login');
          navigate('/login');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      return false;
    }
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload video files.");
      return;
    }

    console.log('Checking subscription status');
    const isSubscribed = await checkSubscription();
    console.log('Subscription status:', isSubscribed);
  
    if (!isSubscribed) {
      console.log('Not subscribed, redirecting to subscription page');
      navigate('/subscription');
      return;
    }

    setIsProcessing(true);
    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('videos', selectedFiles[i]);
    }
    formData.append('blackFrame', blackFrame);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/process-videos`, formData, {
        responseType: 'blob',
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_videos.zip');
      document.body.appendChild(link);
      link.click();
      link.remove();

      console.log('Videos processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing videos:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to process videos. Please try again later.');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Video Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload Files
        </label>
        <input 
          type="file" 
          id="fileUpload" 
          accept="video/*" 
          onChange={handleFileChange} 
          className="file-input" 
          multiple
        />
        <input 
          type="text" 
          value={fileNames.join(', ')} 
          placeholder="No files selected" 
          readOnly 
          className="file-name-display" 
        />
        <button 
          onClick={handleClean} 
          className="clean-btn" 
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Clean'}
        </button>
      </div>

      <div className="info-box">
        <p>
          Our platform only accepts video files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your video files are in one of the supported formats (e.g., MP4, AVI, MOV).
          <br />
          Multiple File Selection: You can select and upload multiple video files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner; */

/* import React, { useState, useEffect, useCallback } from 'react';
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
  const navigate = useNavigate();

  // Cleanup function
  const cleanup = useCallback(async () => {
    if (activeJobIds.length > 0) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/cancel-jobs`,
          { jobIds: activeJobIds },
          {
            headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` },
            timeout: 5000
          }
        );
        console.log('Jobs cancelled successfully');
      } catch (error) {
        console.error('Error canceling jobs:', error);
      }
    }
  }, [activeJobIds]);

  // Handle component unmount
  useEffect(() => {
    // Add beforeunload event listener
    const handleBeforeUnload = (e) => {
      if (isProcessing) {
        e.preventDefault();
        e.returnValue = 'Changes you made may not be saved.';
        cleanup();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Cleanup on component unmount
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (isProcessing) {
        cleanup();
      }
    };
  }, [isProcessing, activeJobIds, cleanup]);

  const checkJobStatus = async (jobIds) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/job-status`, {
        params: { jobIds: jobIds.join(',') },
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });

      const { statuses, allCompleted } = response.data;
      
      // Update progress for each job
      const newProgress = {};
      statuses.forEach(({ jobId, status, progress, originalName }) => {
        newProgress[jobId] = {
          status,
          progress: progress || 0,
          originalName
        };
      });
      setProgress(newProgress);

      if (allCompleted) {
        await downloadProcessedVideos(jobIds);
        setIsProcessing(false);
        setActiveJobIds([]);
      } else {
        // Continue polling
        setTimeout(() => checkJobStatus(jobIds), 2000);
      }
    } catch (error) {
      console.error('Error checking job status:', error);
      setIsProcessing(false);
      alert('Error checking processing status. Please try again.');
    }
  };

  const downloadProcessedVideos = async (jobIds) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/download-processed`, {
        params: { jobIds: jobIds.join(',') },
        responseType: 'blob',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
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
      alert('Error downloading videos. Please try again.');
    }
  };

  const handleFileChange = (event) => {
    const files = event.target.files;
    setSelectedFiles(files);
    setFileNames(Array.from(files).map(file => file.name));
  };

  const checkSubscription = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return false;
      }
  
      const response = await axios.get(`${API_BASE_URL}/api/subscriptions/status`, { 
        headers: { 'Authorization': `Bearer ${token}` }
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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/process-videos`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const jobIds = response.data.jobs.map(job => job.jobId);
      setActiveJobIds(jobIds);
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
        <label htmlFor="fileUpload" className="upload-btn">
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
          {Object.entries(progress).map(([jobId, { status, progress, originalName }]) => (
            <div key={jobId} className="progress-item">
              <div className="progress-label">{originalName || `Video ${jobId}`}</div>
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
          Multiple File Selection: You can select and upload multiple video files at once.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner; */


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
  const navigate = useNavigate();

  // Cleanup function with improved error handling
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
        // Don't show alert to user since process continues in background
      }
    }
  }, [activeJobIds]);

  // Handle component unmount with improved cleanup
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

  // Improved job status checking with exponential backoff
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
      
      // Reset retry count on successful request
      setRetryCount(0);
      
      const newProgress = {};
      statuses.forEach(({ jobId, status, progress, originalName }) => {
        newProgress[jobId] = {
          status,
          progress: progress || 0,
          originalName
        };
      });
      setProgress(newProgress);

      if (allCompleted) {
        await downloadProcessedVideos(jobIds);
        setIsProcessing(false);
        setActiveJobIds([]);
      } else {
        // Exponential backoff with maximum delay
        const baseDelay = 2000;
        const maxDelay = 10000;
        const delay = Math.min(baseDelay * Math.pow(1.5, retryCount), maxDelay);
        setTimeout(() => checkJobStatus(jobIds), delay);
      }
    } catch (error) {
      console.error('Error checking job status:', error);
      
      if (error.response?.status === 429) {
        // Rate limit hit - wait longer
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
        timeout: 30000 // Longer timeout for downloads
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

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/process-videos`, formData, {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        },
        timeout: 60000 // 1 minute timeout for uploads
      });

      const jobIds = response.data.jobs.map(job => job.jobId);
      setActiveJobIds(jobIds);
      setRetryCount(0); // Reset retry count
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
        <label htmlFor="fileUpload" className="upload-btn">
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
          {Object.entries(progress).map(([jobId, { status, progress, originalName }]) => (
            <div key={jobId} className="progress-item">
              <div className="progress-label">{originalName || `Video ${jobId}`}</div>
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
          Multiple File Selection: You can select and upload multiple video files at once.
        </p>
      </div>
    </div>
  );
};

export default VideoCleaner;