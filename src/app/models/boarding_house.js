import {createModel} from "./base";

export const BoardingHouse = createModel(
    "BoardingHouse",
    "boarding_houses",
    {
        name: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
        description: {
            type: String,
        },
        electricity_unit_price: {
            type: Number,
            default: 3000
        },
        water_unit_price: {
            type: Number,
            default: 25000
        },
        avatar: {
            type: String,
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
