import { defineStore } from 'pinia';
import { buildRequest, send } from "../helpers/xhr";

interface State {
    gallery: object[],
}

export type MediaStore = {
    gallery: object,
    loadMediaForEntry: Function,
    uploadMedia: Function,
    deleteMedia: Function,
}

export const useMediaStore = defineStore('mediaStore', {
    state: (): State => ({
        gallery: [],
    }),
    getters: {},
    actions: {
        async loadMediaForEntry(entry: string) {
            const request = buildRequest('/api/admin/gallery/load', {gallery: entry});
            return send(request).then((response) => {
                this.gallery = response.data.media;
            });
        },
        uploadMedia(data: FormData) {
            const request = buildRequest('/api/admin/gallery/upload', data, 'POST');
            return send(request)
        },
        deleteMedia(mediaString: string) {
            const request = buildRequest('/api/admin/gallery/delete', {media: mediaString}, 'DELETE');
            return send(request);
        },
    },
});
