import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {BoardingHouse} from "../models";

export const checkHouseId = async function (req, res, next) {
    const _id = req.params.houseId;

    if (isValidObjectId(_id)) {
        const house = await BoardingHouse.findOne({_id, deleted: false});
        if (house) {
            req.house = house;
            return next();
        }
    }

    return responseError(res, 404, "Khu trọ không tồn tại hoặc đã bị xóa");
};
