import {responseError, responseSuccess, getToken} from "@/utils/helpers";
import * as authService from "@/app/services/auth.service";
import * as adminService from "@/app/services/admin.service";

export async function login(req, res) {
    const validLogin = await authService.checkValidAdminLogin(req.body);
    if (validLogin) {
        return responseSuccess(res, authService.authToken(validLogin._id));
    } else {
        return responseError(res, 400, "Email hoặc mật khẩu không đúng");
    }
}

export async function logout(req, res) {
    const token = getToken(req.headers);
    await authService.blockToken(token);
    return responseSuccess(res);
}

export async function me(req, res) {
    return responseSuccess(res, await authService.profile(req.currentAccount));
}

export async function updateProfile(req, res) {
    await adminService.updateProfile(req.currentAccount, req.body);
    return responseSuccess(res, null, 201);
}

export async function changePassword(req, res) {
    await authService.resetPassword(req.currentAccount, req.body.new_password);
    return responseSuccess(res, null, 201);
}