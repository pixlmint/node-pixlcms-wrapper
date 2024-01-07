export const queryFormatter = (obj: object, prefix?: any) => {
    let str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            str.push((v !== null && typeof v === "object") ?
                queryFormatter(v, k) :
                encodeURIComponent(k) + "=" + encodeURIComponent(v));
        }
    }
    return str.join("&");
}

export const getFileExtension = (filePath: string) => {
    const re = /(?:\.([^.]+))?$/;
    return re.exec(filePath);
}