import Joi from "joi";
import {MAX_STRING_SIZE} from "@/configs";
import {AsyncValidate} from "@/utils/types";
import {comparePassword} from "@/utils/helpers";

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
        .required()
        .label("Mật khẩu mới")
        .invalid(Joi.ref("password")),
});
