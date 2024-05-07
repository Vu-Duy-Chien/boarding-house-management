import multer from "multer";
import {isArray} from "lodash";
import {FileUpload} from "@/utils/types";
import { UUID_TRANSLATOR } from "@/configs";

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
                for (const file of files) {
                    file.originalname = UUID_TRANSLATOR.generate();
                    const fieldname = file.fieldname;

                    if (req.body[fieldname]) {
                        if (isArray(req.body[fieldname])) {
                            req.body[fieldname].push(new FileUpload(file));
                        } else {
                            req.body[fieldname] = [req.body[fieldname], new FileUpload(file)];
                        }
                    } else {
                        req.body[fieldname] = new FileUpload(file);
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
