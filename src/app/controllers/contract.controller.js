import {responseSuccess} from "@/utils/helpers";
import * as contractService from "@/app/services/contract.service";

export async function createContract(req, res) {
    await contractService.create(req);
    return responseSuccess(res, null, 201);
}

export async function updateContract(req, res) {
    await contractService.update(req.body, req.contract);
    return responseSuccess(res, null, 201);
}

export async function removeContract(req, res) {
    await contractService.remove(req.contract);
    return responseSuccess(res);
}

export async function getList(req, res) {
    return responseSuccess(res, await contractService.getList(req.query, req.house));
}
