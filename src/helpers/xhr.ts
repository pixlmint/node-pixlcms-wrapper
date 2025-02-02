import axios, {type AxiosError, type AxiosRequestConfig, type AxiosResponse} from "axios";
import {queryFormatter} from "./utils";
import LoadingHelper from "./loading";
import {ElNotification} from "element-plus";
import { type LoadingStore } from '../store/loading';
import { type AuthStore } from '../store/auth';

const updateSpeed = 10;

let loadingBarInterval: number|null = null;

let authStore: AuthStore|null = null;
let loadingStore: LoadingStore|null = null;

export function configureStores(newAuthStore: any, newLoadingStore: any) {
    authStore = newAuthStore;
    loadingStore = newLoadingStore;
}

export function buildRequest(url: string, data: object = {}, method: string = 'GET'): AxiosRequestConfig {
    if (authStore === null || loadingStore === null) {
        throw "Stores must be defined";
    }
    method = method.toUpperCase();
    const request = {
        url: url,
        method: method,
        data: data,
        headers: {},
        validateStatus: function (status) {
            return status >= 200 && status < 300;
        },
    } as AxiosRequestConfig;
    if (!request.headers) {
        throw "Headers not defined";
    }
    if (authStore.getToken !== null) {
        request.headers['pixltoken'] = authStore.getToken;
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

export function send(request: AxiosRequestConfig) {
    const startTime = new Date();
    if (loadingStore !== null) {
        loadingStore.increaseLoadingCount();
        loadingStore.increaseLoadingTime(LoadingHelper.getAverageLoadingTime(request.url));
        if (loadingBarInterval === null) {
            loadingBarInterval = window.setInterval(updateLoadingProgress, updateSpeed);
        }
    }
    return axios(request)
        .then((response: AxiosResponse) => {
            if (loadingStore !== null) {
                loadingStore.decreaseLoadingCount();
            }
            const endTime = new Date();
            const diff = endTime.getSeconds() - startTime.getSeconds();
            LoadingHelper.updateAverageLoadingTime(request.url, diff);
            return response;
        })
        .catch((reason: AxiosError) => {
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
            if (loadingStore !== null) {
                loadingStore.decreaseLoadingCount();
                if (loadingStore.getLoadingTime === 0) {
                    if (loadingBarInterval !== null) window.clearInterval(loadingBarInterval);
                }
            }
            throw reason;
        });
}
