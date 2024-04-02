import {tryValidateOrDefault} from "@/utils/helpers";
import Joi from "joi";

export const readRoot = Joi.object({
    q: tryValidateOrDefault(Joi.string().trim(), null),
    status: tryValidateOrDefault(Joi.number().integer().valid(1), null),
    page: tryValidateOrDefault(Joi.number().integer().min(1), 1),
    per_page: tryValidateOrDefault(Joi.number().integer().min(1).max(100), 20),
    field: tryValidateOrDefault(
        Joi.valid(
            "created_at",
            "code",
            "package_name",
            "package_point",
            "package_current_price",
            "status",
            "user",
        ),
        "created_at",
    ),
    sort_order: tryValidateOrDefault(Joi.valid("asc", "desc"), "desc"),
    package_name: tryValidateOrDefault(Joi.array().single().items(Joi.string()), []),
});

export const changeStatus = Joi.object({
    status: Joi.valid(1).required().label("Trạng thái"),
});
