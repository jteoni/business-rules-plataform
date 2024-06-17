import { ReactElement } from "react";
import { FileUploader } from "./file-uploader";
import FilesTable from "./files-table";


function Layout(): ReactElement {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-8 mx-auto max-w-4xl w-full">
        <FileUploader />
      </main>
      <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-4 sm:gap-8 mx-auto max-w-4xl w-full">
        <FilesTable />  
      </main>
    </div>
  );
}

export { Layout };
