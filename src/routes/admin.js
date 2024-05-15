import {Router} from "express";

import * as adminController from "@/app/controllers/admin.controller";

import {asyncHandler} from "@/utils/handlers";
import {verifyToken} from "@/app/middleware/common";

const router = Router();

router.use(asyncHandler(verifyToken));

router.get(
    "/",
    asyncHandler(adminController.getAllAdmin)
);

export default router;
