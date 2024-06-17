import axios from 'axios';
import toast from 'react-simple-toasts';
import { uploadFile, getFiles, downloadFile } from './fileService';


jest.mock('axios');
jest.mock('react-simple-toasts', () => ({
    __esModule: true,
    default: jest.fn()
}));


global.File = class MockFile {
    constructor(parts, name, options) {
        this.parts = parts;
        this.name = name;
        this.options = options;
        this.type = options.type;
    }
};

// Mock para elementos do DOM
global.document.createElement = jest.fn();
global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn();


describe('File Service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('uploadFile', () => {
        it('should initialize upload and upload file successfully', async () => {
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            const uploadUrl = 'http://example.com/upload';
            axios.post.mockResolvedValue({ data: { upload_url: uploadUrl } });
            axios.put.mockResolvedValue({ data: 'Upload successful' });
            const result = await uploadFile(file);

            expect(axios.post).toHaveBeenCalledWith('http://localhost:8000/files', {
                name: 'test.txt',
                type: 'text/plain'
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            expect(axios.put).toHaveBeenCalledWith(uploadUrl, file, {
                headers: { 'Content-Type': 'text/plain' }
            });
            expect(toast).toHaveBeenCalledWith('File uploaded successfully', { className: 'success' });
            expect(result).toBe('Upload successful');
        });

        it('should handle initialization failure', async () => {
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            const errorMessage = 'Failed to initialize upload';
            axios.post.mockRejectedValue({ response: { data: { message: errorMessage } } });

            await expect(uploadFile(file)).rejects.toThrow(errorMessage);
        });

        it('should handle upload failure', async () => {
            const file = new File(['content'], 'test.txt', { type: 'text/plain' });
            const uploadUrl = 'http://example.com/upload';
            axios.post.mockResolvedValue({ data: { upload_url: uploadUrl } });
            axios.put.mockRejectedValue(new Error('Upload failed'));

            try {
                await uploadFile(file);
            } catch (error) {
                expect(toast).toHaveBeenCalledWith('Failed to upload the file', { className: 'danger' });
            }
        });
    });

    describe('downloadFile', () => {
        const filePath = 'dummyFile.txt';
        const downloadUrl = 'http://localhost:8000/download/dummyFile.txt';

        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('should create a link and trigger download', async () => {
            // Configurar axios mock
            axios.get.mockResolvedValue({
                data: { download_url: downloadUrl }
            });

            // Mock para o elemento <a>
            const mockLink = {
                href: '',
                setAttribute: jest.fn(),
                click: jest.fn()
            };
            document.createElement.mockReturnValue(mockLink);

            await downloadFile(filePath);

            expect(axios.get).toHaveBeenCalledWith(`http://localhost:8000/files/${filePath}`);
            expect(document.createElement).toHaveBeenCalledWith('a');
            expect(mockLink.setAttribute).toHaveBeenCalledWith('download', '');
            expect(mockLink.href).toBe(downloadUrl);
            expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
            expect(mockLink.click).toHaveBeenCalled();
            expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
        });

        it('should handle errors and show toast message', async () => {
            // Configurar axios para rejeitar a chamada
            const errorMessage = 'Network error';
            axios.get.mockRejectedValue(new Error(errorMessage));

            await downloadFile(filePath);

            expect(toast).toHaveBeenCalledWith('Failed to download file', { className: 'danger' });
        });
    });

    describe('getFiles', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });
    
        it('should fetch files successfully and return data', async () => {
            // Mock axios.get to resolve with some dummy file data
            const mockFileData = [{ id: 1, name: 'testfile.txt' }, { id: 2, name: 'example.pdf' }];
            axios.get.mockResolvedValue({ data: mockFileData });
    
            const result = await getFiles();
    
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/files');
            expect(result).toEqual(mockFileData);
        });
    
        it('should handle an error when fetching files fails', async () => {
            // Mock axios.get to reject with an error
            const errorMessage = 'Network error';
            axios.get.mockRejectedValue(new Error(errorMessage));
    
            const result = await getFiles();
    
            expect(axios.get).toHaveBeenCalledWith('http://localhost:8000/files');
            expect(toast).toHaveBeenCalledWith('Failed to fetch files', { className: 'danger' });
            expect(result).toBeUndefined();  // Since the function does not return anything on error
        });
    });
    
});
