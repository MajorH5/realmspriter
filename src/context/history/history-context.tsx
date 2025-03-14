"use client";

import { useContext, createContext } from "react";
import { ActionType, ActionObject } from "@/context/history/history-types";
import HistoryActions from "./history-actions";

export type HistoryType = {
    createAction: (actionType: ActionType, actionData: any, replace: boolean) => ActionObject;
    updateCurrentAction: (actionType: ActionType, actionData: any) => void;
    closeCurrentAction: (expectedActionType?: ActionType) => void;
    undo: () => void;
    redo: () => void;
}

const HistoryContext = createContext<HistoryType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: React.ReactNode }) => {
    let undoCache: ActionObject[] = [];
    let redoCache: ActionObject[] = [];
    let pendingAction: ActionObject | null = null;

    const createAction = (actionType: ActionType, actionData: any, replace: boolean = false): ActionObject => {
        return { actionType, actionData: replace ? actionData : [actionData] };
    };

    const closeCurrentAction = (expectedActionType?: ActionType) => {
        if (
            (pendingAction !== null && expectedActionType === undefined) ||
            (pendingAction !== null && pendingAction.actionType === expectedActionType)
        ) {
            undoCache.push(pendingAction);
            pendingAction = null;
            redoCache = [];
        }
    };

    const updateCurrentAction = (actionType: ActionType, actionData: any) => {
        if (pendingAction !== null && pendingAction.actionType === actionType) {
            // same as current, insert new event
            pendingAction.actionData.push(actionData);
        } else {
            if (pendingAction !== null) {
                closeCurrentAction();
            }

            pendingAction = createAction(actionType, actionData);
        }
    };

    const performAction = (action: ActionObject): ActionObject => {
        const actionHandler = HistoryActions.getActionHandler(action.actionType);

        if (actionHandler == undefined) {
            throw new Error(`performAction(): ActionType not defined for ${action.actionType}!`);
        }
        
        return actionHandler(action.actionData);
    };
    
    const undo = () => {
        if (pendingAction !== null) closeCurrentAction();
        
        const lastAction = undoCache.pop();
        
        if (lastAction !== undefined) {
            redoCache.push(performAction(lastAction));
        }
    };
    
    const redo = () => {
        if (pendingAction !== null) closeCurrentAction();

        const lastAction = redoCache.pop();

        if (lastAction !== undefined) {
            undoCache.push(performAction(lastAction))
        }
    };

    return (
        <HistoryContext.Provider
            value={{
                createAction,
                closeCurrentAction,
                updateCurrentAction,
                undo, redo
            }}
        >
            {children}
        </HistoryContext.Provider>
    );
};

export const useHistory = (): HistoryType => {
    const context = useContext(HistoryContext);
    if (context === undefined) {
        throw new Error("useHistory must be used within a HistoryProvider");
    }
    return context;
}