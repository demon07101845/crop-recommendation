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
        'http://3.108.236.27:8000/predict',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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

      <form
        onSubmit={handleSubmit}
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{
            marginBottom: '85px',
            display: 'block',
            padding: '10px',
          }}
        />

        {preview && (
          <div style={{ marginTop: '20px', width: '100%' }}>
            <h4>Uploaded Image:</h4>
            <img
              src={preview}
              alt="Uploaded preview"
              style={{
                maxWidth: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                display: 'block',
                margin: 'auto',
                border: '1px solid #ccc',
                borderRadius: '10px',
                marginBottom: '20px', // Added spacing to fix overlapping
              }}
            />
          </div>
        )}

        {image && (
          <button
            type="submit"
            style={{
              padding: '10px 15px',
              marginTop: '10px',
              backgroundColor: '#28a745',
              color: 'white',
              border: 'none',
              cursor: 'pointer',
              fontSize: '16px',
              borderRadius: '5px',
              width: '100%',
            }}
          >
            Detect Disease
          </button>
        )}
      </form>

      {loading && <p>Loading...</p>}

      {result && (
        <div style={{ marginTop: '20px' }}>
          <h4>Prediction Result:</h4>
          <p style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
            {result}
          </p>
        </div>
      )}
    </div>
  );
}

export default CropDiseaseDetection;
