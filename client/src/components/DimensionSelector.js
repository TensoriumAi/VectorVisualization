import React from 'react';

function DimensionSelector({ dimensions, selected, onChange }) {
  return (
    <div className="dimension-selector">
      {['x', 'y', 'z'].map(axis => (
        <div key={axis}>
          <label htmlFor={`${axis}-select`}>{axis.toUpperCase()}:</label>
          <select
            id={`${axis}-select`}
            value={selected[axis]}
            onChange={(e) => onChange(axis, parseInt(e.target.value))}
          >
            {[...Array(dimensions)].map((_, i) => (
              <option key={i} value={i}>Dimension {i}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default DimensionSelector;