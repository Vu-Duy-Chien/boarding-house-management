import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {BoardingRoom, Contract} from "../models";
import moment from "moment";
import {ROOM_STATUS} from "@/configs";

export const checkContractId = async function (req, res, next) {
    const _id = req.params.contractId;

    if (isValidObjectId(_id)) {
        const contract = await Contract.findOne({_id, deleted: false});
        if (contract) {
            req.contract = contract;
            return next();
        }
    }

    return responseError(res, 404, "Hợp đồng không tồn tại hoặc đã bị xóa");
};

export const checkStatusContract = async function (req, res, next) {
    const contract = req.contract;

    const currentDate = moment();

    const startDate = moment(contract.start_date);

    if (currentDate.isBefore(startDate, "day")) {
        return next();
    }

    return responseError(res, 404, "Hợp đồng không được phép chỉnh sửa");
};

export const checkContractByRoomId = async function (req, res, next) {
    let room = req.room;
    if (!room) {
        const room_id = req.params.roomId;

        if (isValidObjectId(room_id)) {
            room = await BoardingRoom.findOne({room_id, deleted: false});
            if (room) {
                if (room.status !== ROOM_STATUS.RENTED) {
                    return responseError(res, 400, "Phòng trọ chưa có người thuê");
                }
                req.room = room;
            } else {
                return responseError(res, 404, "Phòng trọ không tồn tại hoặc đã bị xóa");
            }
        }
    }

    if (room) {
        const currentDate = new Date();
        const contract = await Contract.findOne({
            room_id: room._id,
            start_date: {$lte: currentDate},
            end_date: {$gte: currentDate},
        });
        if (!contract) {
            return responseError(res, 404, "Hợp đồng không tồn tại hoặc đã bị xóa");
        }
        if (contract) {
            req.contract = contract;
            return next();
        }
    }

    return responseError(res, 404, "Hợp đồng không tồn tại hoặc đã bị xóa");
};
