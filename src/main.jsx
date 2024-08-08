import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { SavedDatesProvider } from "../src/views/components/savedDatesContext.jsx";
import { AppRoutes } from "./Routers.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <SavedDatesProvider>
        <AppRoutes />
      </SavedDatesProvider>
    </BrowserRouter>
  </React.StrictMode>
);

//関数テスト用のコンポーネント
//import TestComponent from "./test.jsx";
//<TestComponent />;
