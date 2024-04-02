import {ObjectId, createModel} from "./base";

export const Deposit = createModel(
    "Deposit",
    "deposits",
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
        amount: {
            type: Number,
            required: true,
        },
        deposit_date: {
            type: Date,
            required: true,
        },
        expiry_date: {
            type: Date,
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
