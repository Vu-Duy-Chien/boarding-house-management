import {ObjectId, createModel} from "./base";

export const ContractService = createModel(
    "ContractService",
    "contract_services",
    {
        house_id: {
            type: ObjectId,
            required: true,
            ref: "BoardingHouse",
        },
        contract_id: {
            type: ObjectId,
            required: true,
            ref: "Contract",
        },
        service_id: {
            type: ObjectId,
            required: true,
            ref: "Contract",
        },
        quantity: {
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
