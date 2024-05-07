import {Router} from "express";

import * as userMiddleware from "@/app/middleware/user.middleware";
import * as userRequest from "@/app/requests/user.request";
import * as userController from "@/app/controllers/user.controller";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/",
    asyncHandler(upload),
    asyncHandler(validate(userRequest.createUser)),
    asyncHandler(userController.createUser)
);

router.put(
    "/:userId",
    asyncHandler(upload),
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(validate(userRequest.updateUser)),
    asyncHandler(userController.updateUser),
);

router.delete(
    "/:userId",
    asyncHandler(userMiddleware.checkUserId),
    asyncHandler(userController.removeUser)
);

router.get(
    "/",
    asyncHandler(userController.getListUser)
);

export default router;
