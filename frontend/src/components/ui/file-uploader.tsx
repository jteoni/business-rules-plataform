import React from 'react';
import { uploadFile } from '@/services/fileService.ts';
import { FileActionType, useFileContext } from './file.tsx';


const FileUploader = () => {
  const { state, dispatch } = useFileContext();
  const { file, isLoading } = state;

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFile = event.target.files[0];
      if (newFile) {
        dispatch({ type: FileActionType.SET_FILE, payload: { file: newFile } });
        
      }
    }
  };

  const handleUploadFile = (file: File) => async () => {
    try {
      dispatch({ type: FileActionType.UPLOAD_START });
      await uploadFile(file);
    } catch (error) {
      dispatch({ type: FileActionType.UPLOAD_ERROR });
    }
    finally {
      dispatch({ type: FileActionType.UPLOAD_SUCCESS });
    }
  }

  return (
    <div className = "flex flex-col gap-6">
      <div>
        <label htmlFor="file" className="sr-only">
          Choose a file
        </label>
        <input id="file" type="file" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,application/vnd.ms-excel,text/csv" onChange={handleFileChange} />
      </div>
      {file && (
        <section>
          <p className="pb-6">File details:</p>
          <ul>
            <li>Name: {file.name}</li>
            <li>Type: {file.type}</li>
            <li>Size: {file.size} bytes</li>
          </ul>
        </section>
      )}
      {file && 
        <button
          className="rounded-lg bg-green-800 text-white px-4 py-2 border-none font-semibold"
          onClick={handleUploadFile(file)}
        >
          { isLoading ? 'Uploading...' : 'Upload the file'}
        </button>
      }
    </div>
  );
};

export { FileUploader };
