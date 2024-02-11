import {defineStore} from "pinia"
import {buildRequest, send} from "../helpers/xhr";

interface State {
    token: string | null,
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
        changePassword(data: object) {
            const request = buildRequest('/api/auth/change-password', data, 'POST');
            return send(request).then((response) => {
                this.token = response.data.token;
            });
        },
        requestNewPassword(data: object) {
            const request = buildRequest('/api/auth/request-new-password', data, 'POST');
            return send(request);
        },
        restorePassword(data: {username: string, password1: string, password2: string, token: string}) {
            const request = buildRequest('/api/auth/restore-password', data, 'POST');
            return send(request).then((response) => {
                this.token = response.data.token;
            });
        },
        generateNewToken() {
            const request = buildRequest('/api/auth/generate-new-token', {}, 'POST');
            return send(request).then(response => {
                this.setToken(response.data.token);
            });
        },
        login(data: object) {
            const request = buildRequest('/api/auth/login', data, 'POST');
            return send(request).then(response => {
                this.setToken(response.data.token);
            });
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
        logout() {
            this.token = null;
            localStorage.removeItem('token');
        },
        haveEditRights() {
            return this.token !== null;
        },
    },
})