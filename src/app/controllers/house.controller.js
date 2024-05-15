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

export async function getDetail(req, res) {
    return responseSuccess(res, req.house);
}

export async function updateElectricityWater(req, res) {
    await houseService.editElectricityWater(req.house, req.body);
    return responseSuccess(res, null, 201);
}

export async function getElectricityWaterPrice(req, res) {
    const result = {
        electricity_unit_price: req.house.electricity_unit_price,
        water_unit_price: req.house.water_unit_price,
    };
    return responseSuccess(res, result);
}
