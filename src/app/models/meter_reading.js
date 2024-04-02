import {UTILITY_TYPE} from "@/configs";
import {ObjectId, createModel} from "./base";

export const MeterReading = createModel(
    "MeterReading",
    "meter_readings",
    {
        house_id: {
            type: ObjectId,
            required: true,
            ref: "BoardingHouse",
        },
        room_id: {
            type: ObjectId,
            required: true,
            ref: "BoardingRoom",
        },
        type: {
            type: Number,
            required: true,
            enum: Object.values(UTILITY_TYPE),
        },
        month: {
            type: Number,
            required: true,
        },
        year: {
            type: Number,
            required: true,
        },
        first_month_reading: {
            type: Number,
            required: true,
        },
        last_month_reading: {
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
