import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import { BoardingRoom} from "../models";

export const checkRoomId = async function (req, res, next) {
    const _id = req.params.roomId;

    if (isValidObjectId(_id)) {
        const room = await BoardingRoom.findOne({_id, deleted: false});
        if (room) {
            req.room = room;
            return next();
        }
    }

    return responseError(res, 404, "Phòng trọ không tồn tại hoặc đã bị xóa");
};
