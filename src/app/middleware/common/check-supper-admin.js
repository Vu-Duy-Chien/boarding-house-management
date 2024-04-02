import { Admin } from "@/app/models";
import {responseError} from "@/utils/helpers";
import _ from "lodash";
import {isValidObjectId} from "mongoose";

export const checkSupperAdmin = async (req, res, next) => {
    const currentAccount = req.currentAccount;

    if (_.isArray(currentAccount.role_ids) && !!currentAccount.role_ids.length) {
        const cloneRoleIds = _.cloneDeep(currentAccount.role_ids);
        const checkPermission = async (hasRight) => {
            if (cloneRoleIds.length === 0) {
                return hasRight;
            }
            const role_id = cloneRoleIds.shift();
            if (isValidObjectId(role_id)) {
                const role = await Admin.findOne({_id: role_id, deleted: false});
                if (role && role.name === "super_admin") {
                    hasRight = true;
                    return hasRight;
                }
            }
            if (cloneRoleIds.length > 0) {
                return await checkPermission(hasRight);
            }
            return hasRight;
        };
        const result = checkPermission(false);

        if (result) return next();
    }

    return responseError(res, 403, "Không có quyền truy cập.");
};
