import {useLoadingStore} from "./store/loading";
import {useDialogStore} from "./store/dialog";
import Icon from "./components/icon.vue";
import Loading from "./components/Loading.vue";
import Dialog from "./components/dialog.vue";

export {
    useLoadingStore,
    useDialogStore,
    Icon,
    Loading,
    Dialog,
}

export type {PixlEntry, EntryMeta} from "./contracts/PixlEntry";
export type {DialogComponent} from "./contracts/DialogComponent";