import multer from "multer";
import {isArray} from "lodash";
import {FileUpload} from "@/utils/types";

const defaultMulter = multer({
    storage: multer.memoryStorage(),
});

export function upload(req, res, next) {
    const newNext = function (err) {
        if (err) {
            return next(err);
        }

        try {
            const files = req.files;

            if (files) {
                for (let file of files) {
                    const fieldname = file.fieldname;
                    file = new FileUpload(file);

                    if (req.body[fieldname]) {
                        if (isArray(req.body[fieldname])) {
                            req.body[fieldname].push(file);
                        } else {
                            req.body[fieldname] = [req.body[fieldname], file];
                        }
                    } else {
                        req.body[fieldname] = file;
                    }
                }

                delete req.files;
            }

            next();
        } catch (error) {
            next(error);
        }
    };

    defaultMulter.any()(req, res, newNext);
}
