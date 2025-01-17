import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

describe('App component', () => {
  it('renders welcome message', () => {
    render(<App />);
    expect(screen.getByText('Embedding Visualization App')).toBeInTheDocument();
    expect(screen.getByText('Welcome to the Embedding Visualization Application!')).toBeInTheDocument();
  });
});