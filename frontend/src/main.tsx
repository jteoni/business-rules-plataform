import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { FileProvider } from "./components/ui/file";

import * as Components from "./components";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <FileProvider>
        <Components.Layout />
      </FileProvider>
    </BrowserRouter>
  </React.StrictMode>
);
