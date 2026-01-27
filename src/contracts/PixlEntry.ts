export interface PixlEntry {
    raw_content: string,
    content: string,
    id: string,
    url: string,
    hidden: boolean,
    meta: EntryMeta,
    file: string,
    domain?: string,
    root?: string,
}

export interface EntryMeta extends Record<string | number, any> {
    title: string,
    date_formatted: string,
    description: string | null,
    author: string | null,
    owner: string | null,
    security: string | null,
    dateUpdated: string | null | Date,
    dateCreated: string | null | Date,
}
