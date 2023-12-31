import {useLoadingStore} from "./store/loading";
import {useDialogStore} from "./store/dialog";
import Icon from "./components/icon.vue";
import loading from "./components/Loading.vue";
import {DialogComponent} from "./contracts/DialogComponent";
import {PixlEntry, EntryMeta} from "./contracts/PixlEntry";
import Dialog from "./components/dialog.vue";

export {
    useLoadingStore,
    useDialogStore,
    Icon,
    loading as Loading,
    Dialog,
    DialogComponent,
    PixlEntry,
    EntryMeta,
}