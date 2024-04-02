import {rateLimit} from "express-rate-limit";
import {REQUESTS_LIMIT_PER_MINUTE} from "@/configs";

// Middleware options parameter
export const rateLimitHandler = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: REQUESTS_LIMIT_PER_MINUTE,
    standardHeaders: "draft-7",
    legacyHeaders: false,
    message: {
        status: 429,
        error: true,
        message: "Có quá nhiều yêu cầu, vui lòng thử lại sau.",
    },
});
