export enum ActionType {
    PIXEL_EDIT,
    CANVAS_WIPE,
    SPRITE_RESIZE,
    SPRITE_MODE
};

export type ActionObject = {
    actionData: any,
    actionType: ActionType
};

export type ActionHandler = (actionData: any) => ActionObject;