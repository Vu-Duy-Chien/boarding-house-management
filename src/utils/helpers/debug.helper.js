import {SOURCE_DIR} from "@/configs";
import {escapeRegExp} from "lodash";

export function msgColor(c, str) {
    return (msgColor[c] || msgColor.black) + str + msgColor.reset;
}
msgColor.reset = "\u001b[0m";
msgColor.black = "\u001b[30m";
msgColor.red = "\u001b[31m";
msgColor.green = "\u001b[32m";
msgColor.yellow = "\u001b[33m";
msgColor.blue = "\u001b[34m";
msgColor.magenta = "\u001b[35m";
msgColor.cyan = "\u001b[36m";
msgColor.white = "\u001b[37m";

export function contentLength(byteLength) {
    const b = 1024;
    if (byteLength < b) {
        return `${byteLength} B`;
    }

    const kb = Math.pow(b, 2);
    if (byteLength < kb) {
        return `${(byteLength / b).toFixed(2)} KB`;
    }

    const mb = Math.pow(kb, 2);
    if (byteLength < mb) {
        return `${(byteLength / kb).toFixed(2)} MB`;
    }

    return `${(byteLength / mb).toFixed(2)} GB`;
}

export function responseTime(time = 0) {
    const milliseconds = 1000;
    if (time < milliseconds) {
        return `${time} ms`;
    }

    const second = milliseconds * 60;
    if (time < second) {
        return `${(time / milliseconds).toFixed(2)} s`;
    }

    const minute = second * 60;
    if (time < minute) {
        return `${(time / second).toFixed(2)} m`;
    }

    return `${(time / minute).toFixed(2)} h`;
}

export function normalizeError(error) {
    const re = new RegExp(escapeRegExp(SOURCE_DIR) + "(.*?)" + "\\)", "g");
    let stack = error.stack.match(re);
    stack = stack ? stack.map((item) => item.slice(0, -1)) : stack;
    return {
        type: error.name || "Error",
        message: error.message || `${error}`,
        stack,
    };
}
