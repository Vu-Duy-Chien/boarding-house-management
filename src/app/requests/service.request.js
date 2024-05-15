import { AsyncValidate } from "@/utils/types";
import Joi from "joi";
import { Service } from "../models";

export const create = Joi.object({
    name: Joi.string().required().label("Tên dịch vụ").custom(
        (value, helpers) =>
            new AsyncValidate(value, async (req) => {
                const house = req.house;
                const isDuplicate = await Service.findOne({house_id: house._id, name: value});
                return !isDuplicate ? value : helpers.error("any.exists");
            }),
    ),
    description: Joi.string().allow("").label("Mô tả"),
    price: Joi.number().required().min(0).label("Giá dịch vụ"),
    unit: Joi.string().required().label("Đơn vị"),
});

export const update = Joi.object({
    name: Joi.string().required().label("Tên dịch vụ").custom(
        (value, helpers) =>
            new AsyncValidate(value, async (req) => {
                const service = req.service;
                const isDuplicate = await Service.findOne({
                    house_id: service.house_id,
                    name: value,
                    _id: {$ne: service._id},
                });
                return !isDuplicate ? value : helpers.error("any.exists");
            }),
    ),
    description: Joi.string().allow("").label("Mô tả"),
    price: Joi.number().min(0).required().label("Giá dịch vụ"),
    unit: Joi.string().required().label("Đơn vị"),
});
