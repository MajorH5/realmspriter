"use client";

import { EditMode } from "@/utils/constants";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface ArtEditorContextType {
  editMode: EditMode.Type,
  setEditMode: (editMode: EditMode.Type) => void;
};

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState<EditMode.Type>(EditMode.DRAW);

  return (
    <ArtEditorContext.Provider value={{
      editMode, setEditMode
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
