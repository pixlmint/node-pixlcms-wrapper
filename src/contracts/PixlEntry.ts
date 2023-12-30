export interface PixlEntry {
    raw_content: string,
    content: string,
    id: string,
    url: string,
    hidden: boolean,
    meta: EntryMeta,
    file: string,
}

export interface EntryMeta {
    title: string,
    date_formatted: string,
    description: string | null,
    author: string | null,
    dateUpdated: string | null,
}
