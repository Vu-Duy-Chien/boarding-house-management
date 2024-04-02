import { UTILITY_TYPE } from "@/configs";
import {ObjectId, createModel} from "./base";

export const Utility = createModel(
    "Utility",
    "utilities",
    {
        house_id: {
            type: ObjectId,
            required: true,
            ref: "BoardingHouse"
        },
        type: {
            type: Number,
            required: true,
            enum: UTILITY_TYPE
        },
        unit_price: {
            type: Number,
            required: true,
        }
    },
    {
        toJSON: {
            virtuals: false,
            transform: (doc, ret) => {
                // eslint-disable-next-line no-unused-vars
                const {deleted, ...result} = ret;
                return result;
            },
        }
    },
);
