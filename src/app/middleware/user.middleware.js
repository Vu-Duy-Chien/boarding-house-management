import {isValidObjectId} from "mongoose";
import {responseError} from "@/utils/helpers";
import {Admin as User} from "@/app/models";

export const checkUserId = async function (req, res, next) {
    const _id = req.params.id;

    if (isValidObjectId(_id)) {
        const user = await User.findOne({_id});
        if (user) {
            req.user = user;
            return next();
        }
    }

    return responseError(res, 404, "Người dùng không tồn tại hoặc đã bị xóa");
};
