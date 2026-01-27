import { BaseService } from "./base";
import { send } from "../helpers/xhr";

type EntryGallery = {

}

class MediaService extends BaseService {
    async loadMediaForEntry(entry: string): Promise<EntryGallery> {
        const request = this._buildRequest('/api/admin/gallery/load', { gallery: entry });
        return send(request).then((response) => {
            return response.data.media;
        });
    }

    uploadMedia(data: FormData | { files: object[], gallery: string }) {
        const request = this._buildRequest('/api/admin/gallery/upload', data, 'POST');
        return send(request)
    }

    deleteMedia(mediaString: string) {
        const request = this._buildRequest('/api/admin/gallery/delete', { media: mediaString }, 'DELETE');
        return send(request);
    }
}

const defaultMediaService = new MediaService();

export default defaultMediaService;

export { MediaService }

export type { EntryGallery }
