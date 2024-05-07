import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {Service} from "../models";

export const checkServiceId = async function (req, res, next) {
    const _id = req.params.serviceId;

    if (isValidObjectId(_id)) {
        const service = await Service.findOne({_id, deleted: false});
        if (service) {
            req.service = service;
            return next();
        }
    }

    return responseError(res, 404, "Dịch vụ không tồn tại hoặc đã bị xóa");
};
