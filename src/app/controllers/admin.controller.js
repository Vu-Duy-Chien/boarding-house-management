import * as adminService from "@/app/services/admin.service";
import { responseSuccess } from "@/utils/helpers";

export async function getAllAdmin(req, res) {
    return responseSuccess(res, await adminService.getAllAdmin());
}