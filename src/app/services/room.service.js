import {ROOM_STATUS} from "@/configs";
import {Bill, BoardingRoom, Contract, ContractService, MeterReading} from "../models";
import _ from "lodash";

export async function create(data, house) {
    const room = new BoardingRoom({
        ...data,
        house_id: house._id,
        status: ROOM_STATUS.NOT_RENTED,
    });
    await room.save();
    return room;
}

export async function update(data, room) {
    Object.assign(room, data);
    await room.save();
    return room;
}

export async function remove(room) {
    room.deleted = true;
    const filter = {
        room_id: room._id,
    };
    const update = {
        deleted: true,
    };
    const listContract = await Contract.find(filter, "id");
    let billPromises = [];
    let contractServicePromises = [];
    if (!_.isEmpty(listContract)) {
        billPromises = listContract.map((item) => Bill.updateOne({contract_id: item._id}, {deleted: true}));
        contractServicePromises = listContract.map((item) =>
            ContractService.updateOne({contract_id: item._id}, {deleted: true}),
        );
    }

    return await Promise.all([
        room.save(),
        Contract.updateMany(filter, update),
        MeterReading.updateMany(filter, update),
        ...billPromises,
        ...contractServicePromises,
    ]);
}

export async function getList({q, page, per_page, field, sort_order, status, floor}, house) {
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    let filter = {
        house_id: house._id,
        deleted: false,
        ...(q && {$or: [{name: q}]}),
    };

    if (Object.values(ROOM_STATUS).includes(Number(status))) {
        filter = {...filter, status: Number(status)};
    }
    if (floor) {
        filter = {...filter, floor: Number(floor)};
    }

    const rooms = await BoardingRoom.find(filter, {deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    const total = await BoardingRoom.countDocuments(filter);
    return {total, page, per_page, rooms};
}

export async function getAll(houseId, {status}) {
    let filter = {house_id: houseId, deleted: false};

    if (Object.values(ROOM_STATUS).includes(parseInt(status))) {
        filter = {...filter, status: {$ne: parseInt(status)}};
    }

    const rooms = await BoardingRoom.find(filter, {deleted: 0});
    return rooms;
}

export async function getListRoomUnderContract(house) {
    const currentDate = new Date();

    const rooms = await BoardingRoom.aggregate([
        {
            $match: {
                house_id: house._id,
                deleted: false,
            },
        },
        {
            $lookup: {
                from: "contracts",
                localField: "_id",
                foreignField: "room_id",
                as: "contracts",
            },
        },
        {
            $unwind: "$contracts",
        },
        {
            $match: {
                "contracts.deleted": false,
                "contracts.start_date": {$lte: currentDate},
                "contracts.end_date": {$gte: currentDate},
            },
        },
        {
            $group: {
                _id: "$_id",
                house_id: {$first: "$house_id"},
                name: {$first: "$name"},
                status: {$first: "$status"},
            },
        }
    ]);

    return rooms;
}
