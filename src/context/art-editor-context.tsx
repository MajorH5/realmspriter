"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface ArtEditorContextType {
  isMusicMuted: boolean;
  setMusicMuted: (isMuted: boolean) => void;
}

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [isMusicMuted, setMusicMuted] = useState(false);

  return (
    <ArtEditorContext.Provider value={{
      isMusicMuted, setMusicMuted
    }}>
      {children}
    </ArtEditorContext.Provider>
  );
};

export const useEditor = () => {
  const context = useContext(ArtEditorContext);

  if (!context) {
    throw new Error("useEditor must be used within an ArtEditorProvider");
  }

  return context;
};
