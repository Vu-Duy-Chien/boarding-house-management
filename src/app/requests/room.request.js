import {AsyncValidate} from "@/utils/types";
import Joi from "joi";
import {BoardingRoom, ObjectId} from "../models";
import {ROOM_STATUS} from "@/configs";

export const create = Joi.object({
    name: Joi.string()
        .required()
        .label("Tên phòng trọ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    const house = req.house;
                    const isDuplicate = await BoardingRoom.findOne({house_id: house._id, name: value});
                    return !isDuplicate ? value : helpers.error("any.exists");
                }),
        ),
    area: Joi.number().min(5).max(1000).required().label("Diện tích"),
    price: Joi.number().required().label("Giá phòng"),
    deposit_price: Joi.number().required().label("Giá đặt cọc"),
    maximum: Joi.number().min(1).max(100).required().label("Số người tối đa"),
    floor: Joi.number().min(1).max(10).required().label("Số tầng"),
    current_electric_reading: Joi.number().min(0).required().label("Số điện hiện tại"),
    current_water_reading: Joi.number().min(0).required().label("Số nước nước hiện tại"),
});

export const update = Joi.object({
    name: Joi.string()
        .required()
        .label("Tên phòng")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    const room = req.room;
                    const isDuplicate = await BoardingRoom.findOne({
                        house_id: room.house_id,
                        name: value,
                        _id: {$ne: new ObjectId(room._id)},
                    });
                    return !isDuplicate ? value : helpers.error("any.exists");
                }),
        ),
    area: Joi.number().min(5).max(1000).required().label("Diện tích"),
    price: Joi.number().required().label("Giá phòng"),
    deposit_price: Joi.number().required().label("Giá đặt cọc"),
    maximum: Joi.number().min(1).max(100).required().label("Số người tối đa"),
    status: Joi.number()
        .required()
        .valid(...Object.values(ROOM_STATUS))
        .label("Trạng thái"),
    floor: Joi.number().min(1).max(10).required().label("Số tầng"),
    current_electric_reading: Joi.number().min(0).required().label("Số điện hiện tại"),
    current_water_reading: Joi.number().min(0).required().label("Số nước nước hiện tại"),
});
