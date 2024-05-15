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
        time: {
            type: Date,
            required: true,
        },
        old_electric_reading: {
            type: Number,
            required: true,
        },
        old_water_reading: {
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
