import { LINK_STATIC_URL } from "@/configs";
import {Bill, BoardingHouse, BoardingRoom, Contract, ContractService, MeterReading, Service} from "../models";
import { FileUpload } from "@/utils/types";

export async function create({name, address, description, electricity_unit_price, water_unit_price, avatar}) {
    if (avatar) {
        avatar = avatar.save();
    }

    const house = new BoardingHouse({
        name,
        address,
        description,
        electricity_unit_price,
        water_unit_price,
        avatar,
    });
    await house.save();
    return house;
}

export async function update(
    house,
    {name, address, description, electricity_unit_price, water_unit_price, avatar},
) {
    if (avatar) {
        if (house.avatar) {
            FileUpload.remove(house.avatar);
        }
        avatar = avatar.save("images");
        house.avatar = avatar;
    }
    house.name = name;
    house.address = address;
    house.description = description;
    house.electricity_unit_price = electricity_unit_price;
    house.water_unit_price = water_unit_price;
    await house.save();
    return house;
}

export async function remove(house) {
    house.deleted = true;
    const filter = {
        house_id: house._id,
    };
    const update = {
        deleted: true,
    };

    return await Promise.all([
        house.save(),
        BoardingRoom.updateMany(filter, update),
        Service.updateMany(filter, update),
        Contract.updateMany(filter, update),
        Bill.updateMany(filter, update),
        ContractService.updateMany(filter, update),
        MeterReading.updateMany(filter, update),
    ]);
}

export async function getList({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    const filter = {
        deleted: false,
        ...(q && {$or: [{name: q}, {address: q}]}),
    };

    const houses = await BoardingHouse.find(filter, {deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    houses.forEach((house) => {
        if (house.avatar) {
            house.avatar = LINK_STATIC_URL + house.avatar;
        }
    });

    const total = await BoardingHouse.countDocuments(filter);
    return {total, page, per_page, houses};
}
