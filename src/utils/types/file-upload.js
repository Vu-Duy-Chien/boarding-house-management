import fs from "fs";
import path from "path";
import {extension} from "mime-types";
import {PUBLIC_DIR, UUID_TRANSLATOR} from "@/configs";
import {contentLength} from "../helpers";

export class FileUpload {
    static UPLOAD_FOLDER = "uploads";

    constructor({originalname, mimetype, buffer}) {
        this.originalname = originalname;
        this.mimetype = mimetype;
        this.buffer = buffer;
    }

    toJSON() {
        return {
            originalname: this.originalname,
            mimetype: this.mimetype,
            filesize: contentLength(Buffer.byteLength(this.buffer)),
            filepath: this.filepath,
        };
    }

    toString() {
        return this.filepath || this.originalname;
    }

    save(...paths) {
        if (!this.filepath) {
            const filename = `${UUID_TRANSLATOR.generate()}.${extension(this.mimetype)}`;
            const uploadDir = path.join(PUBLIC_DIR, FileUpload.UPLOAD_FOLDER, ...paths);
            fs.mkdirSync(uploadDir, {recursive: true});
            fs.writeFileSync(path.join(uploadDir, filename), this.buffer);
            this.filepath = path.posix.join(FileUpload.UPLOAD_FOLDER, ...paths, filename);
            return this.filepath;
        } else {
            throw new Error('File saved. Use the "filepath" attribute to retrieve the file path.');
        }
    }

    static remove(filepath) {
        filepath = path.join(PUBLIC_DIR, filepath);
        if (fs.existsSync(filepath)) {
            fs.unlinkSync(filepath);
        }
    }
}
