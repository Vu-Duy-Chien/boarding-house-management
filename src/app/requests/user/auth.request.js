import Joi from "joi";
import {MAX_STRING_SIZE, VALIDATE_EMAIL_REGEX, VALIDATE_PASSWORD_REGEX, VALIDATE_PHONE_REGEX} from "@/configs";
import {validateName} from "@/utils/helpers/name.helper";
import {AsyncValidate} from "@/utils/types";
import {Admin as User} from "@/app/models";
import {activateOTPlist, forgotPasswordOTPlist} from "@/app/services/auth.service";

export const updateMe = Joi.object({
    name: Joi.string().required().max(MAX_STRING_SIZE).custom(validateName).label("Họ và tên"),
    email: Joi.string().trim().max(MAX_STRING_SIZE).pattern(VALIDATE_EMAIL_REGEX).allow("").label("Email"),
});

export const login = Joi.object({
    phone: Joi.string()
        .trim()
        .required()
        .max(MAX_STRING_SIZE)
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && !account.confirmed) {
                        return helpers.error("any.not-activated");
                    }
                    if (account && account.status === 1) {
                        return helpers.error("any.locked");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.userLogin = account;
                    return value;
                }),
        ),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

export const register = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ và tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .allow("")
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const account = await User.findOne({email: value, deleted: false});
                    return !account ? value : helpers.error("any.exists");
                }),
        ),
    password: Joi.string().min(6).max(MAX_STRING_SIZE).pattern(VALIDATE_PASSWORD_REGEX).required().label("Mật khẩu"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const account = await User.findOne({phone: value, deleted: false});
                    return !account ? value : helpers.error("any.exists");
                }),
        ),
});

export const activate = Joi.object({
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && account.confirmed) {
                        return helpers.error("any.activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.activateUser = account;
                    return value;
                }),
        )
        .label("Số điện thoại"),
    code: Joi.string()
        .length(6)
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const OTPCode = await activateOTPlist.get(req.body.phone);
                    return OTPCode === value ? value : helpers.error("any.incorrect");
                }),
        )
        .label("Mã OTP"),
});

export const resendOTP = Joi.object({
    phone: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && account.confirmed) {
                        return helpers.error("any.activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.activateUser = account;
                    return value;
                }),
        )
        .label("Số điện thoại"),
});

export const forgotPassword = Joi.object({
    phone: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && !account.confirmed) {
                        return helpers.error("any.not-activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.forgotUser = account;
                    return value;
                }),
        )
        .label("Số điện thoại"),
});

export const verifiedForgotPassword = Joi.object({
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && !account.confirmed) {
                        return helpers.error("any.not-activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.forgotUser = account;
                    return value;
                }),
        )
        .label("Số điện thoại"),
    code: Joi.string()
        .length(6)
        .required()
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const OTPCode = await forgotPasswordOTPlist.get(req.body.phone);
                    return OTPCode === value ? value : helpers.error("any.incorrect");
                }),
        )
        .label("Mã OTP"),
});

export const confirmForgotPassword = Joi.object({
    password: Joi.string().min(6).max(MAX_STRING_SIZE).pattern(VALIDATE_PASSWORD_REGEX).required().label("Mật khẩu"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .required()
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const account = await User.findOne({phone: value, deleted: false});
                    if (account && !account.confirmed) {
                        return helpers.error("any.not-activated");
                    }
                    if (!account) {
                        return helpers.error("any.not-exists");
                    }
                    req.forgotUser = account;
                    return value;
                }),
        ),
});
