import {getToken, responseError, responseSuccess} from "@/utils/helpers";
import * as authService from "@/app/services/auth.service";

export async function login(req, res) {
    const validLogin = await authService.checkValidUserLogin(req.body, req.userLogin);
    if (validLogin) {
        return responseSuccess(res, authService.authToken(validLogin._id, validLogin.account_type));
    } else {
        return responseError(res, 400, "Số điện thoại hoặc mật khẩu không chính xác.");
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

export async function updateMe(req, res) {
    await authService.updateInfo(req.currentAccount, req.body);
    return responseSuccess(res, null, 201, "Cập nhật thông tin tài khoản thành công.");
}

export async function changePassword(req, res) {
    await authService.resetPassword(req.currentAccount, req.body.new_password);
    return responseSuccess(res, null, 201, "Đổi mật khẩu thành công.");
}

export async function register(req, res) {
    const newUser = await authService.register(req.body);


    return responseSuccess(res, null, 201, "Tạo tài khoản thành công, để kích hoạt vui lòng nhập mã OTP.");
}

export async function activate(req, res) {
    await authService.activate(req.activateUser);
    return responseSuccess(res, null, 201, "Kích hoạt tài khoản thành công.");
}

export async function resendOTP(req, res) {
    const user = req.activateUser;
    const oldOTPCode = await authService.activateOTPlist.get(user.phone);
    if (oldOTPCode) {
        return responseError(
            res,
            429,
            "Yêu cầu gửi lại OTP bị từ chối. Vui lòng đợi một thời gian trước khi thử lại.",
        );
    }
    return responseSuccess(res, null, 201, "Mã OTP đã được gửi.");
}

export async function forgotPassword(req, res) {
    const user = req.forgotUser;
    const oldOTPCode = await authService.forgotPasswordOTPlist.get(user.phone);
    if (oldOTPCode) {
        return responseError(
            res,
            429,
            "Yêu cầu gửi lại OTP bị từ chối. Vui lòng đợi một thời gian trước khi thử lại.",
        );
    }
    return responseSuccess(res, null, 201, "Mã OTP đã được gửi.");
}

export async function verifiedForgotPassword(req, res) {
    const user = req.forgotUser;
    return responseSuccess(res, null, 200, "Xác nhận OTP thành công.");
}

export async function confirmForgotPassword(req, res) {
    await authService.resetPassword(req.forgotUser, req.body.password);
    return responseSuccess(res, null, 201, "Thay đổi mật khẩu thành công.");
}
