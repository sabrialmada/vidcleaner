/* import React, { useState } from 'react';
import './VideoCleaner.css'


const ImageCleaner = () => {
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
      <h2>Image Cleaner</h2>

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

      <div className="info-box">
        <p>
          Our platform only accepts image files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your files have a valid image extension.
          <br />
          Multiple File Selection: You can select and upload multiple image files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default ImageCleaner;
 */


/* import React, { useState } from 'react';
import axios from 'axios';
import './VideoCleaner.css';

const ImageCleaner = () => {
  const [fileNames, setFileNames] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]); // Store multiple files
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files); // Convert FileList to an array
    setSelectedFiles(files); // Set the files themselves
    setFileNames(files.map(file => file.name)); // Set the file names for display
  };

  const handleClean = async () => {
    if (selectedFiles.length === 0) {
      alert("Please upload image files.");
      return;
    }

    setIsProcessing(true); // Set processing state to true
    const formData = new FormData();

    selectedFiles.forEach((file) => {
      formData.append('images', file); // Append each image file to form data
    });

    try {
      const response = await axios.post('http://localhost:5000/api/process-images', formData, {
        responseType: 'blob', // Important: the response is going to be a binary file (zip)
      });

      // Create a URL for the processed file (zip)
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'processed_images.zip'); // Specify the download name
      document.body.appendChild(link);
      link.click();
      link.remove(); // Clean up after download

      console.log('Images processed and downloaded successfully.');
    } catch (error) {
      console.error('Error processing images:', error);
      alert('Failed to process images. Please try again later.');
    } finally {
      setIsProcessing(false); // Reset processing state after completion
    }
  };

  return (
    <div className="image-cleaner-container">
      <h2>Image Cleaner</h2>

      <div className="file-upload">
        <label htmlFor="fileUpload" className="upload-btn">
          Upload Files
        </label>
        <input
          type="file"
          id="fileUpload"
          accept="image/*"
          multiple // Enable multiple file selection
          onChange={handleFileChange}
          className="file-input"
        />
        <div className="file-name-display">
          {fileNames.length > 0 ? fileNames.join(', ') : 'No files selected'}
        </div>
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
          Our platform only accepts image files. Please do not upload ZIP files, directories, or any other types of files.
          <br />
          Supported Formats: Ensure your files have a valid image extension.
          <br />
          Multiple File Selection: You can select and upload multiple image files at once for your convenience.
        </p>
      </div>
    </div>
  );
};

export default ImageCleaner;
 */