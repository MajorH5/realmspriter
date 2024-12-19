"use client";

import { EditMode } from "@/utils/constants";
import React, { createContext, useContext, useState, ReactNode } from "react";

const INITIAL_EDITOR_COLOR = "#ff0000";
const INITIAL_COLOR_HISTORY = [
  '#ff0000', '#00ff00', '#0000ff',
  '#ffff00', '#ff00ff', '#00ffff',
  '#ffffff', '#000000', '#ff8800',
  '#8800ff', '#00ff88', '#ff0088'
];

interface ArtEditorContextType {
  editMode: EditMode.Type,
  setEditMode: (editMode: EditMode.Type) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;

  colorHistory: string[];
  addColorToHistory: (color: string) => void;
  removeColorFromHistory: (color: string) => void;
};

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState<EditMode.Type>(EditMode.DRAW);
  const [currentColor, setCurrentColor] = useState<string>(INITIAL_EDITOR_COLOR);
  const [colorHistory, setColorHistory] = useState<string[]>(INITIAL_COLOR_HISTORY);

  const addColorToHistory = (color: string) => {
    const index = colorHistory.findIndex((i) => color === i);

    if (index !== -1) {
      return;
    }

    const arr = colorHistory.slice();
    colorHistory.unshift(color);
    setColorHistory(arr);
  };

  const removeColorFromHistory = (color: string) => {
    const index = colorHistory.findIndex((i) => color === i);

    if (index === -1) {
      return;
    }

    const arr = colorHistory.slice();
    arr.splice(index);
    setColorHistory(arr);
  };

  return (
    <ArtEditorContext.Provider value={{
      editMode, setEditMode,
      currentColor, setCurrentColor,
      colorHistory,
      addColorToHistory,
      removeColorFromHistory
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
