import React from 'react';
import { render } from '@testing-library/react';
import Visualization2D from '../Visualization2D';

describe('Visualization2D component', () => {
  it('renders without crashing', () => {
    const dummyData = [[1, 2], [3, 4], [5, 6]];
    const { container } = render(<Visualization2D data={dummyData} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('renders correct number of circles', () => {
    const dummyData = [[1, 2], [3, 4], [5, 6]];
    const { container } = render(<Visualization2D data={dummyData} />);
    expect(container.querySelectorAll('circle').length).toBe(dummyData.length);
  });
});