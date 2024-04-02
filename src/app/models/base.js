import {Schema, Types, model} from "mongoose";

export function createModel(name, collection, definition, options) {
    const schema = new Schema(
        {
            deleted: {type: Boolean, default: false},
            ...definition,
        },
        {
            timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
            versionKey: false,
            ...(options ? options : {}),
        });

    return model(name, schema, collection);
}

export const {ObjectId} = Types;
