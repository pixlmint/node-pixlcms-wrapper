import { _GettersTree, defineStore, _ActionsTree, _StoreWithState, _StoreWithGetters } from "pinia"
import { buildRequest, send } from "../helpers/xhr";
import serviceManager from "../services/pixlcmsService";

export type Backend = {
    domain: string;
}

interface BackendState {
    backends: Backend[],
    registeredStores: Record<string, any>,
}

export const useBackendStore = defineStore('backendStore', {
    state: (): BackendState => ({
        backends: [],
        registeredStores: {},
    }),
    getters: {},
    actions: {
        registerBackend(backend: Backend) {
            for (let i = 0; i < this.backends.length; i++) {
                if (this.backends[i].domain === backend.domain) {
                    return;
                }
            }
            this.backends.push(backend);
        },
        async initBackend(domain?: string) {
            // TODO: this shouldn't use the default serviceManager
            const backendService = serviceManager.getInstance(domain);

            console.log(backendService);

            const token = backendService.auth.token;

            const request = buildRequest('/api/init', {}, 'POST');

            if (token !== null)
                request.headers['pixltoken'] = token;
            if (domain !== null)
                request.baseURL = domain;

            return send(request).then(response => {
                if (response.data.is_token_valid !== 'token_valid') {
                    backendService.auth.logout();
                }

                return response;
            });
        },
    },
});
