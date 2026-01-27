import { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';
import { buildRequest } from '../helpers/xhr';
import defaultAuthService, { AuthService } from './authService';
import defaultCmsService, { CmsService } from './cmsService';
import defaultMediaService, { MediaService } from './mediaService';

class PixlCms {
    declare private _domain?: string;
    declare auth: AuthService;
    declare cms: CmsService;
    declare media: MediaService;
    declare isDefault: boolean;

    constructor(domain?: string) {
        this._domain = domain;

        if (typeof domain === 'undefined') {
            this.isDefault = true;
            this.auth = defaultAuthService;
            this.cms = defaultCmsService;
            this.media = defaultMediaService;
        } else {
            this.isDefault = false;

            this.auth = new AuthService();
            this.auth.domain = domain;
            this.cms = new CmsService();
            this.cms.domain = domain;
            this.media = new MediaService();
            this.media.domain = domain;
        }
        this.auth._buildRequest = this.createRequestBuilder();
        this.cms._buildRequest = this.createRequestBuilder();
        this.media._buildRequest = this.createRequestBuilder();

        this.auth.loadToken();
    }

    getDomain(): string | undefined {
        return this._domain;
    }

    protected createRequestBuilder() {
        const father = this;
        return function(
            url: string,
            data: Object = {},
            method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' = 'GET',
        ): AxiosRequestConfig & { headers: AxiosRequestHeaders } {
            const baseRequest = buildRequest(url, data, method);

            baseRequest.baseURL = father._domain;

            if (father.auth.token !== null)
                baseRequest.headers['pixltoken'] = father.auth.token;

            return baseRequest;
        }
    }
}

class ServiceManager {
    declare instances: Record<string, PixlCms>;
    declare defaultInstance: PixlCms;

    constructor() {
        this.defaultInstance = new PixlCms();
        this.instances = {};
    }

    getInstance(domain?: string) {
        if (typeof domain === 'undefined') {
            return this.defaultInstance;
        } else {
            if (!(domain in this.instances)) {
                this.instances[domain] = new PixlCms(domain);
            }

            return this.instances[domain];
        }
    }
}

const serviceManager = new ServiceManager();

export default serviceManager;
export { PixlCms, ServiceManager }

