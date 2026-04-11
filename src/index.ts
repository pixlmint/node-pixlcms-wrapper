import { useLoadingStore } from "./store/loading";
import { useDialogStore } from "./store/dialog";
import Icon from "./components/icon.vue";
import Loading from "./components/Loading.vue";
import Dialog from "./components/dialog.vue";
import Modals from "./components/Modals.vue";
import { defineDialogs } from "./helpers/functions";
import { authStoreOptions, useAuthStore, type AuthStore } from "./store/auth";
import { configureStores, buildRequest, send } from './helpers/xhr';
import { useMediaStore, type MediaStore } from "./store/media";
import { useBackendStore } from "./store/backend";
import { walkPath } from "./helpers/utils";
import { cmsStoreConfig, useCmsStore } from "./store/cms";
import type { INav, INavElement, IFolderNavElement, EntryKind, NavResponseElement, NavFactory } from "./contracts/nav";
import { isNavElement } from "./contracts/nav";
import serviceManager from "./services/pixlcmsService"
import { PixlCms } from "./services/pixlcmsService";
import authService, { AuthService } from "./services/authService";
import mediaService, { MediaService } from "./services/mediaService";
import type { EntryGallery } from "./services/mediaService";
import cmsService, { CmsService, } from "./services/cmsService";
import { dispatchNavReload, NavReloadEvent } from "./events";
import { BaseService } from "./services/base";

const main = {
    install: (app, options = {}) => {
        const { pinia } = options;

        if (!pinia) {
            throw new Error(`No active Pinia instance was passed to your package`);
        }

        const dialogStore = useDialogStore(pinia);
        const authStore = useAuthStore(pinia);
        const loadingStore = useLoadingStore(pinia);
    },
};

export {
    authStoreOptions,
    useBackendStore,
    useLoadingStore,
    useDialogStore,
    useAuthStore,
    useMediaStore,
    useCmsStore,
    cmsStoreConfig,
    MediaStore,
    AuthStore,
    Icon,
    Loading,
    Dialog,
    Modals,
    defineDialogs,
    main,
    configureStores,
    // xhr
    buildRequest,
    send,
    // nav
    walkPath,
    INav, INavElement, IFolderNavElement, EntryKind, NavResponseElement, NavFactory,
    isNavElement,
    // services
    PixlCms,
    serviceManager,
    AuthService,
    authService,
    MediaService, mediaService,
    cmsService, CmsService, BaseService,
    // events
    dispatchNavReload, NavReloadEvent,
}

export type { EntryGallery }

export type { PixlEntry, PixlEntry as Entry, EntryMeta } from "./contracts/PixlEntry";
export type { DialogComponent } from "./contracts/DialogComponent";
// export type { Entry, EntryMeta } from './services/cmsService';
