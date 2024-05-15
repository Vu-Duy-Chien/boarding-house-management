import { BILL_STATUS } from "@/configs";
import {ObjectId, createModel} from "./base";

export const Bill = createModel(
    "Bill",
    "bills",
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
        contract_id: {
            type: ObjectId,
            required: true,
            ref: "Contract",
        },
        user_id: {
            type: ObjectId,
            required: true,
            ref: "User",
        },
        code: {
            type: String,
            required: true,
        },
        total_amount: {
            type: Number,
            required: true,
        },
        service_amount: {
            type: Number,
            required: true,
        },
        electric_amount: {
            type: Number,
            required: true,
        },
        water_amount: {
            type: Number,
            required: true,
        },
        other_costs: {
            type: Number,
            default: 0,
        },
        meter_reading_id: {
            type: ObjectId,
            ref: "MeterReading",
        },
        time: {
            type: Date,
            required: true,
        },
        status: {
            type: Number,
            enum: Object.values(BILL_STATUS),
            default: BILL_STATUS.UNPAID
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
