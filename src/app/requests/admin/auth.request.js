import Joi from "joi";
import {MAX_STRING_SIZE, VALIDATE_PASSWORD_REGEX, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate} from "@/utils/types";
import {Admin} from "@/app/models";
import {comparePassword} from "@/utils/helpers";
import {validateName} from "@/utils/helpers/name.helper";

export const login = Joi.object({
    email: Joi.string().trim().required().max(MAX_STRING_SIZE).label("Email"),
    password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
});

export const updateProfile = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ và tên"),
    phone: Joi.string()
        .trim()
        .pattern(VALIDATE_PHONE_REGEX)
        .allow("")
        .label("Số điện thoại")
        .custom((value, helpers) => {
            if (value) {
                return new AsyncValidate(value, async function (req) {
                    const admin = await Admin.findOne({
                        phone: value,
                        deleted: false,
                        _id: {$ne: req.currentAccount._id},
                    });
                    return !admin ? value : helpers.error("any.exists");
                });
            }
            return value;
        }),
});

export const changePassword = Joi.object({
    password: Joi.string()
        .required()
        .label("Mật khẩu cũ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, (req) =>
                    comparePassword(value, req.currentAccount.password)
                        ? value
                        : helpers.message("{#label} không chính xác"),
                ),
        ),
    new_password: Joi.string()
        .min(6)
        .max(MAX_STRING_SIZE)
        .pattern(VALIDATE_PASSWORD_REGEX)
        .required()
        .label("Mật khẩu mới")
        .invalid(Joi.ref("password")),
});
