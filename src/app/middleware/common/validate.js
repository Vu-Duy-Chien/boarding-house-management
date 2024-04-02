import {validateAsync, responseError} from "@/utils/helpers";

export function validate(schema) {
    return async function (req, res, next) {
        const field = req.method === "GET" ? "query" : "body";

        const [value, error] = await validateAsync(schema, req[field], req);

        if (Object.keys(error).length > 0) {
            return responseError(res, 400, "Validation Error", error);
        }

        req[field] = value;
        return next();
    };
}
