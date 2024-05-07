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
            default: null,
        },
        description: {
            type: String,
        },
        electricity_unit_price: {
            type: Number,
        },
        water_unit_price: {
            type: Number,
        },
        avatar: String,
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
