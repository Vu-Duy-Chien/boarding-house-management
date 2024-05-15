import moment from "moment";
import {Contract, ContractService} from "../models";
import {CONTRACT_STATUS, ROOM_STATUS} from "@/configs";

export async function create(req) {
    const room = req.room;
    const user = req.user;
    const admin = req.admin;
    const code = "HD" + moment().unix();
    const {start_date, end_date, services} = req.body;

    const contract = new Contract({
        house_id: room.house_id,
        room_id: room._id,
        user_id: user._id,
        admin_id: admin._id,
        code,
        start_date,
        end_date,
        room_price: room.price,
        deposit_price: room.deposit_price,
    });
    const newContract = await contract.save();

    for (const item of services) {
        const contractService = new ContractService({
            house_id: room.house_id,
            contract_id: newContract._id,
            service_id: item._id,
            quantity: item.quantity,
        });
        await contractService.save();
    }

    room.status = ROOM_STATUS.RENTED;
    await room.save();

    return newContract;
}

export async function update({start_date, end_date, services}, contract) {
    contract.start_date = start_date;
    contract.end_date = end_date;

    await ContractService.deleteMany({contract_id: contract._id});
    for (const item of services) {
        const contractService = new ContractService({
            house_id: contract.house_id,
            contract_id: contract._id,
            service_id: item._id,
            quantity: item.quantity,
        });
        await contractService.save();
    }
    await contract.save();
    return contract;
}

export async function remove(contract) {
    contract.deleted = true;
    await contract.save();
    return await ContractService.deleteMany({contract_id: contract._id});
}

export async function getList({q}, house) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        house_id: house._id,
        deleted: false,
        ...(q && {$or: [{code: q}]}),
    };

    const todayStart = moment().startOf("day").toDate();

    const contracts = await Contract.aggregate([
        {$match: filter},
        {
            $lookup: {
                from: "contract_services",
                localField: "_id",
                foreignField: "contract_id",
                as: "services",
            },
        },
        {
            $lookup: {
                from: "boarding_rooms",
                localField: "room_id",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $addFields: {
                status: {
                    $cond: [
                        {$lt: [todayStart, "$start_date"]},
                        CONTRACT_STATUS.PENDING,
                        {
                            $cond: [
                                {
                                    $and: [
                                        {$gte: [todayStart, "$start_date"]},
                                        {$lt: [todayStart, "$end_date"]},
                                    ],
                                },
                                CONTRACT_STATUS.ACTIVE,
                                CONTRACT_STATUS.EXPIRED,
                            ],
                        },
                    ],
                },
                services: {
                    $map: {
                        input: "$services",
                        as: "service",
                        in: {
                            _id: "$$service.service_id",
                            quantity: "$$service.quantity"
                        }
                    }
                },
                room: {$arrayElemAt: ["$room", 0]}
            },
        },
    ]);
    return contracts;
}
