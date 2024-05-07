import {Router} from "express";

import * as adminMiddleware from "@/app/middleware/admin.middleware";
import * as adminRequest from "@/app/requests/admin/admin.request";
import * as adminController from "@/app/controllers/admin/admin.controller";

import {asyncHandler} from "@/utils/handlers";
import {upload, validate, verifyToken} from "@/app/middleware/common";
import {checkSupperAdmin} from "@/app/middleware/common/check-supper-admin";

const router = Router();

router.use(asyncHandler(verifyToken));
router.use(asyncHandler(checkSupperAdmin));

router.post(
    "/",
    asyncHandler(upload),
    asyncHandler(validate(adminRequest.createAdmin)),
    asyncHandler(adminController.createAdmin)
);

router.put(
    "/:adminId",
    asyncHandler(upload),
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(validate(adminRequest.updateAdmin)),
    asyncHandler(adminController.updateAdmin),
);

router.patch(
    "/:adminId",
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(validate(adminRequest.changePassword)),
    asyncHandler(adminController.changePassword),
);

router.delete(
    "/:adminId",
    asyncHandler(adminMiddleware.checkAdminId),
    asyncHandler(adminController.removeAdmin)
);

router.get(
    "/",
    asyncHandler(adminController.getListAdmin)
);

export default router;
