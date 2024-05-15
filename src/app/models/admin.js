import {ADMIN_STATUS, PERMISSIONS} from "@/configs";
import {createModel} from "./base";

export const Admin = createModel(
    "Admin",
    "admins",
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            lowercase: true,
            required: true,
        },
        phone: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            required: true,
        },
        permissions: {
            type: [{type: String, enum: Object.values(PERMISSIONS)}],
            default: [],
        },
        status: {
            type: Number,
            enum: Object.values(ADMIN_STATUS),
            default: ADMIN_STATUS.UNLOCK,
        },
        avatar: {
            type: String,
            required: true
        },
    },
    {
        toJSON: {
            virtuals: false,
            transform: (doc, ret) => {
                // eslint-disable-next-line no-unused-vars
                const {password, deleted, ...result} = ret;
                return result;
            },
        },
    },
);
