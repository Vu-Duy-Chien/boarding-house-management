import {responseSuccess} from "@/utils/helpers";
import * as roomService from "@/app/services/room.service";

export async function createRoom(req, res) {
    await roomService.create(req.body, req.house);
    return responseSuccess(res, null, 201);
}

export async function updateRoom(req, res) {
    await roomService.update(req.body, req.room);
    return responseSuccess(res, null, 201);
}

export async function removeRoom(req, res) {
    await roomService.remove(req.room);
    return responseSuccess(res);
}

export async function getList(req, res) {
    return responseSuccess(res, await roomService.getList(req.query, req.house));
}

export async function getAllRooms(req, res) {
    return responseSuccess(res, await roomService.getAll(req.house._id, req.query));
}

export async function getRoomsIsUnderContract(req, res){
    return responseSuccess(res, await roomService.getListRoomUnderContract(req.house));
}
