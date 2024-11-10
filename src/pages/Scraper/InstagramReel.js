/* import React, { useState } from 'react';
import '../Cleaner/VideoCleaner.css'


const InstagramReel = () => {
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
      <h2>Download Instagram Reel</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Link
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
        <button onClick={handleClean} className="clean-btn">Get Reel</button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="blackFrame" 
          checked={blackFrame} 
          onChange={() => setBlackFrame(!blackFrame)} 
        />
        <label htmlFor="blackFrame">Clean Metadata</label>
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
    </div>
  );
};

export default InstagramReel;
 */

/* import React, { useState } from 'react';
import '../Cleaner/VideoCleaner.css'

const InstagramReel = () => {
  const [link, setLink] = useState('');
  const [cleanMetadata, setCleanMetadata] = useState(false);
  const [blackFrame, setBlackFrame] = useState(false);

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleDownload = () => {
    console.log(`Downloading reel from link: ${link}, Clean Metadata: ${cleanMetadata}, Black Frame: ${blackFrame}`);
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
        />
        <button onClick={handleDownload} className="clean-btn">Get Reel</button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="cleanMetadata" 
          checked={cleanMetadata} 
          onChange={() => setCleanMetadata(!cleanMetadata)} 
        />
        <label htmlFor="cleanMetadata">Clean Metadata</label>
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
    </div>
  );
};

export default InstagramReel;
 */


/* import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making requests
import '../Cleaner/VideoCleaner.css';

const InstagramReel = () => {
  const [link, setLink] = useState('');
  const [isDownloading, setIsDownloading] = useState(false); // Handle download state

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleDownload = async () => {
    if (!link) {
      alert('Please provide a valid Instagram reel link.');
      return;
    }

    setIsDownloading(true); // Set downloading state

    try {
      // Send the reel link to the backend for processing
      const response = await axios.post('http://localhost:5000/api/download-reel', { reelUrl: link }, { responseType: 'blob' });

      // Create a blob URL for the downloaded reel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.setAttribute('download', 'instagram_reel.mp4'); // Set the default download name
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement); // Clean up

      // Revoke the blob URL after use
      window.URL.revokeObjectURL(url);

      console.log('Reel downloaded successfully.');
    } catch (error) {
      console.error('Error downloading the reel:', error);
      alert('Failed to download the Instagram reel. Please check the link and try again. If error persists, try getting reel link again to generate new link');
    } finally {
      setIsDownloading(false); // Reset downloading state
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
        />
        <button onClick={handleDownload} className="clean-btn" disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Get Reel'}
        </button>
      </div>


      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="metadata" 
        />
        <label htmlFor="clean-metadata">Clean Metadata</label>
      </div>

    </div>
  );
};

export default InstagramReel;
 */

/* import React, { useState } from 'react';
import axios from 'axios'; // Import Axios for making requests
import '../Cleaner/VideoCleaner.css';

const InstagramReel = () => {
  const [link, setLink] = useState('');
  const [isDownloading, setIsDownloading] = useState(false); // Handle download state
  const [cleanMetadata, setCleanMetadata] = useState(false); // Handle clean metadata option

  const handleLinkChange = (event) => {
    setLink(event.target.value);
  };

  const handleMetadataChange = (event) => {
    setCleanMetadata(event.target.checked);
  };

  const handleDownload = async () => {
    // Check if the input link is valid
    if (!link) {
      alert('Please provide a valid Instagram reel link.');
      return;
    }

    console.log('Sending reel URL:', link); // Log the reel URL being sent

    setIsDownloading(true); // Set downloading state

    try {
      // Send the reel link and metadata option to the backend for processing
      const response = await axios.post('http://localhost:5000/api/download-reel', { 
        reelUrl: link,
        cleanMetadata: cleanMetadata // Send clean metadata option to backend
      }, { responseType: 'blob', timeout: 60000  }); //60 seconds

      // Create a blob URL for the downloaded reel
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.setAttribute('download', 'instagram_reel.mp4'); // Set the default download name
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement); // Clean up

      // Revoke the blob URL after use
      window.URL.revokeObjectURL(url);

      console.log('Reel downloaded successfully.');
    } catch (error) {
      console.error('Error downloading the reel:', error);
      alert('Failed to download the Instagram reel. Please check the link and try again. If error persists, try getting reel link again to generate a new link');
    } finally {
      setIsDownloading(false); // Reset downloading state
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
        />
        <button onClick={handleDownload} className="clean-btn" disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Get Reel'}
        </button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="metadata" 
          checked={cleanMetadata} 
          onChange={handleMetadataChange}
        />
        <label htmlFor="metadata">Clean Metadata</label>
      </div>
    </div>
  );
};

export default InstagramReel; */

/* import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../Cleaner/VideoCleaner.css';
import { API_BASE_URL } from '../../config';

const InstagramReel = () => {
  const [link, setLink] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [cleanMetadata, setCleanMetadata] = useState(false);
  const navigate = useNavigate();

  const handleLinkChange = (event) => {
    setLink(event.target.value);
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
      if (error.response && error.response.status === 401) {
        navigate('/login');
      }
      return false;
    }
  };

  const handleDownload = async () => {
    if (!link) {
      alert('Please provide a valid Instagram reel link.');
      return;
    }

    const isSubscribed = await checkSubscription();
    if (!isSubscribed) {
      navigate('/subscription');
      return;
    }

    console.log('Sending reel URL:', link);

    setIsDownloading(true);

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/download-reel`,  
        { 
          reelUrl: link,
          cleanMetadata: cleanMetadata
        }, 
        { 
          responseType: 'blob', 
          timeout: 60000,
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.setAttribute('download', 'instagram_reel.mp4');
      document.body.appendChild(linkElement);
      linkElement.click();
      document.body.removeChild(linkElement);

      window.URL.revokeObjectURL(url);

      console.log('Reel downloaded successfully.');
    } catch (error) {
      console.error('Error downloading the reel:', error);
      if (error.response && error.response.status === 401) {
        navigate('/login');
      } else {
        alert('Failed to download the Instagram reel. Please check the link and try again.');
      }
    } finally {
      setIsDownloading(false);
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
        />
        <button onClick={handleDownload} className="clean-btn" disabled={isDownloading}>
          {isDownloading ? 'Downloading...' : 'Get Reel'}
        </button>
      </div>

      <div className="checkbox-group">
        <input 
          type="checkbox" 
          id="metadata" 
          checked={cleanMetadata} 
          onChange={handleMetadataChange}
        />
        <label htmlFor="metadata">Clean Metadata</label>
      </div>
    </div>
  );
};

export default InstagramReel;

 */

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

  // Validate Instagram URL
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

      // Check if the response is an error message in JSON format
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