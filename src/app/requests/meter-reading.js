import {AsyncValidate} from "@/utils/types";
import Joi from "joi";

export const create = Joi.object({
    current_electric_reading: Joi.number()
        .required()
        .min(0)
        .label("Số điện")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    const room = req.room;
                    const isCheck = value >= room.current_electric_reading;
                    return isCheck ? value : helpers.message(`{#label} không được nhỏ hơn ${room.current_electric_reading}`);
                }),
        ),
    current_water_reading: Joi.number()
        .required()
        .min(0)
        .label("Số nước")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    const room = req.room;
                    const isCheck = value >= room.current_water_reading;
                    return isCheck ? value : helpers.message(`{#label} không được nhỏ hơn ${room.current_water_reading}`);
                }),
        ),
});
