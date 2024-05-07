import Joi from "joi";

export const create = Joi.object({
    name: Joi.string().required().label("Tên dịch vụ"),
    description: Joi.string().allow("").label("Mô tả"),
    price: Joi.number().required().min(0).label("Giá dịch vụ"),
});

export const update = Joi.object({
    name: Joi.string().required().label("Tên dịch vụ"),
    description: Joi.string().allow("").label("Mô tả"),
    price: Joi.number().min(0).required().label("Giá dịch vụ"),
});
