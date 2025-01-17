import React, { useState, useEffect } from 'react';
import Visualization2D from './components/Visualization2D';
import FileUpload from './components/FileUpload';
import DataProcessing from './components/DataProcessing';
import DataSummary from './components/DataSummary';
import Search from './components/Search';
import { kMeans } from './utils/clustering';
import './App.css';
import ExportData from './components/ExportData';

function App() {
  const [embeddings, setEmbeddings] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [colorBy, setColorBy] = useState(null);

  useEffect(() => {
    // For now, let's use some dummy data
    const dummyData = Array.from({ length: 100 }, () => [Math.random() * 100, Math.random() * 100]);
    setEmbeddings(dummyData);
  }, []);

  const handleFileUpload = (data) => {
    setEmbeddings(data);
  };

  const handlePointSelect = (point) => {
    setSelectedPoint(point);
  };

  const handleSearchResult = (point) => {
    setSelectedPoint(point);
  };

  const normalizeData = (data) => {
    const dimensions = data[0].length;
    const means = Array(dimensions).fill(0);
    const stdDevs = Array(dimensions).fill(0);

    // Calculate means
    data.forEach(point => {
      point.forEach((value, index) => {
        means[index] += value;
      });
    });
    means.forEach((sum, index) => means[index] = sum / data.length);

    // Calculate standard deviations
    data.forEach(point => {
      point.forEach((value, index) => {
        stdDevs[index] += Math.pow(value - means[index], 2);
      });
    });
    stdDevs.forEach((sum, index) => stdDevs[index] = Math.sqrt(sum / data.length));

    // Normalize the data
    return data.map(point =>
      point.map((value, index) => (value - means[index]) / stdDevs[index])
    );
  };

  const scaleData = (data) => {
    const dimensions = data[0].length;
    const mins = Array(dimensions).fill(Infinity);
    const maxs = Array(dimensions).fill(-Infinity);

    // Find min and max values for each dimension
    data.forEach(point => {
      point.forEach((value, index) => {
        mins[index] = Math.min(mins[index], value);
        maxs[index] = Math.max(maxs[index], value);
      });
    });

    // Scale the data to [0, 1]
    return data.map(point =>
      point.map((value, index) => (value - mins[index]) / (maxs[index] - mins[index]))
    );
  };

  const handleDataProcess = (processType) => {
    let processedData;
    if (processType === 'normalize') {
      processedData = normalizeData(embeddings);
    } else if (processType === 'scale') {
      processedData = scaleData(embeddings);
    } else if (processType === 'cluster') {
      const assignments = kMeans(embeddings, 3);
      processedData = embeddings.map((point, index) => [...point, assignments[index]]);
      setColorBy(2);
    }
    setEmbeddings(processedData);
  };

  return (
    <div className="App">
      <header className="header">
        <h1>Embedding Visualization App</h1>
      </header>
      <div className="sidebar">
        <FileUpload onFileUpload={handleFileUpload} />
        <DataProcessing onProcess={handleDataProcess} />
        <Search data={embeddings} onSearchResult={handleSearchResult} />
        <ExportData data={embeddings} />
      </div>
      <div className="main-content">
        <div className="visualization-container">
          <Visualization2D data={embeddings} onPointSelect={handlePointSelect} colorBy={colorBy} />
        </div>
        <div className="data-summary">
          <DataSummary data={embeddings} />
        </div>
      </div>
      {selectedPoint && (
        <div className="selected-point-info">
          <h3>Selected Point</h3>
          <p>X: {selectedPoint[0].toFixed(4)}</p>
          <p>Y: {selectedPoint[1].toFixed(4)}</p>
          {selectedPoint[2] !== undefined && <p>Cluster: {selectedPoint[2]}</p>}
        </div>
      )}
    </div>
  );
}

export default App;