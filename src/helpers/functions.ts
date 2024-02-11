import {DialogComponent} from "../contracts/DialogComponent";
import {shallowRef} from "vue";

export const defineDialogs = (dialogs: DialogComponent[]) => {
    return () => {
        return dialogs.map((dialog: DialogComponent) => {
            return {
                route: dialog.route,
                component: shallowRef(dialog.component),
            }
        });
    }
}