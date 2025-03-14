import { ActionType, ActionHandler } from "@/context/history/history-types";
import { useEditor } from "../art-editor-context";

export default class HistoryActions {
    static lookup = new Map<ActionType, ActionHandler>();

    static registerActionHandler(actionType: ActionType, actionHandler: ActionHandler) {
        HistoryActions.lookup.set(actionType, actionHandler);
    }

    static getActionHandler(actionType: ActionType): ActionHandler | undefined {
        return HistoryActions.lookup.get(actionType);
    }
};
