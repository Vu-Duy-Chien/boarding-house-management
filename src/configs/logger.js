import moment from "moment";
import {createLogger, format, transports} from "winston";
import {LOG_DIR} from "./constants";

class Logger {
    #logger;
    constructor() {
        this.#logger = createLogger({
            format: format.combine(
                format((info) => ({...info, _date: moment().format("dddd DD-MM-YYYY, HH:mm:ss")}))(),
                format.json({space: 4}),
            ),
        });
        return new Proxy(this, {
            get: function (target, prop) {
                const fileLog = `node-${moment().format("YYYY-MM-DD")}.log`;
                if (
                    target.#logger.transports.length < 1 ||
                    target.#logger.transports[0].filename !== fileLog
                ) {
                    target.#logger.configure({
                        transports: new transports.File({
                            filename: fileLog,
                            dirname: LOG_DIR,
                        }),
                    });
                }

                return target.#logger[prop];
            },
        });
    }
}

export const logger = new Logger();
