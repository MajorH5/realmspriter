export enum SpriteMode {
    OBJECTS = "Objects",
    CHARACTERS = "Characters",
    TEXTILES = "Textiles",
    ANIMATED = "Animated"
};

export namespace SpriteSize {
    export const S8X8 = [8, 8];
    export const S32X32 = [32, 32];
    export const S16X16 = [16, 16];
    export const S16X8 = [16, 8];
    // export type Type = "32 x 32" | "16 x 16" | "16 x 8" | "8 x 8" | "Custom";

    export const format = (size: [number, number]) => {
        return `${size[0]} x ${size[1]}`;
    };
};

export namespace EditMode {
    export const DRAW = "Draw";
    export const ERASE = "Erase";
    export const SAMPLE = "Sample";
    export type Type = "Draw" | "Erase" | "Sample";
};

export const MAX_ZOOM_LEVEL = 200;
export const MIN_ZOOM_LEVEL = 10;
export const ZOOM_LEVEL_INCREMENT = 10;

export const INITIAL_EDITOR_COLOR = "#ff0000";
export const INITIAL_COLOR_HISTORY = [
    '#ff0000', '#00ff00', '#0000ff',
    '#ffff00', '#ff00ff', '#00ffff',
    '#ffffff', '#000000', '#ff8800',
    '#8800ff', '#00ff88', '#ff0088'
];
export const INITIAL_ART_SIZE: {x: number, y: number} = {x: 8, y: 8};
export const MAX_ART_SIZE: { x: number, y: number } = { x: 128, y: 128 };