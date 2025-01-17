import React from 'react';

const DataProcessing = ({ onProcess }) => {
  const handleNormalize = () => {
    onProcess('normalize');
  };

  const handleScale = () => {
    onProcess('scale');
  };

  const handleCluster = () => {
    onProcess('cluster');
  };

  return (
    <div>
      <h3>Data Processing</h3>
      <button onClick={handleNormalize}>Normalize</button>
      <button onClick={handleScale}>Scale (0-1)</button>
      <button onClick={handleCluster}>Cluster (K-means)</button>
    </div>
  );
};

export default DataProcessing;