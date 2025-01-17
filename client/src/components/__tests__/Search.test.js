import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Search from '../Search';

describe('Search component', () => {
  const mockData = [[1, 2], [3, 4], [5, 6]];

  it('renders search input and button', () => {
    const { getByPlaceholderText, getByRole } = render(<Search data={mockData} onSearchResult={() => {}} />);
    expect(getByPlaceholderText('Search by coordinate or index')).toBeInTheDocument();
    expect(getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('calls onSearchResult with correct point when searching by coordinate', () => {
    const mockOnSearchResult = jest.fn();
    const { getByPlaceholderText, getByRole } = render(<Search data={mockData} onSearchResult={mockOnSearchResult} />);

    fireEvent.change(getByPlaceholderText('Search by coordinate or index'), { target: { value: '3' } });
    fireEvent.click(getByRole('button', { name: 'Search' }));

    expect(mockOnSearchResult).toHaveBeenCalledWith([3, 4]);
  });

  it('calls onSearchResult with correct point when searching by index', () => {
    const mockOnSearchResult = jest.fn();
    const { getByPlaceholderText, getByRole } = render(<Search data={mockData} onSearchResult={mockOnSearchResult} />);

    fireEvent.change(getByPlaceholderText('Search by coordinate or index'), { target: { value: '2' } });
    fireEvent.click(getByRole('button', { name: 'Search' }));

    expect(mockOnSearchResult).toHaveBeenCalledWith([5, 6]);
  });
});