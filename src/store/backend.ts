import { _GettersTree, defineStore, DefineStoreOptions, StateTree, StoreDefinition, _ActionsTree, _StoreWithState, _StoreWithGetters, PiniaCustomProperties } from "pinia"
import { buildRequest, BuildRequestArgObject, send } from "../helpers/xhr";
import { AxiosRequestConfig } from "axios";
import { authStoreOptions, useAuthStore } from "./auth";

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
        getStoreForBackend<
            BackendUrl extends string,
            StoreId extends string,
            S extends StateTree,
            G extends _GettersTree<S> = {},
            A /* extends ActionsTreeWithBuildRequest */ = {}>(
                backendUrl: BackendUrl | null,
                storeId: StoreId,
                storeConfig: Omit<DefineStoreOptions<StoreId, S, G, A>, 'id'>
            ): ReturnType<StoreDefinition<StoreId, S, G, A>> {

            if (backendUrl !== null) {
                this.registerBackend({ domain: backendUrl });
            }

            let backendStoreId = storeId;
            if (backendUrl !== null) {
                backendStoreId = `${storeId}_${backendUrl}` as StoreId;
            }

            if (backendStoreId in this.registeredStores) {
                return this.registeredStores[backendStoreId];
            } else {
                if (typeof storeConfig.actions !== 'undefined' && '_buildRequest' in storeConfig.actions) {
                    const that = this;
                    storeConfig.actions._buildRequest = function(
                        configOrUrl: BuildRequestArgObject | string,
                        data: Object = {},
                        method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' = 'GET',
                    ): AxiosRequestConfig {
                        let domain: string | null = null;
                        let token: string | null = null;

                        if (typeof this.backend !== 'undefined') {
                            domain = this.backend.domain;
                            const backendAuthStore = that.getStoreForBackend(domain!, 'authStore', authStoreOptions);

                            if (backendAuthStore.loadToken() !== null) {
                                token = backendAuthStore.getToken;
                            }
                        }
                        let config: BuildRequestArgObject;
                        if (typeof configOrUrl === 'string') {
                            config = {
                                url: configOrUrl,
                                data, method, domain
                            }
                        } else {
                            config = configOrUrl;
                        }
                        config.domain = domain;
                        config.token = token;

                        return buildRequest(config);
                    }
                }

                const store = defineStore(backendStoreId, storeConfig)();

                store.backend = { domain: backendUrl };

                this.registeredStores[backendStoreId] = store;

                return store;
            }
        },
        async initBackend(domain: string | null = null) {
            let backendAuthStore;
            if (domain === null) {
                backendAuthStore = useAuthStore();
            } else {
                this.registerBackend({ domain: domain });

                backendAuthStore = this.getStoreForBackend(domain, 'authStore', authStoreOptions);
            }

            const token = backendAuthStore.loadToken();

            const request = buildRequest({
                url: '/api/init',
                method: 'POST',
                data: {
                    token: token,
                },
                token: token,
            });

            if (domain !== null) {
                request.baseURL = domain;
            }

            return send(request).then(response => {
                if (response.data.is_token_valid !== 'token_valid') {
                    backendAuthStore.logout();
                }

                return response;
            });
        },
    },
});
