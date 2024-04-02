import _ from "lodash";
import CryptoJS from "crypto-js";
import {CRYPTO_SECRET_KEY} from "@/configs";

export const removeVietnameseCharacters = (str) => _.deburr(str);

export const generateRandomString = (length, characters) => {
    let result = "";
    const charactersLength = characters.length;

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charactersLength);
        result += characters.charAt(randomIndex);
    }

    return result;
};

export const generateOTP = (length) => {
    const characters = "0123456789";
    return generateRandomString(length, characters);
};

export const generateCodeOrder = (length) => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    return generateRandomString(length, characters);
};

export const encodeNum = (num) => {
    const strNum = String(num);
    return CryptoJS.AES.encrypt(strNum, CRYPTO_SECRET_KEY).toString();
};

export const decodeNum = (encodedStr) => {
    const bytes = CryptoJS.AES.decrypt(encodedStr, CRYPTO_SECRET_KEY);
    const decryptedNum = bytes.toString(CryptoJS.enc.Utf8);
    return parseInt(decryptedNum);
};
