import {logger} from "@/configs";
import {normalizeError} from "../helpers";

export function commandHandler(fn) {
    return async function (...args) {
        try {
            return await fn(...args);
        } catch (error) {
            logger.error(normalizeError(error));
        }
    };
}
