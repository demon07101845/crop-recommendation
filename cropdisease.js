import React, { useState } from 'react';
import axios from 'axios';

function CropDiseaseDetection() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);

    // Create an image preview URL
    if (file) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!image) {
      alert('Please upload an image!');
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append('img', image);

    try {
      const response = await axios.post(
        'http://ec2-13-126-80-135.ap-south-1.compute.amazonaws.com:8000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      // Process the prediction result to replace underscores with spaces
      const formattedResult = response.data.prediction.replace(/_/g, ' ');
      setResult(formattedResult);
    } catch (error) {
      console.error('Error detecting crop disease:', error);
      setResult('Error detecting crop disease.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '20px',
        textAlign: 'center',
        maxWidth: '500px',
        margin: 'auto',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <h2>Crop Disease Detection</h2>

      {/* File Input Controls */}
      <div style={{ marginBottom: '10px' }}>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ marginBottom: '10px' }}
        />
      </div>

      {/* Detect Button - Always visible and accessible */}
      <div style={{ marginBottom: '20px', position: 'relative', zIndex: 10 }}>
        <button
          onClick={handleSubmit}
          style={{
            padding: '8px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold',
          }}
        >
          Detect Disease
        </button>
      </div>

      {/* Loading Indicator */}
      {loading && (
        <div
          style={{
            margin: '10px 0',
            padding: '8px',
            backgroundColor: '#e8f5e9',
            borderRadius: '5px',
          }}
        >
          <p style={{ fontWeight: 'bold', margin: '0' }}>Analyzing image...</p>
        </div>
      )}

      {/* Image Preview - Smaller and constrained */}
      {preview && (
        <div
          style={{
            marginTop: '10px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#f9f9f9',
            maxHeight: '250px',
            overflow: 'auto',
          }}
        >
          <h4 style={{ marginTop: '0', marginBottom: '8px' }}>
            Uploaded Image:
          </h4>
          <img
            src={preview}
            alt="Uploaded preview"
            style={{
              maxWidth: '100%',
              maxHeight: '180px',
              borderRadius: '5px',
            }}
          />
        </div>
      )}

      {/* Results Section */}
      {result && (
        <div
          style={{
            marginTop: '15px',
            border: '1px solid #4CAF50',
            borderRadius: '8px',
            padding: '10px',
            backgroundColor: '#f0f7f0',
          }}
        >
          <h4 style={{ marginTop: '0', marginBottom: '8px' }}>
            Prediction Result:
          </h4>
          <p
            style={{
              fontSize: '16px',
              color: 'black',
              fontWeight: 'bold',
              margin: '0',
            }}
          >
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default CropDiseaseDetection;
