"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import {
  EditMode,
  MAX_ZOOM_LEVEL,
  INITIAL_EDITOR_COLOR,
  INITIAL_COLOR_HISTORY,
  INITIAL_ART_SIZE
} from "@/utils/constants";

interface ArtEditorContextType {
  editMode: EditMode.Type;
  setEditMode: (editMode: EditMode.Type) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;

  colorHistory: string[];
  addColorToHistory: (color: string) => void;
  removeColorFromHistory: (color: string) => void;

  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;

  artSize: [number, number];
  setArtSize: (artSize: [number, number]) => void;
};

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState<EditMode.Type>(EditMode.DRAW);
  const [currentColor, setCurrentColor] = useState(INITIAL_EDITOR_COLOR);
  const [colorHistory, setColorHistory] = useState(INITIAL_COLOR_HISTORY);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [artSize, setArtSize] = useState<[number, number]>(INITIAL_ART_SIZE);

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

  const safeSetZoomLevel = (zoomLevel: number) => {
    if (zoomLevel < 0) {
      zoomLevel = 0;
    } else if (zoomLevel > MAX_ZOOM_LEVEL) {
      zoomLevel = MAX_ZOOM_LEVEL
    }

    setZoomLevel(zoomLevel);
  };

  return (
    <ArtEditorContext.Provider value={{
      editMode, setEditMode,
      currentColor, setCurrentColor,
      colorHistory,
      addColorToHistory,
      removeColorFromHistory,
      zoomLevel, setZoomLevel: safeSetZoomLevel,
      artSize, setArtSize
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
