import moment from "moment";
import {msgColor, contentLength, responseTime} from "../helpers";

const LEVEL = {
    INFO: "info",
    WARN: "warn",
    ERROR: "error",
};

export function httpRequestHandler(req, res, next) {
    const currentUrl = req.originalUrl || req.url;
    req._startTime = moment();
    const end = res.end;
    res.end = function (...args) {
        let endTime = moment();
        let processTime = endTime.diff(req._startTime, "ms");
        res.end = end;
        res.end(...args);

        endTime = endTime.format("YYYY-MM-DD HH:mm:ss");
        processTime = responseTime(processTime);
        const byteLength = contentLength(parseInt(res.get("content-length"), 10) || 0);
        const status = res.statusCode;

        const msg = `[${endTime}] ${req.method} ${currentUrl} ${status} - ${byteLength} - ${processTime}`;
        const level = status < 402 ? LEVEL.INFO : status < 500 ? LEVEL.WARN : LEVEL.ERROR;

        switch (level) {
            case LEVEL.INFO:
                console.info(msgColor("green", msg));
                break;
            case LEVEL.WARN:
                console.warn(msgColor("yellow", msg));
                break;
            case LEVEL.ERROR:
                console.error(msgColor("red", msg));
                break;

            default:
                console.log(msgColor("black", msg));
                break;
        }
    };

    next();
}
