import {FileSystemCache} from "file-system-cache";
import {CACHE_DIR} from "./constants";

class Cache {
    constructor() {
        this.basePath = CACHE_DIR;
        this.hash = "sha256";
        this.extension = "json";
    }

    create(namespace) {
        const options = namespace ? {ns: namespace} : {};
        Object.assign(options, this);
        const result = new FileSystemCache(options);
        return result;
    }
}

export const cache = new Cache();
