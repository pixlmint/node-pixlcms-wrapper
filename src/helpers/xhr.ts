import axios, { AxiosRequestHeaders, type AxiosError, type AxiosRequestConfig, type AxiosResponse } from "axios";
import { queryFormatter } from "./utils";
import LoadingHelper from "./loading";
import { ElNotification } from "element-plus";
import { type LoadingStore } from '../store/loading';

const updateSpeed = 10;

let loadingBarInterval: number | null = null;

let loadingStore: LoadingStore | null = null;

const runningRequests: Record<string, Promise<any>> = {};

export function configureStores(newLoadingStore: any) {
    loadingStore = newLoadingStore;
}

export function buildRequest(
    url: string,
    data: Object = {},
    method: 'GET' | 'POST' | 'DELETE' | 'PATCH' | 'PUT' = 'GET',
): AxiosRequestConfig & { headers: AxiosRequestHeaders } {
    method = method.toUpperCase();
    const request = {
        url: url,
        method: method,
        data: data,
        headers: {},
        validateStatus: function(status) {
            return status >= 200 && status < 300;
        },
    } as AxiosRequestConfig & { headers: AxiosRequestHeaders };
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
    if (loadingStore === null) return;
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
    if (loadingStore === null) return;
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
                if (typeof reason.response !== 'undefined' && typeof reason.response.data !== 'undefined' && 'message' in reason.response.data) {
                    message = reason.response.data.message as string;
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
