import Joi from "joi";

export const create = Joi.object({
    room_number: Joi.string().required().label("Số phòng"),
    area: Joi.number().min(2).max(1000).label("Diện tích"),
    price: Joi.number().allow("").label("Giá thuê"),
    maximum: Joi.number().min(1).max(100).label("Số người tối đa"),
    floor: Joi.number().min(1).max(100).label("Số tầng"),
    current_electric_reading: Joi.number().min(0).label("Số điện"),
    current_water_reading: Joi.number().min(0).label("Số nước"),
});

export const update = Joi.object({
    room_number: Joi.string().required().label("Số phòng"),
    area: Joi.number().min(2).max(1000).label("Diện tích"),
    price: Joi.number().allow("").label("Giá thuê"),
    maximum: Joi.number().min(1).max(100).label("Số người tối đa"),
    floor: Joi.number().min(1).max(100).label("Số tầng"),
    current_electric_reading: Joi.number().min(0).label("Số điện"),
    current_water_reading: Joi.number().min(0).label("Số nước"),
});
