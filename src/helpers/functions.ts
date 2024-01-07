import {DialogComponent} from "../contracts/DialogComponent";

export const defineDialogs = (dialogs: DialogComponent[]) => {
    return () => {
        return dialogs;
    }
}