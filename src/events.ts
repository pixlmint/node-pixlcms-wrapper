export function dispatchNavReload() {
    const event = new NavReloadEvent()
    window.dispatchEvent(event);
}

export class NavReloadEvent extends Event {
    constructor() {
        super('navreload', { bubbles: true, cancelable: true });
    }
}

