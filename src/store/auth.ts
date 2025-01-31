import {defineStore} from "pinia"
import {buildRequest, send} from "../helpers/xhr";

interface State {
    token: string | null,
}

export type AuthStore = {
    getToken: null|string,
    setToken: Function,
    changePassword: Function,
    requestNewPassword: Function,
    restorePassword: Function,
    generateNewToken: Function,
    login: Function,
    createAdmin: Function,
    loadToken: Function,
    logout: Function,
    haveEditRights: Function,
}

export const useAuthStore = defineStore('authStore', {
    state: (): State => ({
        token: null,
    }),
    getters: {
        getToken: (state: State) => state.token,
    },
    actions: {
        setToken(token: string) {
            this.token = token;
            localStorage.setItem('token', token.toString());
        },
        async changePassword(data: object) {
            const request = buildRequest('/api/auth/change-password', data, 'POST');
            const response = await send(request);
            this.token = response.data.token;
        },
        requestNewPassword(data: object) {
            const request = buildRequest('/api/auth/request-new-password', data, 'POST');
            return send(request);
        },
        async restorePassword(data: {username: string, password1: string, password2: string, token: string}) {
            const request = buildRequest('/api/auth/restore-password', data, 'POST');
            const response = await send(request);
            this.token = response.data.token;
        },
        async generateNewToken() {
            const request = buildRequest('/api/auth/generate-new-token', {}, 'POST');
            const response = await send(request);
            this.setToken(response.data.token);
        },
        async login(data: object) {
            const request = buildRequest('/api/auth/login', data, 'POST');
            const response = await send(request);
            this.setToken(response.data.token);
        },
        createAdmin(data: object) {
            const request = buildRequest('/api/auth/create-admin', data, 'POST');
            return send(request);
        },
        loadToken() {
            const token = localStorage.getItem('token');
            if (token) {
                this.token = token;
            }
            return token;
        },
        logout(logoutEverywhere: boolean = false) {
            if (logoutEverywhere) {
                const request = buildRequest('/api/auth/destroy-token');
                send(request).then(() => {
                    this.token = null;
                    localStorage.removeItem('token');
                });
            } else {
                this.token = null;
                localStorage.removeItem('token');
            }
        },
        haveEditRights() {
            return this.token !== null;
        },
    },
})
