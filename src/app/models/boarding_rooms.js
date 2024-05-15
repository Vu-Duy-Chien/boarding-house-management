import {ROOM_STATUS} from "@/configs";
import {ObjectId, createModel} from "./base";

export const BoardingRoom = createModel(
    "BoardingRoom",
    "boarding_rooms",
    {
        house_id: {
            type: ObjectId,
            required: true,
            ref: "BoardingHouse",
        },
        name: {
            type: String,
            required: true,
        },
        area: {
            type: Number,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        deposit_price: {
            type: Number,
            required: true,
        },
        status: {
            type: Number,
            default: ROOM_STATUS.NOT_RENTED,
        },
        maximum: {
            type: Number,
            required: true,
        },
        floor: {
            type: Number,
            required: true,
        },
        current_electric_reading: {
            type: Number,
            required: true,
        },
        current_water_reading: {
            type: Number,
            required: true,
        },
    },
    {
        toJSON: {
            virtuals: false,
            transform: (doc, ret) => {
                // eslint-disable-next-line no-unused-vars
                const {deleted, ...result} = ret;
                return result;
            },
        },
    },
);
