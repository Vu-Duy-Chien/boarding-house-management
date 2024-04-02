import {PERMISSIONS} from "@/configs";
import {responseError} from "@/utils/helpers";
import _ from "lodash";

export const checkSupperAdmin = async (req, res, next) => {
    const currentAccount = req.currentAccount;

    if (_.isArray(currentAccount.permissions) && !!currentAccount.permissions.length) {
        const result = currentAccount.permissions.includes(PERMISSIONS.SUPER_ADMIN);
        if (result) return next();
    }

    return responseError(res, 403, "Không có quyền truy cập.");
};
