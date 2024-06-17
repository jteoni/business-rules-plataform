import axios from "axios";
import toast from "react-simple-toasts";
const baseURL = import.meta.env.VITE_API_URL;

const uploadFile = async (file: File) => {
  let uploadUrl: string;
  try {
    const initResponse = await axios.post(
      `${baseURL}/files`,
      {
        name: file.name,
        type: file.type,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    uploadUrl = initResponse.data.upload_url;

    if (!uploadUrl) {
      throw new Error("Upload URL not provided by the server");
    }
  } catch (error: any) {
    throw new Error(error.message || "Failed to initialize upload");
  }
  try {
    const uploadResponse = await axios.put(uploadUrl, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
    toast("File uploaded successfully", { className: "success" });
    return uploadResponse.data;
  } catch (error: any) {
    toast("Failed to upload the file", { className: "danger" });
  }
};

const getFiles = async () => {
  try {
    const response = await axios.get(`${baseURL}/files`);
    return response.data;
  } catch (error: any) {
    toast("Failed to fetch files", { className: "danger" });
  }
};

const downloadFile = async (filePath: string) => {
  try {
    const response = await axios.get(`${baseURL}/files/${filePath}`);
    const downloadUrl = response.data.download_url;

    const link = document.createElement("a");
    link.href = downloadUrl;
    link.setAttribute("download", "");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    toast("Failed to download file", { className: "danger" });
  }
};

export { uploadFile, getFiles, downloadFile };
