import { NavFactory, INav } from "../contracts/nav";
import { BaseService } from "./base";
import { send } from "../helpers/xhr";
import { dispatchNavReload } from "../events";
import { Entry } from "..";

class CmsService extends BaseService {
    declare nav: INav | null;
    declare loadedEntries: Record<string, Entry>;

    constructor() {
        super();
        this.loadedEntries = {};
    }

    dumpAlternateContent(page: string | null = null) {
        const data = {} as {page?: string};
        if (page !== null)
            data.page = page;
        const request = this._buildRequest('/api/admin/alternate/dump-file-into-content', data);
        return send(request);
    }
    async saveEntry(entry: Entry) {
        const data = {
            content: entry.raw_content,
            meta: JSON.stringify(entry.meta),
            entry: entry.id,
            lastUpdate: entry.meta.dateUpdated,
        }
        const request = this._buildRequest('/api/admin/entry/edit', data, 'PUT');
        return send(request).then(response => {
            // this.editor.lastSaved = new Date();
            // this.currentEntry!.meta.dateUpdated = response.data.lastUpdate;
            this.fetchEntry(entry.id);
            return response;
        });
    }
    async fetchEntry(entry: string): Promise<Entry> {
        const request = this._buildRequest('/api/entry/view', { p: entry });
        return send(request, true).then(response => {
            const entryObj = response.data as Entry;
            entryObj.domain = this.domain;
            this.loadedEntries[entry] = entryObj;
            return entryObj;
        });
    }
    async fetchLastChanged(entry: string | Entry): Promise<Date> {
        let entryId = typeof entry === 'string' ? entry : entry.id;
        const request = this._buildRequest('/api/admin/entry/fetch-last-changed', { entry: entryId });
        return send(request).then(response => {
            const lastModified = new Date(response.data.lastChanged);
            if (typeof entry !== 'string') {
                entry.meta.dateUpdated = lastModified;
            }
            return lastModified;
        });
    }
    // TODO: This should be able to handle non-markdown entries
    async fetchEntryRawContent(entry: string | Entry) {
        let entryObj = typeof entry !== 'string' ? entry : await this.getOrFetchEntry(entry);
        return entryObj.raw_content;
    }
    addEntry(parentFolder: string, title: string) {
        const data = {
            parentFolder: parentFolder,
            title: title,
        };
        const request = this._buildRequest('/api/admin/entry/add', data, 'POST');
        return send(request);
    }
    addFolder(parentFolder: string, folderName: any) {
        const data = {
            parentFolder: parentFolder,
            folderName: folderName,
        };
        const request = this._buildRequest('/api/admin/folder/add', data, 'POST');
        return send(request);
    }
    deleteFolder(folderName: string) {
        const request = this._buildRequest('/api/admin/folder/delete', { entry: folderName }, 'DELETE');
        return send(request);
    }
    deleteEntry(entry: string) {
        const request = this._buildRequest('/api/admin/entry/delete', { entry: entry }, 'DELETE');
        return send(request);
    }
    renameEntry(entry: string | Entry, newName: string) {
        const entryId = typeof entry === 'string' ? entry : entry.id;

        const data = {
            'new-title': newName,
            entry: entryId,
        }

        const request = this._buildRequest('/api/admin/entry/rename', data, 'PUT');
        return send(request);
    }
    setSecurityState(entry: string, newState: 'public' | 'private') {
        const data = {
            entry: entry,
            new_state: newState,
        }
        const request = this._buildRequest('/api/admin/entry/change-security', data, 'PUT');
        return send(request);
    }
    async loadNav(forceReload: boolean = false, navFactory: NavFactory) {
        const request = this._buildRequest('/api/nav', { forceReload: forceReload });
        return send(request).then(response => {
            this.nav = navFactory(response.data[0]);
            dispatchNavReload();
        });
    }

    async getOrFetchEntry(entryId: string) {
        if (!(entryId in this.loadedEntries)) {
            await this.fetchEntry(entryId);
        }
        return this.loadedEntries[entryId];
    }
}

const defaultCmsService = new CmsService();

export default defaultCmsService;

export { CmsService }
