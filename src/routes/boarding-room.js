import {Router} from "express";

import * as houseMiddleware from "@/app/middleware/house.middleware";
import * as roomMiddleware from "@/app/middleware/room.middleware";
import * as roomRequest from "@/app/requests/room.request";
import * as roomController from "@/app/controllers/room.controller";

import {asyncHandler} from "@/utils/handlers";
import {validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get("/:houseId", asyncHandler(houseMiddleware.checkHouseId), asyncHandler(roomController.getList));

router.post(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(validate(roomRequest.create)),
    asyncHandler(roomController.createRoom),
);

router.put(
    "/:roomId",
    asyncHandler(roomMiddleware.checkRoomId),
    asyncHandler(validate(roomRequest.update)),
    asyncHandler(roomController.updateRoom),
);

router.delete(
    "/:roomId",
    asyncHandler(roomMiddleware.checkRoomId),
    asyncHandler(roomController.removeRoom),
);

export default router;
