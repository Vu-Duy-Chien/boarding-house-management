import {Router} from "express";

import * as houseMiddleware from "@/app/middleware/house.middleware";
import * as serviceMiddleware from "@/app/middleware/service.middleware";
import * as serviceRequest from "@/app/requests/service.request";
import * as serviceController from "@/app/controllers/service.controller";

import {asyncHandler} from "@/utils/handlers";
import {validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get("/:houseId", asyncHandler(houseMiddleware.checkHouseId), asyncHandler(serviceController.getList));
router.get("/:houseId/all-service", asyncHandler(houseMiddleware.checkHouseId), asyncHandler(serviceController.getAllService));

router.post(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(validate(serviceRequest.create)),
    asyncHandler(serviceController.createService),
);

router.put(
    "/:serviceId",
    asyncHandler(serviceMiddleware.checkServiceId),
    asyncHandler(validate(serviceRequest.update)),
    asyncHandler(serviceController.updateService),
);

router.delete(
    "/:serviceId",
    asyncHandler(serviceMiddleware.checkServiceId),
    asyncHandler(serviceController.removeService),
);

export default router;
