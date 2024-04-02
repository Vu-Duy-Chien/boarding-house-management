import bcrypt from "bcrypt";
import {SALT_ROUNDS} from "@/configs";

export function generatePassword(password) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
}
