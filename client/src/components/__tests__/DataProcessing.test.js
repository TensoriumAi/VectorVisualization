import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import DataProcessing from '../DataProcessing';

describe('DataProcessing component', () => {
  it('renders all processing buttons', () => {
    const { getByText } = render(<DataProcessing onProcess={() => {}} />);
    expect(getByText('Normalize')).toBeInTheDocument();
    expect(getByText('Scale (0-1)')).toBeInTheDocument();
    expect(getByText('Cluster (K-means)')).toBeInTheDocument();
  });

  it('calls onProcess with correct argument when buttons are clicked', () => {
    const mockOnProcess = jest.fn();
    const { getByText } = render(<DataProcessing onProcess={mockOnProcess} />);

    fireEvent.click(getByText('Normalize'));
    expect(mockOnProcess).toHaveBeenCalledWith('normalize');

    fireEvent.click(getByText('Scale (0-1)'));
    expect(mockOnProcess).toHaveBeenCalledWith('scale');

    fireEvent.click(getByText('Cluster (K-means)'));
    expect(mockOnProcess).toHaveBeenCalledWith('cluster');
  });
});