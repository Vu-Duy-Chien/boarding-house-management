import path from "path";
import short from "short-uuid";
import {config as loadEnv} from "dotenv";

loadEnv();

// directory
export const SOURCE_DIR = path.dirname(__dirname);
export const APP_DIR = path.dirname(SOURCE_DIR);
export const PUBLIC_DIR = path.join(APP_DIR, "public");
export const STORAGE_DIR = path.join(APP_DIR, "src", "storage");
export const LOG_DIR = path.join(STORAGE_DIR, "logs");
export const CACHE_DIR = path.join(STORAGE_DIR, "cache");
export const VIEW_DIR = path.join(APP_DIR, "src", "views");

// environment
export const APP_ENV = {
    PRODUCTION: "production",
    DEVELOPMENT: "development",
};
export const NODE_ENV = Object.values(APP_ENV).includes(process.env.NODE_ENV)
    ? process.env.NODE_ENV
    : APP_ENV.DEVELOPMENT;

export const APP_NAME = process.env.APP_NAME;
export const APP_DEBUG = process.env.APP_DEBUG === "true";
export const APP_URL = process.env.APP_URL;
export const APP_URL_CLIENT = process.env.APP_URL_CLIENT;
export const OTHER_URLS_CLIENT = process.env.OTHER_URLS_CLIENT
    ? JSON.parse(process.env.OTHER_URLS_CLIENT)
    : [];
export const SECRET_KEY = process.env.SECRET_KEY;
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const REQUESTS_LIMIT_PER_MINUTE = parseInt(process.env.REQUESTS_LIMIT_PER_MINUTE, 10) || 1000;

export const LINK_STATIC_URL = `${APP_URL}/static/`;

export const DATABASE_URI =
    "mongodb" +
    (process.env.DB_PORT ? "" : "+srv") +
    "://" +
    process.env.DB_HOST +
    (process.env.DB_PORT ? ":" + process.env.DB_PORT : "");
export const DB_NAME = process.env.DB_NAME;
export const DB_USERNAME = process.env.DB_USERNAME;
export const DB_PASSWORD = process.env.DB_PASSWORD;

export const MAIL_HOST = process.env.MAIL_HOST;
export const MAIL_PORT = process.env.MAIL_PORT;
export const MAIL_USERNAME = process.env.MAIL_USERNAME;
export const MAIL_PASSWORD = process.env.MAIL_PASSWORD;
export const MAIL_FROM_ADDRESS = process.env.MAIL_FROM_ADDRESS;
export const MAIL_FROM_NAME = process.env.MAIL_FROM_NAME;

export const CRYPTO_SECRET_KEY = process.env.CRYPTO_SECRET_KEY;

// other
export const SALT_ROUNDS = 10;
export const TOKEN_TYPE = {
    AUTHORIZATION: "AUTHORIZATION",
};
export const MAX_STRING_SIZE = 255;

export const UUID_TRANSLATOR = short();

export const JOI_DEFAULT_MESSAGE = {
    // boolean
    "boolean.base": "{{#label}} sai định dạng.",

    // string
    "string.base": "{{#label}} sai định dạng.",
    "string.empty": "{{#label}} không được bỏ trống.",
    "string.min": "{{#label}} không được ít hơn {{#limit}} ký tự.",
    "string.max": "{{#label}} không được vượt quá {{#limit}} ký tự.",
    "string.pattern.base": "{{#label}} không đúng định dạng.",
    "string.email": "{{#label}} không đúng định dạng.",

    // number
    "number.base": "{{#label}} sai định dạng.",
    "number.integer": "{{#label}} sai định dạng.",
    "number.min": "{{#label}} không được nhỏ hơn {{#limit}}.",
    "number.max": "{{#label}} không được lớn hơn {{#limit}}.",

    // array
    "array.base": "{{#label}} sai định dạng.",
    "array.unique": "Các {{#label}} không được giống nhau.",
    "array.min": "{{#label}} không được ít hơn {{#limit}} phần tử.",
    "array.max": "{{#label}} không được vượt quá {{#limit}} phần tử.",
    "array.length": "{{#label}} phải có đúng {{#limit}} phần tử.",
    "array.includesRequiredUnknowns": "{{#label}} không hợp lệ.",
    "array.includesRequiredKnowns": "{{#label}} không hợp lệ.",

    // object
    "object.base": "{{#label}} sai định dạng.",
    "object.unknown": "Trường {#key} không được xác định.",
    "object.instance": "{{#label}} không đúng định dạng.",

    // binary
    "binary.base": "{{#label}} sai định dạng.",
    "binary.min": "{{#label}} không được ít hơn {{#limit}} bytes.",
    "binary.max": "{{#label}} không được vượt quá {{#limit}} bytes.",

    // any
    "any.only": "{{#label}} phải là {if(#valids.length == 1, '', 'một trong ')}{{#valids}}.",
    "any.required": "{{#label}} không được bỏ trống.",
    "any.unknown": "Trường {#key} không được xác định.",
    "any.invalid": "{{#label}} không hợp lệ.",
    "any.exists": "{{#label}} đã tồn tại.",
    "any.not-exists": "{{#label}} không tồn tại.",
    "any.activated": "{{#label}} đã được kích hoạt.",
    "any.not-activated": "{{#label}} chưa được kích hoạt.",
    "any.incorrect": "{{#label}} không chính xác.",
    "any.locked": "{{#label}} đã bị khóa.",
};

export const JOI_DEFAULT_OPTIONS = {
    abortEarly: false,
    errors: {
        wrap: {label: false},
        language: {"any.exists": "any.exists"},
    },
    externals: false,
    stripUnknown: true,
};

export const VALIDATE_PHONE_REGEX = /^(0[235789])[0-9]{8}$/;
export const VALIDATE_EMAIL_REGEX = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
export const VALIDATE_PASSWORD_REGEX = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[^\w\s]).{6,50}$/;
