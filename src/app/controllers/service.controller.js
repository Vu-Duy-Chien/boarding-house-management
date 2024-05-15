import {responseSuccess} from "@/utils/helpers";
import * as serviceService from "@/app/services/service.service";

export async function createService(req, res) {
    await serviceService.create(req.house, req.body);
    return responseSuccess(res, null, 201);
}

export async function updateService(req, res) {
    await serviceService.update(req.service, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeService(req, res) {
    await serviceService.remove(req.service);
    return responseSuccess(res);
}

export async function getList(req, res) {
    return responseSuccess(res, await serviceService.getList(req.query, req.house));
}

export async function getAllService(req, res) {
    return responseSuccess(res, await serviceService.getAll(req.house));
}
