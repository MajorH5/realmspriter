"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ArtEditorContextType {

}

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ArtEditorContext.Provider value={{ }}>
      {children}
    </ArtEditorContext.Provider>
  );
};

export const useArtEditor = () => {
  const context = useContext(ArtEditorContext);

  if (!context) {
    throw new Error("useArtEditor must be used within an ArtEditorProvider");
  }

  return context;
};
