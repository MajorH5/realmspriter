"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

import {
  EditMode,
  MAX_ZOOM_LEVEL,
  INITIAL_EDITOR_COLOR,
  INITIAL_COLOR_HISTORY,
  INITIAL_ART_SIZE,
  MAX_ART_SIZE
} from "@/utils/constants";
import { hexToRGB, RGBtohex } from "@/utils/utility";

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

  artSize: { x: number, y: number };
  setArtSize: (artSize: {x: number, y: number}) => void;

  image: {pixels: Uint8ClampedArray};
  clearImage: () => void;
  setPixel: (x: number, y: number, color: string | null) => void;
  getPixel: (x: number, y: number) => string | null;
};

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState<EditMode.Type>(EditMode.DRAW);
  const [currentColor, setCurrentColor] = useState(INITIAL_EDITOR_COLOR);
  const [colorHistory, setColorHistory] = useState(INITIAL_COLOR_HISTORY);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [artSize, setArtSize] = useState<{x: number, y: number}>(INITIAL_ART_SIZE);
  const [image, setImage] = useState({ pixels: new Uint8ClampedArray(artSize.x * artSize.y * 4) });

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

  const safeSetArtSize = (size: { x: number, y: number }) => {
    if (size.x <= 0) size.x = 1;
    if (size.y <= 0) size.y = 1;
    if (size.x > MAX_ART_SIZE.x) size.x = MAX_ART_SIZE.x;
    if (size.y > MAX_ART_SIZE.y) size.y = MAX_ART_SIZE.y;

    // resize pixels
    setImage({ pixels: new Uint8ClampedArray(size.x * size.y * 4) });
    setArtSize(size);
  };

  const setPixel = (x: number, y: number, color: string | null) => {
    if (getPixel(x, y) === color) return;

    const index = (y * artSize.x + x) * 4;

    if (index < 0 || index >= image.pixels.length) {
      return;
    }
    
    let r = 0, g = 0, b = 0, a = 0;

    if (color !== null) {
      const values = hexToRGB(color);

      r = values.r, g = values.g, b = values.b;
      a = 255;
    }

    image.pixels[index + 0] = r;
    image.pixels[index + 1] = g;
    image.pixels[index + 2] = b;
    image.pixels[index + 3] = a;

    // trying to avoid large repeated array copying
    setImage({ pixels: image.pixels });
  };

  const getPixel = (x: number, y: number): string | null => {
    const index = (y * artSize.x + x) * 4;

    if (index < 0 || index >= image.pixels.length) {
      return null;
    }

    const r = image.pixels[index + 0];
    const g = image.pixels[index + 1];
    const b = image.pixels[index + 2];
    const a = image.pixels[index + 3];

    if (a === 255) {
      return RGBtohex({ r, g, b});
    } else {
      return null;
    }
  };

  const clearImage = () => {
    setImage({ pixels: new Uint8ClampedArray(artSize.x * artSize.y * 4) });
  };

  return (
    <ArtEditorContext.Provider value={{
      editMode, setEditMode,
      currentColor, setCurrentColor,
      colorHistory,
      addColorToHistory,
      removeColorFromHistory,
      zoomLevel, setZoomLevel: safeSetZoomLevel,
      artSize, setArtSize: safeSetArtSize,
      image, setPixel, getPixel,
      clearImage
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
