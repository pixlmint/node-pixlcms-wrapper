export function dispatchNavReload() {
    const event = new NavReloadEvent()
    window.dispatchEvent(event);
}

export class NavReloadEvent extends Event {
    constructor() {
        super('navreload', { bubbles: true, cancelable: true });
    }
}


export function dispatchNavChanged(entry: string) {
    const event = new NavChangedEvent(entry);
    window.dispatchEvent(event);
}

export class NavChangedEvent extends Event {
    declare entry: string;

    constructor(entry: string) {
        super('navchanged', { bubbles: true, cancelable: true });
        this.entry = entry;
    }
}
