import {useLoadingStore} from "./store/loading";
import {useDialogStore} from "./store/dialog";
import Icon from "./components/icon.vue";
import Loading from "./components/Loading.vue";
import Dialog from "./components/dialog.vue";
import Modals from "./components/Modals.vue";
import {defineDialogs} from "./helpers/functions";
import { useAuthStore, type AuthStore } from "./store/auth";
import {configureStores, buildRequest, send} from './helpers/xhr';
import { useMediaStore, type MediaStore } from "./store/media";

const main = {
    install: (app, options = {}) => {
        const {pinia} = options;

        if (!pinia) {
            throw new Error(`No active Pinia instance was passed to your package`);
        }

        const dialogStore = useDialogStore(pinia);
        const authStore = useAuthStore(pinia);
        const loadingStore = useLoadingStore(pinia);
    },
};

export {
    useLoadingStore,
    useDialogStore,
    useAuthStore,
    useMediaStore,
    MediaStore,
    AuthStore,
    Icon,
    Loading,
    Dialog,
    Modals,
    defineDialogs,
    main,
    configureStores,
    buildRequest,
    send,
}

export type {PixlEntry, EntryMeta} from "./contracts/PixlEntry";
export type {DialogComponent} from "./contracts/DialogComponent";
