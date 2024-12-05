
import React, { useState, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Cleaner/VideoCleaner.css';
import { API_BASE_URL } from '../../config';

const InstagramReel = () => {
  const [link, setLink] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [cleanMetadata, setCleanMetadata] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  // validate instagram url
  const isValidInstagramUrl = useCallback((url) => {
    const regex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/(?:reel|p)\/[A-Za-z0-9_-]+\/?(?:\?.*)?|instagram\.com\/.*?\/(?:reel|p)\/[A-Za-z0-9_-]+\/?(?:\?.*)?)$/;
    return regex.test(url.trim());
  }, []);

  const handleLinkChange = (event) => {
    setLink(event.target.value);
    setErrorMessage('');
  };

  const handleMetadataChange = (event) => {
    setCleanMetadata(event.target.checked);
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
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        setErrorMessage('Error checking subscription status. Please try again.');
      }
      return false;
    }
  };

  const downloadFile = async (blobData, filename) => {
    try {
      const url = window.URL.createObjectURL(blobData);
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.setAttribute('download', filename);
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);
      window.URL.revokeObjectURL(url);
      return true;
    } catch (error) {
      console.error('Error downloading file:', error);
      return false;
    }
  };

  const handleDownload = async () => {
    setErrorMessage('');
    setDownloadProgress(0);

    if (!link) {
      setErrorMessage('Please provide an Instagram reel link.');
      return;
    }

    if (!isValidInstagramUrl(link)) {
      setErrorMessage('Please provide a valid Instagram reel link.');
      return;
    }

    const isSubscribed = await checkSubscription();
    if (!isSubscribed) {
      navigate('/subscription');
      return;
    }

    console.log('Starting download for:', link.trim());
    setIsDownloading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${API_BASE_URL}/api/download-reel`,
        {
          reelUrl: link.trim(),
          cleanMetadata: cleanMetadata
        },
        {
          responseType: 'blob',
          timeout: 300000, // 5 minutes
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json, video/mp4'
          },
          onDownloadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / (progressEvent.total || 0)
            );
            setDownloadProgress(percentCompleted || 0);
          }
        }
      );

      // check if response is an error message in json format
      if (response.data.type === 'application/json') {
        const reader = new FileReader();
        reader.onload = () => {
          const errorData = JSON.parse(reader.result);
          setErrorMessage(errorData.message || 'Failed to download the reel.');
        };
        reader.readAsText(response.data);
        return;
      }

      const success = await downloadFile(response.data, 'instagram_reel.mp4');
      if (success) {
        console.log('Reel downloaded successfully.');
      } else {
        setErrorMessage('Error saving the file. Please try again.');
      }
    } catch (error) {
      console.error('Error downloading the reel:', error);

      let message = 'Failed to download the Instagram reel.';
      if (error.response) {
        if (error.response.status === 401) {
          navigate('/login');
          return;
        }
        message = error.response.data?.message || message;
      } else if (error.code === 'ECONNABORTED') {
        message = 'Download timed out. Please try again.';
      } else if (!navigator.onLine) {
        message = 'No internet connection. Please check your connection and try again.';
      }
      setErrorMessage(message);
    } finally {
      setIsDownloading(false);
      setDownloadProgress(0);
    }
  };

  return (
    <div className="video-cleaner-container">
      <h2>Download Instagram Reel</h2>

      <div className="file-upload">
        <label htmlFor="reelLink" className="upload-btn">
          Link
        </label>
        <input
          type="text"
          id="reelLink"
          value={link}
          placeholder="Instagram reel link here..."
          onChange={handleLinkChange}
          className="file-name-display"
          disabled={isDownloading}
        />
        <button
          onClick={handleDownload}
          className="clean-btn"
          disabled={isDownloading || !link.trim()}
        >
          {isDownloading ? 'Downloading...' : 'Get Reel'}
        </button>
      </div>

      {isDownloading && downloadProgress > 0 && (
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{ width: `${downloadProgress}%` }}
          />
          <span className="progress-text">{downloadProgress}%</span>
        </div>
      )}

      {errorMessage && (
        <div className="error-message">
          {errorMessage}
        </div>
      )}

      <div className="checkbox-group">
        <input
          type="checkbox"
          id="metadata"
          checked={cleanMetadata}
          onChange={handleMetadataChange}
          disabled={isDownloading}
        />
        <label htmlFor="metadata">Clean Metadata</label>
      </div>
    </div>
  );
};

export default InstagramReel;