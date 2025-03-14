"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

import {
  EditMode,
  INITIAL_EDITOR_COLOR,
  INITIAL_COLOR_HISTORY,
  INITIAL_ART_SIZE,
  MAX_ART_SIZE,
  MIN_ZOOM_LEVEL,
  MAX_ZOOM_LEVEL,
  ZOOM_LEVEL_INCREMENT,
  SpriteMode
} from "@/utils/constants";
import { hexToRGB, RGBtohex } from "@/utils/utility";
import { ActionType } from "./history/history-types";
import { useHistory, HistoryType } from "./history/history-context";
import HistoryActions from "./history/history-actions";

interface ArtEditorContextType {
  editMode: EditMode.Type;
  setEditMode: (editMode: EditMode.Type) => void;

  currentColor: string;
  setCurrentColor: (color: string) => void;

  colorHistory: string[];
  addColorToHistory: (color: string) => void;
  removeColorFromHistory: (color: string) => void;

  artSize: { x: number, y: number };
  setArtSize: (artSize: { x: number, y: number }, storeInHistory?: boolean) => void;

  spriteMode: SpriteMode.Type;
  setSpriteMode: (spriteMode: SpriteMode.Type, storeInHistory?: boolean) => void;

  zoomLevel: number;
  setZoomLevel: (zoomLevel: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;

  image: { pixels: Uint8ClampedArray };
  setImage: (image: { pixels: Uint8ClampedArray }) => void;
  previewImage: { pixels: Uint8ClampedArray } | null;
  setPreviewImage: (image: { pixels: Uint8ClampedArray } | null) => void;

  clearImage: (storeInHistory?: boolean) => void;
  setPixel: (x: number, y: number, color: string | null, storeInHistory?: boolean) => void;
  getPixel: (x: number, y: number) => string | null;
};

const ArtEditorContext = createContext<ArtEditorContextType | undefined>(undefined);

export const ArtEditorProvider = ({ children }: { children: ReactNode }) => {
  const [editMode, setEditMode] = useState<EditMode.Type>(EditMode.DRAW);
  const [currentColor, setCurrentColor] = useState(INITIAL_EDITOR_COLOR);
  const [colorHistory, setColorHistory] = useState(INITIAL_COLOR_HISTORY);
  const [artSize, setArtSize] = useState<{ x: number, y: number }>(INITIAL_ART_SIZE);
  const [image, setImage] = useState({ pixels: new Uint8ClampedArray(artSize.x * artSize.y * 4) });
  const [previewImage, setPreviewImage] = useState<{ pixels: Uint8ClampedArray } | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [spriteMode, setSpriteMode] = useState<SpriteMode.Type>(SpriteMode.OBJECTS);

  const { updateCurrentAction, closeCurrentAction } = useHistory();

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

  const safeSetArtSize = (size: { x: number, y: number }, storeInHistory: boolean = false) => {
    if (size.x <= 0) size.x = 1;
    if (size.y <= 0) size.y = 1;
    if (size.x > MAX_ART_SIZE.x) size.x = MAX_ART_SIZE.x;
    if (size.y > MAX_ART_SIZE.y) size.y = MAX_ART_SIZE.y;

    if (storeInHistory) {
      updateCurrentAction(ActionType.SPRITE_RESIZE, {
        from: [artSize, { pixels: new Uint8ClampedArray(image.pixels) }],
        to: [size, null], editorContext
      });
      closeCurrentAction();
    }

    // resize pixels
    setImage({ pixels: new Uint8ClampedArray(size.x * size.y * 4) });
    setArtSize(size);
  };

  const setPixel = (x: number, y: number, color: string | null, storeInHistory: boolean = false) => {
    const oldColor = getPixel(x, y);
    if (oldColor === color) return;

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

    if (storeInHistory) {
      // update history
      updateCurrentAction(ActionType.PIXEL_EDIT, {
        x, y, color: oldColor, editorContext
      });
    }
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
      return RGBtohex({ r, g, b });
    } else {
      return null;
    }
  };

  const clearImage = (storeInHistory: boolean = false) => {
    if (storeInHistory) {
      updateCurrentAction(ActionType.CANVAS_WIPE, {
        from: { pixels: new Uint8ClampedArray(image.pixels) },
        to: null,
        editorContext
      });
    }
    setImage({ pixels: new Uint8ClampedArray(artSize.x * artSize.y * 4) });
    setPreviewImage(null);
  };

