import { FileUpload } from "@/utils/types";
import Joi from "joi";

export const create = Joi.object({
    name: Joi.string().required().label("Tên nhà trọ"),
    address: Joi.string().min(2).max(1000).required().label("Địa chỉ"),
    description: Joi.string().allow("").label("Mô tả"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện")
        .required(),
});

export const update = Joi.object({
    name: Joi.string().required().label("Tên nhà trọ"),
    address: Joi.string().min(2).max(1000).required().label("Địa chỉ"),
    description: Joi.string().allow("").label("Mô tả"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().required().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .allow("")
        .label("Ảnh đại diện"),
});

export const updateElectricityWater = Joi.object({
    electricity_unit_price: Joi.number().min(0).required().label("Giá điện"),
    water_unit_price: Joi.number().min(0).required().label("Giá nước"),
});
