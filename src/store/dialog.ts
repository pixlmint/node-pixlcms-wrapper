import {defineStore} from "pinia";
import {isObject} from "lodash";

interface DialogInfo {
    route: string,
    data?: any,
}

interface DialogInfoList {
    dialogs: DialogInfo[],
    includes: Function,
}

interface State {
    showingDialogs: DialogInfoList,
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
        getShowingDialogs: state => state.showingDialogs,
        getDialogData: (state) => (route: string) => {
            const dialog = state.showingDialogs.dialogs.find(d => d.route === route);
            return dialog ? dialog.data : null;
        },
    },
    actions: {
        showDialog(dialog: any) {
            if (!instanceOfDialogInfo(dialog)) {
                dialog = {route: dialog, data: null};
            }
            this.showingDialogs.dialogs.push(dialog);
        },
        isDialogShowing(route: string) {
            return this.showingDialogs.dialogs.find(d => d.route === route) !== undefined;
        },
        hideDialog(route: string) {
            const index = this.showingDialogs.dialogs.findIndex(dialog => dialog.route === route);
            if (index !== -1) {
                this.showingDialogs.dialogs.splice(index, 1);
            }
        },
    }
});
