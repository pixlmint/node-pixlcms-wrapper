export const queryFormatter = (obj: object, prefix?: any) => {
    let str = [],
        p;
    for (p in obj) {
        if (obj.hasOwnProperty(p)) {
            let k = prefix ? prefix + "[" + p + "]" : p,
                v = obj[p];
            // @ts-ignore
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

export const walkPath = function<T>(path: string, callback: (arg0: string) => false | any): T | undefined {
    // Normalize the path: ensure leading slash, remove trailing slash
    let normalizedPath = path.startsWith('/') ? path : '/' + path;
    normalizedPath = normalizedPath.replace(/\/+$/, '') || '/';

    // Split into segments and remove empty ones
    const segments = normalizedPath.split('/').filter(segment => segment !== '');

    // Walk up the path hierarchy
    for (let i = segments.length - 1; i >= 0; i--) {
        const currentPath = i === 0 ? '/' : '/' + segments.slice(0, i).join('/');
        const result = callback(currentPath);

        // Stop iteration if callback returns anything other than false
        if (result !== false) {
            return result;
        }
    }
}
