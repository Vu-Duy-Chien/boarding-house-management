import {Router} from "express";

import * as roomMiddleware from "@/app/middleware/room.middleware";
import * as houseMiddleware from "@/app/middleware/house.middleware";
import * as contractMiddleware from "@/app/middleware/contract.middleware";
import * as billMiddleware from "@/app/middleware/bill.middleware";
import * as billController from "@/app/controllers/bill.controller";
import * as billRequest from "@/app/requests/bill.request";

import {asyncHandler} from "@/utils/handlers";
import {validate, verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/:roomId/current-month",
    asyncHandler(roomMiddleware.checkRoomId),
    asyncHandler(contractMiddleware.checkContractByRoomId),
    asyncHandler(billController.getBill),
);

router.put(
    "/:roomId",
    asyncHandler(roomMiddleware.checkRoomId),
    asyncHandler(contractMiddleware.checkContractByRoomId),
    asyncHandler(billMiddleware.checkBillByContract),
    asyncHandler(validate(billRequest.createOrUpdate)),
    asyncHandler(billController.createOrUpdateBill),
);

router.get(
    "/:houseId",
    asyncHandler(houseMiddleware.checkHouseId),
    asyncHandler(billController.getListBill),
);

router.patch(
    "/:billId",
    asyncHandler(billMiddleware.checkBillIdForChangeStatus),
    asyncHandler(validate(billRequest.changeStatus)),
    asyncHandler(billController.changeBillStatus),
);

router.get(
    "/:billId/download-excel",
    asyncHandler(billMiddleware.checkBillIdForExportExcel),
    asyncHandler(billController.exportBillToExcelFile),
);

export default router;
