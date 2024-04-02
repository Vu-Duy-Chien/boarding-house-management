import {responseError} from "../helpers";

export function notFoundHandler(req, res) {
    return responseError(res, 404, "Đường dẫn truy cập không tồn tại.");
}
