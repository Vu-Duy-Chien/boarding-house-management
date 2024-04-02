import {
    logger,
    MAIL_HOST,
    MAIL_PORT,
    MAIL_USERNAME,
    MAIL_PASSWORD,
    MAIL_FROM_ADDRESS,
    MAIL_FROM_NAME,
    VIEW_DIR,
} from "@/configs";
import nodeMailer from "nodemailer";
import {renderFile} from "ejs";
import {join} from "path";
import {normalizeError} from "./debug.helper";

export function generateURL(url = "", params = {}) {
    url = url.split("/");
    url = url.map(function (item) {
        if (item.startsWith(":")) {
            const key = item.substring(1);
            if (key in params) {
                item = encodeURIComponent(params[key]);
                delete params[key];
            }
        }
        return item;
    });
    url = url.join("/");
    const keyParams = Object.keys(params);
    if (keyParams.length > 0) {
        url += "?" + keyParams.map((key) => `${key}=${encodeURIComponent(params[key])}`).join("&");
    }
    return url;
}

const transport = nodeMailer.createTransport({
    host: MAIL_HOST,
    port: MAIL_PORT,
    secure: false,
    auth: {
        user: MAIL_USERNAME,
        pass: MAIL_PASSWORD,
    },
});

export async function sendMail(to, subject, template, data, fromName) {
    try {
        const html = await renderFile(join(VIEW_DIR, template), data);
        return await transport.sendMail({
            from: {
                address: MAIL_FROM_ADDRESS,
                name: fromName || MAIL_FROM_NAME,
            },
            to,
            subject,
            html,
        });
    } catch (error) {
        logger.error({
            message: `Error send mail to ${to}`,
            error: normalizeError(error),
        });
    }
}
