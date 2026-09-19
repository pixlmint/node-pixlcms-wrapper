import {defineStore} from "pinia";
import { Callback } from "element-plus";

interface DialogInfo {
    route: string,
    data?: any,
    closeCallback?: Callback,
}

interface DialogInfoList {
    dialogs: DialogInfo[],
    includes: Function,
}

interface State {
    showingDialogs: DialogInfoList,
    dialogScrollHeight?: number,
}

type ShowDialogType = {
    route: string,
    data: null | Object,
    closeCallback: null | Function,
} | string;

// copied from lodash source
// https://github.com/lodash/lodash/blob/2b5e6f7399a7b48005140b5d5c6bc6c0e62919a8/dist/lodash.core.js
const isObject = (value: any) => {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}

const instanceOfDialogInfo = (dialog: any) => {
    return isObject(dialog) && 'route' in dialog;
}

const showingDialogs = {
    dialogs: [],
    includes: (route: string) => {
        return showingDialogs.dialogs.find(d => d.route === route) !== undefined;
    },
} as DialogInfoList

export const useDialogStore = defineStore('dialog', {
    state: (): State => ({
        showingDialogs: showingDialogs,
    }),
    getters: {
        getShowingDialogs: (state: State) => state.showingDialogs,
        getDialogScrollHeight: (state: State) => state.dialogScrollHeight === null ? 0 : state.dialogScrollHeight,
        getDialogData: (state: State) => (route: string) => {
            const dialog = state.showingDialogs.dialogs.find(d => d.route === route);
            return dialog ? dialog.data : null;
        },
    },
    actions: {
        showDialog(dialog: ShowDialogType) {
            if (!instanceOfDialogInfo(dialog)) {
                dialog = {route: dialog, data: null, closeCallback: null};
            }
            if (dialog.closeCallback === undefined) {
                dialog.closeCallback = null;
            }
            this.showingDialogs.dialogs.push(dialog);
        },
        isDialogShowing(route: string) {
            return this.showingDialogs.dialogs.find(d => d.route === route) !== undefined;
        },
        hideDialog(route: string) {
            const index = this.showingDialogs.dialogs.findIndex((dialog: DialogInfo) => dialog.route === route);
            if (index !== -1) {
                if (this.showingDialogs.dialogs[index].closeCallback !== null) {
                    this.showingDialogs.dialogs[index].closeCallback();
                }
                this.showingDialogs.dialogs.splice(index, 1);
            }
        },
    }
});
