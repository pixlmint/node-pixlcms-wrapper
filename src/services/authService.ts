import { send } from "../helpers/xhr";
import { BaseService } from "./base";

class AuthService extends BaseService {
    declare token: string  | null;

    async login(data: { username: string, password: string }) {
        const request = this._buildRequest('/api/auth/login', data, 'POST');
        const response = await send(request);
        this.setToken(response.data.token);
    }

    async changePassword(data: object) {
        const request = this._buildRequest('/api/auth/change-password', data, 'POST');
        const response = await send(request);
        this.token = response.data.token;
    }
    requestNewPassword(data: object) {
        const request = this._buildRequest('/api/auth/request-new-password', data, 'POST');
        return send(request);
    }
    async restorePassword(data: { username: string, password1: string, password2: string, token: string }) {
        const request = this._buildRequest('/api/auth/restore-password', data, 'POST');
        const response = await send(request);
        this.token = response.data.token;
    }
    async generateNewToken() {
        const request = this._buildRequest('/api/auth/generate-new-token', {}, 'POST');
        const response = await send(request);
        this.setToken(response.data.token);
    }
    createAdmin(data: object) {
        const request = this._buildRequest('/api/auth/create-admin', data, 'POST');
        return send(request);
    }

    setToken(token: string) {
        this.token = token;
        localStorage.setItem(this._generateLocalstorageKey('token'), token);
    }

    loadToken() {
        console.log('loading token', this._generateLocalstorageKey('token'));
        this.token = localStorage.getItem(this._generateLocalstorageKey('token'));
    }

    async logout(logoutEverywhere: boolean = false) {
        console.log('logout', this._generateLocalstorageKey('token'));
        console.trace();
        if (logoutEverywhere) {
            const request = this._buildRequest('/api/auth/destroy-token');
            await send(request).then(() => {
                this.token = null;
            });
        }
        this.token = null;
        localStorage.removeItem(this._generateLocalstorageKey('token'));
    }

    _generateLocalstorageKey(baseKey: string) {
        if (typeof this.domain === 'undefined')
            return baseKey;
        else
            return `${this.domain}_${baseKey}`;
    }
}

const newAuthService = new AuthService();

export default newAuthService;

export { AuthService }
