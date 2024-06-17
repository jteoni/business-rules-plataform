import axios from "axios";
import toast from "react-simple-toasts";
import { uploadFile, getFiles, downloadFile } from "./fileService";

jest.mock("axios");
jest.mock("react-simple-toasts", () => ({
  __esModule: true,
  default: jest.fn(),
}));

global.File = class MockFile {
  constructor(parts, name, options) {
    this.parts = parts;
    this.name = name;
    this.options = options;
    this.type = options.type;
  }
};

// Mock DOM elements
global.document.createElement = jest.fn(() => ({
  setAttribute: jest.fn(),
  click: jest.fn(),
}));
global.document.body.appendChild = jest.fn();
global.document.body.removeChild = jest.fn();

describe("File Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("uploadFile", () => {
    it("should initialize upload and upload file successfully", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const uploadUrl = "http://example.com/upload";
      axios.post.mockResolvedValue({ data: { upload_url: uploadUrl } });
      axios.put.mockResolvedValue({ data: "Upload successful" });

      const result = await uploadFile(file);

      // Test axios post request to initialize upload
      expect(axios.post).toHaveBeenCalledWith(
        "http://localhost:8000/files",
        {
          name: "test.txt",
          type: "text/plain",
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      // Test axios put request to upload file
      expect(axios.put).toHaveBeenCalledWith(uploadUrl, file, {
        headers: { "Content-Type": "text/plain" },
      });

      // Test toast message on successful upload
      expect(toast).toHaveBeenCalledWith("File uploaded successfully", {
        className: "success",
      });

      // Test return value from uploadFile function
      expect(result).toBe("Upload successful");
    });

    it("should handle initialization failure", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const errorMessage = "Failed to initialize upload";
      axios.post.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      // Test error handling for initialization failure
      await expect(uploadFile(file)).rejects.toThrow(errorMessage);
    });

    it("should handle upload failure", async () => {
      const file = new File(["content"], "test.txt", { type: "text/plain" });
      const uploadUrl = "http://example.com/upload";
      axios.post.mockResolvedValue({ data: { upload_url: uploadUrl } });
      axios.put.mockRejectedValue(new Error("Upload failed"));

      // Test error handling for upload failure
      try {
        await uploadFile(file);
      } catch (error) {
        expect(toast).toHaveBeenCalledWith("Failed to upload the file", {
          className: "danger",
        });
      }
    });
  });

  describe("downloadFile", () => {
    const filePath = "dummyFile.txt";
    const downloadUrl = "http://localhost:8000/download/dummyFile.txt";

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should create a link and trigger download", async () => {
      axios.get.mockResolvedValue({
        data: { download_url: downloadUrl },
      });

      const mockLink = document.createElement("a");
      document.createElement.mockReturnValue(mockLink);

      await downloadFile(filePath);

      // Test axios get request to fetch download URL
      expect(axios.get).toHaveBeenCalledWith(
        `http://localhost:8000/files/${filePath}`
      );

      // Test creation of <a> element
      expect(document.createElement).toHaveBeenCalledWith("a");

      // Test setting attributes and triggering click on <a> element
      expect(mockLink.setAttribute).toHaveBeenCalledWith("download", "");
      expect(mockLink.href).toBe(downloadUrl);
      expect(document.body.appendChild).toHaveBeenCalledWith(mockLink);
      expect(mockLink.click).toHaveBeenCalled();
      expect(document.body.removeChild).toHaveBeenCalledWith(mockLink);
    });

    it("should handle errors and show toast message", async () => {
      const errorMessage = "Network error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      // Test error handling for download failure
      await downloadFile(filePath);

      expect(toast).toHaveBeenCalledWith("Failed to download file", {
        className: "danger",
      });
    });
  });

  describe("getFiles", () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should fetch files successfully and return data", async () => {
      const mockFileData = [
        { id: 1, name: "testfile.txt" },
        { id: 2, name: "example.pdf" },
      ];
      axios.get.mockResolvedValue({ data: mockFileData });

      // Test successful fetching of files
      const result = await getFiles();

      expect(axios.get).toHaveBeenCalledWith("http://localhost:8000/files");
      expect(result).toEqual(mockFileData);
    });

    it("should handle an error when fetching files fails", async () => {
      const errorMessage = "Network error";
      axios.get.mockRejectedValue(new Error(errorMessage));

      // Test error handling for fetching files failure
      const result = await getFiles();

      expect(axios.get).toHaveBeenCalledWith("http://localhost:8000/files");
      expect(toast).toHaveBeenCalledWith("Failed to fetch files", {
        className: "danger",
      });
      expect(result).toBeUndefined(); // Since the function does not return anything on error
    });
  });
});
