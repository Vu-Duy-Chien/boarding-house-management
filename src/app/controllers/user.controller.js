import {responseSuccess} from "@/utils/helpers";
import * as userService from "@/app/services/user.service";

export async function createUser(req, res) {
    await userService.create(req.body, req.house);
    return responseSuccess(res, null, 201);
}

export async function updateUser(req, res) {
    await userService.update(req.user, req.body);
    return responseSuccess(res, null, 201);
}

export async function removeUser(req, res) {
    await userService.remove(req.user);
    return responseSuccess(res);
}

export async function getListUser(req, res) {
    return responseSuccess(res, await userService.getList(req.query, req.house));
}

export async function getAllUser(req, res) {
    return responseSuccess(res, await userService.getAllUser(req.house));
}