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
        room_number: {
            type: Number,
            required: true,
        },
        area: {
            type: Number,
        },
        price: {
            type: Number,
        },
        deposit_price: {
            type: Number,
        },
        status: {
            type: Number,
            default: ROOM_STATUS.NOT_RENTED,
        },
        maximum: {
            type: Number,
        },
        floor: {
            type: Number,
        },
        current_electric_reading: {
            type: Number,
        },
        current_water_reading: {
            type: Number,
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
