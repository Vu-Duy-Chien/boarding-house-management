import {responseSuccess} from "@/utils/helpers";
import * as meterService from "@/app/services/meter-reading.service";

export async function createMeterInMonth(req, res) {
    await meterService.createOrUpdate(req.room, req.body);
    return responseSuccess(res, null, 201);
}

export async function getList(req, res) {
    return responseSuccess(res, await meterService.getList(req.query, req.house));
}
