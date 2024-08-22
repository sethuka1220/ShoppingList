import React from "react";
import { Route, Routes } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { HistoryList } from "./views/components/HistoryList.jsx";
import { HistoryDates } from "./views/components/HistoryDates.jsx";
import { App } from "./views/components/App.jsx";

export const AppRoutes = () => {
  return (
    <AnimatePresence>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/historyList" element={<HistoryList />} />
        <Route path="/historyDates" element={<HistoryDates />} />;
      </Routes>
    </AnimatePresence>
  );
};

// テスト用
//import { TestApp } from "./test.jsx";
//<Route path="/testDates" element={<TestApp />} />;
