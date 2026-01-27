import { defineStore } from "pinia"
import { buildRequest, send } from "../helpers/xhr";
import { Backend } from "./backend";
import { walkPath } from "../helpers/utils";
import type { INav, NavFactory } from "../contracts/nav";
import { Entry } from "..";

interface EditorState {
    lastSaved: Date | null,
    editingUnsavedChanges: boolean,
}

// export interface Entry {
//     raw_content: string,
//     content: string,
//     id: string,
//     url: string,
//     hidden: boolean,
//     meta: EntryMeta,
//     file: string,
// }
//
// export interface EntryMeta {
//     title: string,
//     date_formatted: string,
//     description: string | null,
//     author: string | null,
//     owner: string | null,
//     security: string | null,
//     dateUpdated: string | null,
//     dateCreated: string | null,
// }

interface State {
    loadedEntries: Entry[],
    currentEntry: Entry | null,
    nav: INav | null,
    editor: EditorState,
    openedSubmenus: String[],
    backend: Backend | null,
}

export const cmsStoreConfig = {
    state: (): State => ({
        loadedEntries: [],
        currentEntry: null,
        nav: null,
        editor: {
            lastSaved: null,
            editingUnsavedChanges: false,
        },
        openedSubmenus: [],
        backend: null,
    }),
    getters: {
        safeCurrentEntry: (state: State) => {
            if (state.currentEntry === null) {
                throw new Error('currentEntry is null');
            }

            return state.currentEntry;
        },
    },
    actions: {
        _buildRequest: buildRequest,
        dumpAlternateContent(page: string | null = null) {
            const data = {};
            if (page !== null)
                data.page = page;
            const request = this._buildRequest('/api/admin/alternate/dump-file-into-content', data);
            return send(request);
        },
        saveCurrentEntry() {
            const currentEntry = this.safeCurrentEntry;
            this.editor.editingUnsavedChanges = false;
            return this.saveEntry(currentEntry);
        },
        async saveEntry(entry: Entry) {
            const data = {
                content: entry.raw_content,
                meta: JSON.stringify(entry.meta),
                entry: entry.id,
                lastUpdate: entry.meta.dateUpdated,
            }
            const request = this._buildRequest('/api/admin/entry/edit', data, 'PUT');
            return send(request).then(response => {
                this.editor.lastSaved = new Date();
                this.safeCurrentEntry.meta.dateUpdated = response.data.lastUpdate;
                this.fetchEntry(this.safeCurrentEntry.id);
                return response;
            });
        },
        async fetchEntry(entry: string) {
            const request = this._buildRequest('/api/entry/view', { p: entry });
            return send(request, true).then(response => {
                this.currentEntry = response.data;
                this.loadedEntries.push(response.data);
                return true;
            }).catch(async reason => {
                const parentLink = await this._testIsParentLink(entry);
                return false;
            });
        },
        async _testIsParentLink(entry: string) {
            const that = this;
            return await this.loadNav().then(() => {
                return walkPath(entry, function(parent: string) {
                    const child = that.nav!.root.getChild(parent);
                    if (child !== null && child.kind === 'link') {
                        return child;
                    } else {
                        return false;
                    }
                });
            })
        },
        async fetchLastChanged(entry: string) {
            const request = this._buildRequest('/api/admin/entry/fetch-last-changed', { entry: entry });
            return send(request).then(response => {
                return new Date(response.data.lastChanged);
            });
        },
        async getCurrentEntryFromServer() {
            const request = this._buildRequest('/api/entry/view', { p: this.safeCurrentEntry.id });
            let response = await send(request);
            return response.data.raw_content;
        },
        addEntry(parentFolder: string, title: string) {
            const data = {
                parentFolder: parentFolder,
                title: title,
            };
            const request = this._buildRequest('/api/admin/entry/add', data, 'POST');
            return send(request);
        },
        addFolder(parentFolder: string, folderName: any) {
            const data = {
                parentFolder: parentFolder,
                folderName: folderName,
            };
            const request = this._buildRequest('/api/admin/folder/add', data, 'POST');
            return send(request);
        },
        deleteFolder(folderName: string, token: string | null) {
            const request = this._buildRequest('/api/admin/folder/delete', { entry: folderName }, 'DELETE');
            return send(request);
        },
        deleteEntry(entry: string) {
            const request = this._buildRequest('/api/admin/entry/delete', { entry: entry }, 'DELETE');
            return send(request);
        },
        renameEntry(newName: string) {
            if (this.currentEntry === null) {
                throw 'Current Entry is not defined';
            }
            this.currentEntry.meta.title = newName;
            const data = {
                'new-title': newName,
                entry: this.currentEntry.id,
            }
            const request = this._buildRequest('/api/admin/entry/rename', data, 'PUT');
            return send(request);
        },
        setSecurityState(entry: string, newState: string) {
            const data = {
                entry: entry,
                new_state: newState,
            }
            const request = this._buildRequest('/api/admin/entry/change-security', data, 'PUT');
            return send(request);
        },
        async loadNav(forceReload: boolean = false, navFactory: NavFactory) {
            let url = '/api/nav';
            if (forceReload) {
                url += '?forceReload=true';
            }
            const request = this._buildRequest(url);
            return send(request).then(response => {
                this.nav = navFactory(response.data[0]);
            });
        },
        getEntryById(id: string): Entry | null {
            const entries = this.getLoadedEntries;
            for (let i = 0; i < entries.length; i++) {
                const entry = entries[i];
                if (entry.id === id) {
                    return entry;
                }
            }

            return null;
        },
    }
}

export const useCmsStore = defineStore('cmsStore', cmsStoreConfig);

