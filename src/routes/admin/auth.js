import {Router} from "express";
import {asyncHandler} from "@/utils/handlers";
import { validate, verifyToken} from "@/app/middleware/common";

import * as authRequest from "@/app/requests/admin/auth.request";
import * as authController from "@/app/controllers/admin/auth.controller";

const router = Router();

router.post(
    "/login",
    asyncHandler(validate(authRequest.login)),
    asyncHandler(authController.login),
);

router.post(
    "/logout",
    asyncHandler(verifyToken),
    asyncHandler(authController.logout)
);

router.get(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(authController.me)
);

router.put(
    "/me",
    asyncHandler(verifyToken),
    asyncHandler(validate(authRequest.updateProfile)),
    asyncHandler(authController.updateProfile),
);

router.patch(
    "/change-password",
    asyncHandler(verifyToken),
    asyncHandler(validate(authRequest.changePassword)),
    asyncHandler(authController.changePassword),
);

export default router;
