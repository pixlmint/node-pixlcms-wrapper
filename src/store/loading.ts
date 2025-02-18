import {defineStore} from 'pinia'

interface State {
    loadingCount: number,
    loadingTime: number,
    timePassed: number,
    estimatedProgress: number,
}

export type LoadingStore = {
    getLoadingCount: number,
    getLoadingTime: number,
    getTimePassed: number,
    getEstimatedProgress: number,
    resetLoadingBar: Function,
    updateEstimatedProgress: Function,
    increaseTimePassed: Function,
    increaseLoadingCount: Function,
    increaseLoadingTime: Function,
    decreaseLoadingCount: Function,
}

export const useLoadingStore = defineStore('loadingStore', {
    state: (): State => ({
        loadingCount: 0,
        loadingTime: 0,
        timePassed: 0,
        estimatedProgress: 0,
    }),
    getters: {
        getLoadingCount: (state: State) => state.loadingCount,
        getLoadingTime: (state: State) => state.loadingTime,
        getTimePassed: (state: State) => state.timePassed,
        getEstimatedProgress: (state: State) => state.estimatedProgress,
    },
    actions: {
        increaseLoadingCount() {
            this.loadingCount += 1;
        },
        decreaseLoadingCount() {
            this.loadingCount -= 1;
        },
        updateTimePassed(newTime: number) {
            this.timePassed = newTime;
        },
        increaseTimePassed(newTime: number) {
            this.timePassed += newTime;
        },
        increaseLoadingTime(additionalLoadingTime: number) {
            this.loadingTime += additionalLoadingTime;
        },
        updateEstimatedProgress(newEstimatedProgress: number) {
            this.estimatedProgress = newEstimatedProgress;
        },
        resetLoadingBar() {
            this.loadingCount = 0;
            this.loadingTime = 0;
            this.timePassed = 0;
            this.estimatedProgress = 0;
        },
    },
})
