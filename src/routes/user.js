import {Router} from "express";

import * as userMiddleware from "@/app/middleware/user.middleware";
import * as userRequest from "@/app/requests/user.request";
import * as userController from "@/app/controllers/user.controller";
import * as houseMiddleware from "@/app/middleware/house.middleware";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
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
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(userController.getListUser)
);

router.get(
    "/:houseId/all-user",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(userController.getAllUser)
);

export default router;
