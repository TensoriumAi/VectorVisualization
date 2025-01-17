import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FileUpload from '../FileUpload';

global.fetch = jest.fn();

describe('FileUpload component', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('renders file input and upload button', () => {
    const { getByText, getByRole } = render(<FileUpload onFileUpload={() => {}} />);
    expect(getByRole('button', { name: 'Upload' })).toBeInTheDocument();
    expect(getByRole('textbox')).toBeInTheDocument();
  });

  it('displays file preview when file is selected', async () => {
    const { getByRole, findByText } = render(<FileUpload onFileUpload={() => {}} />);
    const file = new File(['1,2\n3,4\n5,6'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(getByRole('textbox'), { target: { files: [file] } });
    
    await findByText('File Preview:');
    expect(await findByText('1,2')).toBeInTheDocument();
  });

  it('calls onFileUpload when file is uploaded successfully', async () => {
    const mockOnFileUpload = jest.fn();
    fetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve([[1, 2], [3, 4]])
    });

    const { getByRole } = render(<FileUpload onFileUpload={mockOnFileUpload} />);
    const file = new File(['1,2\n3,4'], 'test.csv', { type: 'text/csv' });
    fireEvent.change(getByRole('textbox'), { target: { files: [file] } });
    fireEvent.click(getByRole('button', { name: 'Upload' }));

    await waitFor(() => expect(mockOnFileUpload).toHaveBeenCalledWith([[1, 2], [3, 4]]));
  });
});