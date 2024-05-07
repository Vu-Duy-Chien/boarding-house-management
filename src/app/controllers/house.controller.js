import {responseSuccess} from "@/utils/helpers";
import * as houseService from "@/app/services/house.service";

export async function createHouse(req, res) {
    await houseService.create(req.body);
    return responseSuccess(res, null, 201);
}

export async function updateHouse(req, res) {
    await houseService.update(req.house, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeHouse(req, res) {
    await houseService.remove(req.house);
    return responseSuccess(res);
}

export async function getList(req, res) {
    return responseSuccess(res, await houseService.getList(req.query));
}
