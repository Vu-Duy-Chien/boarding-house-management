import Joi from "joi";
import {Admin} from "@/app/models";
import {MAX_STRING_SIZE, VALIDATE_PASSWORD_REGEX, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate} from "@/utils/types";
import {validateName} from "@/utils/helpers/name.helper";

export const createAdmin = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const admin = await Admin.findOne({email: value, deleted: false});
                    return !admin ? value : helpers.error("any.exists");
                }),
        ),
    password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .pattern(VALIDATE_PASSWORD_REGEX)
        .required()
        .label("Mật khẩu"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    if (value) {
                        const admin = await Admin.findOne({phone: value, deleted: false});
                        return !admin ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
});

export const updateAdmin = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .email()
        .required()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const adminId = req.admin._id;
                    const admin = await Admin.findOne({email: value, deleted: false, _id: {$ne: adminId}});
                    return !admin ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const adminId = req.admin._id;
                    const admin = await Admin.findOne({phone: value, deleted: false, _id: {$ne: adminId}});
                    return !admin ? value : helpers.error("any.exists");
                }),
        ),
});

export const changeStatus = Joi.object({
    status: Joi.number().valid(1, 2).required().label("Trạng thái"),
});

export const changePassword = Joi.object({
    password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .pattern(VALIDATE_PASSWORD_REGEX)
        .required()
        .label("Mật khẩu"),
});
