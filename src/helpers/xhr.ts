import axios, { type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { queryFormatter } from "./utils";
import LoadingHelper from "./loading";
import { ElNotification } from "element-plus";
import { type LoadingStore } from '../store/loading';
import { type AuthStore } from '../store/auth';

const updateSpeed = 10;

let loadingBarInterval: number | null = null;

let authStore: AuthStore | null = null;
let loadingStore: LoadingStore | null = null;

const runningRequests: Record<string, Promise<any>> = {};

export function configureStores(newAuthStore: any, newLoadingStore: any) {
    authStore = newAuthStore;
    loadingStore = newLoadingStore;
}

export type BuildRequestArgObject = {
    url: string;
    data?: object;
    method?: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT';
    domain?: string | null;
    token?: string | null;
}

export function buildRequest(
    configOrUrl: BuildRequestArgObject | string,
    data: Object = {},
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' = 'GET',
    domain?: string,
    token: string | null = null,
): AxiosRequestConfig {
    if (authStore === null || loadingStore === null) {
        throw "Stores must be defined";
    }
    console.log(configOrUrl);
    let url: string;
    if (typeof configOrUrl === 'string') {
        url = configOrUrl;
    } else {
        /** @type {BuildRequestArgObject} configOrUrl */
        url = configOrUrl.url;
        if (configOrUrl.method !== undefined)
            method = configOrUrl.method;
        if (configOrUrl.data !== undefined)
            data = configOrUrl.data;
        if (configOrUrl.domain !== undefined && configOrUrl.domain !== null)
            domain = configOrUrl.domain as string;
        if (configOrUrl.token !== undefined && configOrUrl.token !== null)
            token = configOrUrl.token as string;
    }
    console.log(domain);
    method = method.toUpperCase();
    const request = {
        url: url,
        method: method,
        data: data,
        headers: {},
        validateStatus: function(status) {
            return status >= 200 && status < 300;
        },
    } as AxiosRequestConfig;
    if (domain !== null) {
        request.baseURL = domain;
    }
    if (!request.headers) {
        throw "Headers not defined";
    }
    if (token === null) {
        if (authStore.getToken !== null) {
            token = authStore.getToken;
        }
    }
    if (token !== null) {
        request.headers['pixltoken'] = token;
    }
    if (method === 'GET') {
        request.url = url + '?' + queryFormatter(data);
    } else {
        if (data instanceof FormData) {
            request.data = data;
        } else {
            request.data = queryFormatter(data);
            request.headers['Content-Type'] = 'application/x-www-form-urlencoded';
        }
    }

    return request;
}

function clearProgressBar() {
    if (loadingStore === null) throw "loadingStore is undefined";
    if (loadingBarInterval === null) throw "loadingBarInterval is null";
    const estimated = loadingStore.getEstimatedProgress;
    if (estimated >= 100) {
        loadingStore.resetLoadingBar();
        window.clearInterval(loadingBarInterval);
        loadingBarInterval = null;
    } else {
        loadingStore.updateEstimatedProgress(estimated + 5)
    }
}

function updateLoadingProgress() {
    if (loadingStore === null) throw "loadingStore undefined";
    if (loadingBarInterval === null) throw "loadingBarInterval is null";
    loadingStore.increaseTimePassed(updateSpeed);
    const newProgress = 100 / loadingStore.getLoadingTime * loadingStore.getTimePassed;
    loadingStore.updateEstimatedProgress(newProgress);

    if (loadingStore.getLoadingCount <= 0) {
        window.clearInterval(loadingBarInterval);
        loadingBarInterval = window.setInterval(clearProgressBar, updateSpeed);
    }
}

export async function send(request: AxiosRequestConfig, suppressWarnings: boolean = false) {
    if (request.method === 'GET' && request.url! in runningRequests) {
        return runningRequests[request.url!];
    }
    const startTime = new Date();
    if (loadingStore !== null) {
        loadingStore.increaseLoadingCount();
        loadingStore.increaseLoadingTime(LoadingHelper.getAverageLoadingTime(request.url));
        if (loadingBarInterval === null) {
            loadingBarInterval = window.setInterval(updateLoadingProgress, updateSpeed);
        }
    }
    const promise = axios(request)
        .then((response: AxiosResponse) => {
            if (loadingStore !== null) {
                loadingStore.decreaseLoadingCount();
            }
            const endTime = new Date();
            const diff = endTime.getSeconds() - startTime.getSeconds();
            LoadingHelper.updateAverageLoadingTime(request.url, diff);
            if (request.url! in runningRequests) {
                delete runningRequests[request.url!];
            }
            return response;
        })
        .catch((reason: AxiosError) => {
            if (!suppressWarnings) {
                let message = 'Error Sending Request to ' + request.url;
                // @ts-ignore
                if ('message' in reason.response.data) {
                    // @ts-ignore
                    message = reason.response.data.message;
                }
                ElNotification({
                    title: 'Error',
                    message: message,
                    type: 'warning',
                });
            }
            if (loadingStore !== null) {
                loadingStore.decreaseLoadingCount();
                if (loadingStore.getLoadingTime === 0) {
                    if (loadingBarInterval !== null) window.clearInterval(loadingBarInterval);
                }
            }
            if (request.url! in runningRequests) {
                delete runningRequests[request.url!];
            }
            throw reason;
        });
    if (request.method === 'GET') {
        runningRequests[request.url!] = promise;
    }

    return promise;
}
