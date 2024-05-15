import {Router} from "express";

import * as roomMiddleware from "@/app/middleware/room.middleware";
import * as meterRequest from "@/app/requests/meter-reading";
import * as meterController from "@/app/controllers/meter-reading.controller";
import * as houseMiddleware from "@/app/middleware/house.middleware";

import {asyncHandler} from "@/utils/handlers";
import {validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get("/:houseId", asyncHandler(houseMiddleware.checkHouseId), asyncHandler(meterController.getList));

router.post(
    "/:roomId",
    asyncHandler(roomMiddleware.checkRoomId),
    asyncHandler(validate(meterRequest.create)),
    asyncHandler(meterController.createMeterInMonth),
);

export default router;
