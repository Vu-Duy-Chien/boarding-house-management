import {ObjectId, createModel} from "./base";

export const Contract = createModel(
    "Contract",
    "contracts",
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
        user_id: {
            type: ObjectId,
            required: true,
            ref: "User",
        },
        admin_id: {
            type: ObjectId,
            required: true,
            ref: "Admin",
        },
        code: {
            type: String,
            required: true,
        },
        start_date: {
            type: Date,
            required: true,
        },
        end_date: {
            type: Date,
            required: true,
        },
        room_price: {
            type: Number,
            required: true,
        },
        deposit_price: {
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