  const safeSetZoomLevel = (zoomLevel: number) => {
    if (zoomLevel < MIN_ZOOM_LEVEL) {
      zoomLevel = MIN_ZOOM_LEVEL;
    } else if (zoomLevel > MAX_ZOOM_LEVEL) {
      zoomLevel = MAX_ZOOM_LEVEL
    }

    setZoomLevel(zoomLevel);
  };

  const zoomIn = () => safeSetZoomLevel(zoomLevel + ZOOM_LEVEL_INCREMENT);
  const zoomOut = () => safeSetZoomLevel(zoomLevel - ZOOM_LEVEL_INCREMENT);

  const setImageWrapper = (image: { pixels: Uint8ClampedArray }) => {
    // @ts-ignore
    setImage(image);
  };

  const setSpriteModeWrapper = (newMode: SpriteMode.Type, storeInHistory: boolean = false) => {
    if (storeInHistory) {
      updateCurrentAction(ActionType.SPRITE_MODE, { from: spriteMode, to: newMode, editorContext });
      closeCurrentAction();
    }
    setSpriteMode(newMode);
  }

  const editorContext = {
    editMode, setEditMode,
    currentColor, setCurrentColor,
    colorHistory,
    addColorToHistory,
    removeColorFromHistory,
    artSize, setArtSize: safeSetArtSize,
    image, setImage: setImageWrapper,
    setPixel, getPixel,
    previewImage, setPreviewImage,
    clearImage,
    zoomLevel, setZoomLevel: safeSetZoomLevel,
    zoomIn, zoomOut,
    spriteMode, setSpriteMode: setSpriteModeWrapper
  };

  return (
    <ArtEditorContext.Provider value={editorContext}>
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

type PixelEditData = { x: number, y: number, color: string | null, editorContext: ArtEditorContextType };
HistoryActions.registerActionHandler(ActionType.PIXEL_EDIT, (actionData: PixelEditData[]) => {
  for (let i = 0; i < actionData.length; i++) {
    const pixelEvent = actionData[i];
    const { setPixel, getPixel } = pixelEvent.editorContext;

    const oldColor = getPixel(pixelEvent.x, pixelEvent.y);
    const newColor = pixelEvent.color;

    setPixel(pixelEvent.x, pixelEvent.y, newColor);

    pixelEvent.color = oldColor;
  }

  return {
    actionType: ActionType.PIXEL_EDIT,
    actionData: actionData
  };
});

type CanvasWipeData = {
  from: { pixels: Uint8ClampedArray } | null,
  to: { pixels: Uint8ClampedArray } | null,
  editorContext: ArtEditorContextType
};
HistoryActions.registerActionHandler(ActionType.CANVAS_WIPE, (actionData: CanvasWipeData[]) => {
  const [wipeData] = actionData;
  const { from, to, editorContext } = wipeData;

  if (from === null) {
    editorContext.clearImage();
  } else {
    editorContext.setImage(from);
  }

  wipeData.from = to, wipeData.to = from;

  return {
    actionType: ActionType.CANVAS_WIPE,
    actionData: actionData
  };
});

type SpriteResizeData = {
  from: [{ x: number, y: number }, { pixels: Uint8ClampedArray } | null],
  to: [{ x: number, y: number }, { pixels: Uint8ClampedArray } | null],
  editorContext: ArtEditorContextType
};
HistoryActions.registerActionHandler(ActionType.SPRITE_RESIZE, (actionData: SpriteResizeData[]) => {
  const [resizeData] = actionData;
  const { from, to, editorContext } = resizeData;

  const [newSize, newImage] = from;

  editorContext.setArtSize(newSize);

  if (newImage !== null) {
    editorContext.setImage(newImage);
  }

  resizeData.from = to, resizeData.to = from;

  return {
    actionType: ActionType.SPRITE_RESIZE,
    actionData: actionData
  };
});


type SpriteModeData = {
  from: SpriteMode.Type,
  to: SpriteMode.Type,
  editorContext: ArtEditorContextType
};
HistoryActions.registerActionHandler(ActionType.SPRITE_MODE, (actionData: SpriteModeData[]) => {
  const [modeData] = actionData;
  const { from, to, editorContext } = modeData;

  editorContext.setSpriteMode(from);
  modeData.from = to, modeData.to = from;

  return {
    actionType: ActionType.SPRITE_MODE,
    actionData: actionData
  };
});