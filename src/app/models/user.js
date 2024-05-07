import { GENDER_TYPE } from "@/configs";
import {createModel} from "./base";

export const User = createModel(
    "User",
    "users",
    {
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
        },
        citizen_no: {
            type: String,
            required: true,
        },
        birthplace: {
            type: String
        },
        avatar: String
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
