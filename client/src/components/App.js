import React, { useState, useEffect } from 'react';
import Visualization2D from './Visualization2D';
import Visualization3D from './Visualization3D'; // Import the 3D component
import DimensionSelector from './DimensionSelector'; // New component
import FileUpload from './FileUpload';
import DataProcessing from './DataProcessing';
import DataSummary from './DataSummary';
import './App.css';

function App() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [viewMode, setViewMode] = useState('2D');
  const [selectedDimensions, setSelectedDimensions] = useState({ x: 0, y: 1, z: 2 });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    let offset = 0;
    const limit = 1000;
    let allData = [];

    const loadBatch = () => {
      fetch(`/api/embeddings?offset=${offset}&limit=${limit}`)
        .then((response) => response.json())
        .then((batchData) => {
          if (isMounted) {
            allData = allData.concat(batchData);
            setData([...allData]);
            if (batchData.length === limit) {
              offset += limit;
              loadBatch();
            } else {
              setLoading(false);
            }
          }
        })
        .catch((error) => {
          console.error('Error loading data:', error);
          setLoading(false);
        });
    };

    loadBatch();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDimensionChange = (dimension, value) => {
    setSelectedDimensions(prev => ({ ...prev, [dimension]: value }));
  };

  const getVisualizedData = () => {
    return data.map(point => ({
      x: point.data[selectedDimensions.x],
      y: point.data[selectedDimensions.y],
      z: point.data[selectedDimensions.z],
    }));
  };

  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>Controls</h2>
        <p style={{color: 'red'}}>This is a test change</p> {/* Add this line */}
        <FileUpload onUpload={setData} />
        <DataProcessing data={data} onDataProcessed={setData} />
        <div className="view-mode-toggle">
          <button onClick={() => setViewMode('2D')} className={viewMode === '2D' ? 'active' : ''}>2D View</button>
          <button onClick={() => setViewMode('3D')} className={viewMode === '3D' ? 'active' : ''}>3D View</button>
        </div>
        <DimensionSelector
          dimensions={data[0] ? Object.keys(data[0]).length : 0}
          selected={selectedDimensions}
          onChange={handleDimensionChange}
        />
        <DataSummary data={data} />
      </div>
      <main className="main-content">
        {loading ? (
          <div className="loader">Loading data...</div>
        ) : (
          <>
            {viewMode === '2D' ? (
              <Visualization2D data={getVisualizedData()} />
            ) : (
              <Visualization3D data={getVisualizedData()} />
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default App;