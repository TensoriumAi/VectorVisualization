import React from 'react';

const DataSummary = ({ data }) => {
  if (!data || data.length === 0) return null;

  const numPoints = data.length;
  const numDimensions = data[0].length;

  const summary = data[0].map((_, dimIndex) => {
    const values = data.map(point => point[dimIndex]);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    return { min, max, mean };
  });

  return (
    <div>
      <h3>Data Summary</h3>
      <p>Number of points: {numPoints}</p>
      <p>Number of dimensions: {numDimensions}</p>
      <table>
        <thead>
          <tr>
            <th>Dimension</th>
            <th>Min</th>
            <th>Max</th>
            <th>Mean</th>
          </tr>
        </thead>
        <tbody>
          {summary.map((dim, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{dim.min.toFixed(2)}</td>
              <td>{dim.max.toFixed(2)}</td>
              <td>{dim.mean.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataSummary;