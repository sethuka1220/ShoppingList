import React from "react";
import { createContext, useState } from "react";

export const SavedDatesContext = createContext();

export const SavedDatesProvider = ({ children }) => {
  const [savedDates, setSavedDates] = useState([]);

  return (
    <SavedDatesContext.Provider value={{ savedDates, setSavedDates }}>
      {children}
    </SavedDatesContext.Provider>
  );
};
