import {ROOM_STATUS} from "@/configs";
import {Bill, BoardingRoom, Contract, ContractService, MeterReading} from "../models";
import _ from "lodash";

export async function create(
    {
        room_number,
        area,
        price,
        maximum,
        floor,
        current_electric_reading,
        current_water_reading,
    },
    house,
) {
    const room = new BoardingRoom({
        house_id: house._id,
        room_number,
        area,
        price,
        status: ROOM_STATUS.NOT_RENTED,
        maximum,
        floor,
        current_electric_reading,
        current_water_reading,
    });
    await room.save();
    return room;
}

export async function update(
    {
        room_number,
        area,
        price,
        maximum,
        floor,
        current_electric_reading,
        current_water_reading,
    },
    room
) {
    room.room_number = room_number;
    room.area = area;
    room.price = price;
    room.maximum = maximum;
    room.floor = floor;
    room.current_electric_reading = current_electric_reading;
    room.current_water_reading = current_water_reading;
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
        ...(q && {$or: [{room_number: q}]}),
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
