import { Ref } from "vue";

export type EntryKind = 'plain' | 'pdf' | 'ipynb' | 'board' | 'link' | 'card';

export type NavResponseElement = {
    title: string,
    id: string,
    url: string,
    showing: boolean,
    children: NavResponseElement[],
    isPublic: boolean,
    isFolder: boolean,
    kind: EntryKind,
}


export interface INav {
    root: IFolderNavElement,
}

export type NavFactory = (navResponse: NavResponseElement) => INav;

export type INavElement = {
    id: string,
    title: string,
    kind: EntryKind,
    isPublic: boolean,

    domain?: string,
    relativeRoot?: string,

    // rename: () => void,
    // switchSecurity: () => void,
    // delete: () => void,
}

export function isNavElement(item: any) {
    return typeof(item) !== 'undefined'
            && typeof(item.title) !== 'undefined'
            && typeof(item.id) !== 'undefined'
            && typeof(item.kind) !== 'undefined'
            && (item.kind in ['plain', 'pdf', 'ipynb', 'board', 'link', 'card'])
            && typeof(item.isPublic) === 'boolean';
}

export type IFolderNavElement = INavElement & {
    children: INavElement[] | Ref<INavElement[]>,

    // getChildren: () => INavElement[],
    // getChild: (id: string) => null | INavElement,
    // addPage: () => void,
    // addSubfolder: () => void,
}


