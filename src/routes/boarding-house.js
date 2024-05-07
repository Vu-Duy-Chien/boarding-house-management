import {Router} from "express";

import * as houseMiddleware from "@/app/middleware/house.middleware";
import * as houseRequest from "@/app/requests/house.request";
import * as houseController from "@/app/controllers/house.controller";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/",
    asyncHandler(upload),
    asyncHandler(validate(houseRequest.create)),
    asyncHandler(houseController.createHouse),
);

router.put(
    "/:houseId",
    asyncHandler(upload),
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(validate(houseRequest.update)),
    asyncHandler(houseController.updateHouse),
);

router.delete(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(houseController.removeHouse),
);

router.get("/", asyncHandler(houseController.getList));

export default router;
