import {isNil} from "lodash";

export function responseSuccess(res, data, status = 200, message = "Success") {
    return res.status(status).json({
        status,
        error: false,
        message,
        ...(!isNil(data) && {data}),
    });
}

export function responseError(res, status = 400, message = "Error", detail) {
    return res.status(status).json({
        status,
        error: true,
        message,
        ...(!isNil(detail) && {detail}),
    });
}
