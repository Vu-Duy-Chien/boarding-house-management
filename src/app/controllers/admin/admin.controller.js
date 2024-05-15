import {responseError, responseSuccess} from "@/utils/helpers";
import * as adminService from "@/app/services/admin.service";

export async function createAdmin(req, res) {
    await adminService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateAdmin(req, res) {
    await adminService.updateAdmin(req.admin, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeAdmin(req, res) {
    if (req.currentAccount._id.equals(req.admin._id)) {
        return responseError(res, 400, "Không thể xóa chính mình.");
    }

    await adminService.remove(req.admin);
    return responseSuccess(res);
}

export async function getListAdmin(req, res) {
    return responseSuccess(res, await adminService.getList(req.query, req));
}

export async function changeStatus(req, res) {
    if (req.currentAccount._id.equals(req.admin._id)) {
        return responseError(res, 400, "Không thể đổi trạng thái của chính mình.");
    }
    return responseSuccess(res, await adminService.changeStatus(req.admin, req.body.status));
}

export async function changePassword(req, res) {
    if (req.currentAccount._id.equals(req.admin._id)) {
        return responseError(res, 400, "Không thể tạo mật khẩu mới của chính mình.");
    }
    return responseSuccess(res, await adminService.changePassword(req.admin, req.body.password));
}

