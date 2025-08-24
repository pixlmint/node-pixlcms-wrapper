import { defineStore } from "pinia"
import { buildRequest, send } from "../helpers/xhr";
import { Backend } from "./backend";

interface State {
    token: string | null,
    backend?: Backend;
}

export type AuthStore = ReturnType<typeof useAuthStore>;

export const authStoreOptions = {
    state: (): State => ({
        token: null,
        backend: undefined,
    }),
    getters: {
        getToken: (state: State) => state.token,
    },
    actions: {
        _buildRequest: buildRequest,
        _generateLocalstorageKey(item: string) {
            if (typeof this.backend === 'undefined') {
                return item;
            } else {
                return `${this.backend.domain}_${item}`;
            }
        },
        setToken(token: string) {
            this.token = token;
            localStorage.setItem(this._generateLocalstorageKey('token'), token.toString());
        },
        async changePassword(data: object) {
            const request = this._buildRequest({ url: '/api/auth/change-password', data, method: 'POST' });
            const response = await send(request);
            this.token = response.data.token;
        },
        requestNewPassword(data: object) {
            const request = this._buildRequest({ url: '/api/auth/request-new-password', data, method: 'POST' });
            return send(request);
        },
        async restorePassword(data: { username: string, password1: string, password2: string, token: string }) {
            const request = this._buildRequest({ url: '/api/auth/restore-password', data, method: 'POST' });
            const response = await send(request);
            this.token = response.data.token;
        },
        async generateNewToken() {
            const request = this._buildRequest({ url: '/api/auth/generate-new-token', data: {}, method: 'POST' });
            const response = await send(request);
            this.setToken(response.data.token);
        },
        async login(data: { username: string, password: string }) {
            const request = this._buildRequest({ url: '/api/auth/login', data, method: 'POST' });
            const response = await send(request);
            this.setToken(response.data.token);
        },
        createAdmin(data: object) {
            const request = this._buildRequest({ url: '/api/auth/create-admin', data: data, method: 'POST' });
            return send(request);
        },
        loadToken() {
            const token = localStorage.getItem(this._generateLocalstorageKey('token'));
            if (token) {
                this.token = token;
            }
            return token;
        },
        logout(logoutEverywhere: boolean = false) {
            if (logoutEverywhere) {
                const request = this._buildRequest({ url: '/api/auth/destroy-token' });
                send(request).then(() => {
                    this.token = null;
                    localStorage.removeItem(this._generateLocalstorageKey('token'));
                });
            } else {
                this.token = null;
                localStorage.removeItem(this._generateLocalstorageKey('token'));
            }
        },
        haveEditRights() {
            return this.token !== null;
        },
    },
}

export const useAuthStore = defineStore('authStore', authStoreOptions);

