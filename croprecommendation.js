import React, { useState } from 'react';
import axios from 'axios';

function CropRecommendation() {
  const [cropData, setCropData] = useState({});
  const [prediction, setCropPrediction] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const handleCropRecommendation = async (event) => {
    event.preventDefault();
    setLoading(true);
    setCropPrediction('');
    setSuccessMessage('');

    try {
      const response = await axios.get(
        `http://aws-crop-yield-env.eba-iwt38pnf.ap-south-1.elasticbeanstalk.com/predict`,
        {
          params: {
            N: cropData.nitrogen || 0,
            P: cropData.phosphorus || 0,
            K: cropData.pottasium || 0,
            temperature: cropData.temperature || 0,
            humidity: cropData.humidity || 0,
            ph: cropData.ph || 0,
            rainfall: cropData.rainfall || 0,
          },
        }
      );
      const recommendedCrop = response.data?.prediction?.[0] || 'Unknown';
      const success = response.data?.success;

      setCropPrediction(recommendedCrop);
      setSuccessMessage(
        success
          ? 'Crop recommendation successful!'
          : 'Failed to fetch recommendation.'
      );
    } catch (error) {
      console.error('Error fetching crop recommendation:', error);
      setSuccessMessage(
        'Failed to fetch crop recommendation. Please try again.'
      );
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
      }}
    >
      <h2>Crop Recommendation</h2>
      <form
        onSubmit={handleCropRecommendation}
        style={{
          display: 'grid ',
          gap: '10px',
          justifyItems: 'center',
          textAlign: 'left',
        }}
      >
        <input
          type="text"
          placeholder="Enter nitrogen %"
          onChange={(e) =>
            setCropData({ ...cropData, nitrogen: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter phosphorus (%)"
          onChange={(e) =>
            setCropData({ ...cropData, phosphorus: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter potassium (%)"
          onChange={(e) =>
            setCropData({ ...cropData, pottasium: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter temperature (°C)"
          onChange={(e) =>
            setCropData({ ...cropData, temperature: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter humidity (%)"
          onChange={(e) =>
            setCropData({ ...cropData, humidity: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter pH level"
          onChange={(e) => setCropData({ ...cropData, ph: e.target.value })}
          style={{ padding: '8px', width: '100%' }}
        />
        <input
          type="text"
          placeholder="Enter rainfall (mm)"
          onChange={(e) =>
            setCropData({ ...cropData, rainfall: e.target.value })
          }
          style={{ padding: '8px', width: '100%' }}
        />
        <button type="submit" style={{ padding: '8px', width: '100%' }}>
          Get Crop Recommendation
        </button>
      </form>

      {loading && <p>Loading...</p>}
      {!loading && prediction && (
        <div>
          <h3 style={{ color: 'orangered' }}>Recommended Crop: {prediction}</h3>
        </div>
      )}
      {!loading && successMessage && <p>{successMessage}</p>}
    </div>
  );
}
export default CropRecommendation;
