import { GENDER_TYPE } from "@/configs";
import {ObjectId, createModel} from "./base";

export const User = createModel(
    "User",
    "users",
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
        email: {
            type: String,
            default: null,
        },
        phone: {
            type: String,
            required: true,
        },
        gender: {
            type: Number,
            enum: Object.values(GENDER_TYPE),
            required: true,
        },
        citizen_no: {
            type: String,
            required: true,
        },
        birthplace: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
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
