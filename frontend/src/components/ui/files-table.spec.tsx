import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import FilesTable from './files-table.tsx';
import { useFileContext } from './file.tsx';
import * as fileService from '@/services/fileService';
import '@testing-library/jest-dom';



jest.mock('./file.tsx', () => ({
  useFileContext: jest.fn(() => ({
    state: { fileList: [], isLoading: false, filesCount: 0 },
    dispatch: jest.fn()
  })),
  FileActionType: {  // Make sure this is included if it's part of the same file
    FETCHING_FILES: 'FETCHING_FILES',
    FETCH_FILES_SUCCESS: 'FETCH_FILES_SUCCESS',
    FETCH_FILES_ERROR: 'FETCH_FILES_ERROR'
  }
}));


jest.mock('@/services/fileService', () => ({
  getFiles: jest.fn(),
  downloadFile: jest.fn()
}));

describe('FilesTable Component', () => {
  beforeEach(() => {
    useFileContext.mockImplementation(() => ({
      state: { fileList: [], isLoading: false, filesCount: 0 },
      dispatch: jest.fn()
    }));

    fileService.getFiles.mockResolvedValue({
      files: [{ id: '1', name: 'testfile.txt', type: 'text/plain', created_at: new Date(), path: 'testfile.txt' }],
      count: 1
    });
  });

  it('renders without crashing', () => {
    const { getByText } = render(<FilesTable />);
    expect(getByText('Importação arquivos')).toBeInTheDocument();
  });

  it('dispatches action to fetch files on mount', async () => {
    const dispatch = jest.fn();
    useFileContext.mockImplementation(() => ({
      state: { fileList: [], isLoading: true, filesCount: 0 },
      dispatch
    }));

    render(<FilesTable />);
    await waitFor(() => expect(dispatch).toHaveBeenCalledWith({ type: 'FETCHING_FILES' }));
  });

  it('handles file download', async () => {
    const files = [{ id: '1', name: 'testfile.txt', type: 'text/plain', created_at: new Date(), path: 'testfile.txt' }];
    useFileContext.mockImplementation(() => ({
      state: { fileList: files, isLoading: false, filesCount: 1 },
      dispatch: jest.fn()
    }));

    const { getByText } = render(<FilesTable />);
    const downloadButton = getByText('Download');
    fireEvent.click(downloadButton);
    await waitFor(() => expect(fileService.downloadFile).toHaveBeenCalledWith('testfile.txt'));
  });
});

