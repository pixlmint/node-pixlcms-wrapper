import { defineStore } from 'pinia';
import { buildRequest, send } from "../helpers/xhr";
import { Backend } from './backend';

interface State {
    gallery: object[],
    backend: Backend | null,
}

export type MediaStore = {
    gallery: object,
    loadMediaForEntry: Function,
    uploadMedia: Function,
    deleteMedia: Function,
}

export const mediaStoreConfig = {
    state: (): State => ({
        gallery: [],
        backend: null,
    }),
    getters: {},
    actions: {
        _buildRequest: buildRequest,
        async loadMediaForEntry(entry: string) {
            const request = this._buildRequest({ url: '/api/admin/gallery/load', data: { gallery: entry } });
            return send(request).then((response) => {
                this.gallery = response.data.media;
            });
        },
        uploadMedia(data: FormData | {files: object[], gallery: string}) {
            const request = this._buildRequest({ url: '/api/admin/gallery/upload', data, method: 'POST' });
            return send(request)
        },
        deleteMedia(mediaString: string) {
            const request = this._buildRequest({ url: '/api/admin/gallery/delete', data: { media: mediaString }, method: 'DELETE' });
            return send(request);
        },
    },
}

export const useMediaStore = defineStore('mediaStore', mediaStoreConfig);

