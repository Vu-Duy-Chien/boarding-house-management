import jwt from "jsonwebtoken";
import {SECRET_KEY} from "@/configs";

export function generateToken(type, data, expiresIn, secretKey) {
    return jwt.sign({type, data}, secretKey || SECRET_KEY, {
        ...(expiresIn && {expiresIn}),
    });
}

export function getToken(headers) {
    const token = headers.authorization;
    if (!token) return;
    const match = token.match(/Bearer\s*(.+)/);
    if (match && match.length > 1) {
        return match[1];
    }
    return;
}
