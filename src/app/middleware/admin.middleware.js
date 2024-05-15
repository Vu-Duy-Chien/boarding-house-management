import {responseError} from "@/utils/helpers";
import { Admin } from "@/app/models";
import { isValidObjectId } from "mongoose";
import { ADMIN_STATUS } from "@/configs";

export const checkAdminId = async function (req, res, next) {
    const _id = req.params.adminId ;

    if (isValidObjectId(_id)) {
        const admin = await Admin.findOne({_id, deleted: false, status: ADMIN_STATUS.UNLOCK});
        if (admin) {
            req.admin = admin;
            return next();
        }
    }

    return responseError(res, 404, "Quản trị viên không tồn tại hoặc đã bị xóa.");
};