import {Router} from "express";

import * as houseMiddleware from "@/app/middleware/house.middleware";
import * as contractMiddleware from "@/app/middleware/contract.middleware";
import * as contractRequest from "@/app/requests/contract.request";
import * as contractController from "@/app/controllers/contract.controller";

import {asyncHandler} from "@/utils/handlers";
import {validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.post(
    "/",
    asyncHandler(validate(contractRequest.create)),
    asyncHandler(contractController.createContract),
);

router.put(
    "/:contractId",
    asyncHandler(contractMiddleware.checkContractId),
    asyncHandler(contractMiddleware.checkStatusContract),
    asyncHandler(validate(contractRequest.update)),
    asyncHandler(contractController.updateContract),
);

router.delete(
    "/:contractId",
    asyncHandler(contractMiddleware.checkContractId),
    asyncHandler(contractController.removeContract),
);

router.get(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(contractController.getList),
);

export default router;
