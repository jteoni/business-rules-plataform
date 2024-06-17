import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { FileUploader } from './file-uploader';
import { useFileContext } from './file';
import { uploadFile } from '@/services/fileService';
import '@testing-library/jest-dom';


jest.mock('./file', () => ({
  useFileContext: jest.fn(() => ({
    state: { fileList: [], isLoading: false, filesCount: 0 },
    dispatch: jest.fn()
  })),
  FileActionType: {
    SET_FILE: "SET_FILE",
    UPLOAD_START: "UPLOAD_START",
    UPLOAD_SUCCESS: "UPLOAD_SUCCESS",
    UPLOAD_ERROR: "UPLOAD_ERROR",
    FETCHING_FILES: "FETCHING_FILES",
    FETCH_FILES_SUCCESS: "FETCH_FILES_SUCCESS",
    FETCH_FILES_ERROR: "FETCH_FILES_ERROR"
  }
}));

jest.mock('@/services/fileService', () => ({
  uploadFile: jest.fn(),
}));

describe('FileUploader Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    useFileContext.mockImplementation(() => ({
      state: { file: null, isLoading: false },
      dispatch: mockDispatch,
    }));
    uploadFile.mockResolvedValue();
  });

  it('renders without crashing', () => {
    render(<FileUploader />);
    expect(screen.getByLabelText('Choose a file')).toBeInTheDocument();
  });

  it('handles file selection', async () => {
    const file = new File(['content'], 'example.csv', { type: 'text/csv' });
    render(<FileUploader />);
    const input = screen.getByLabelText('Choose a file');
    await userEvent.upload(input, file);
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'SET_FILE', payload: { file } });
  });

  it('uploads the file when button is clicked', async () => {
    const file = new File(['content'], 'example.csv', { type: 'text/csv' });
    useFileContext.mockImplementation(() => ({
      state: { file, isLoading: false },
      dispatch: mockDispatch,
    }));
  
    render(<FileUploader />);
    const uploadButton = screen.getByText('Upload the file'); // Make sure the text matches exactly what's rendered
  
    // Make sure to wait for any effects and asynchronous operations to complete
    await userEvent.click(uploadButton);
  
    expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPLOAD_START' });
    expect(uploadFile).toHaveBeenCalledWith(file);
  
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'UPLOAD_SUCCESS' });
    });
  });  
});
