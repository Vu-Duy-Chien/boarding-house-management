import {BoardingRoom} from "../models";
import moment from "moment";
import {ROOM_STATUS} from "@/configs";

async function checkRoomStatus() {
    const roomsToUpdate = await BoardingRoom.aggregate([
        {$match: {status: ROOM_STATUS.RENTED, deleted: false}},
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
            $sort: {
                "contracts.end_date": -1,
            },
        },
        {
            $group: {
                _id: "$_id",
                room: {$first: "$$ROOT"},
                latestContract: {$first: "$contracts"},
            },
        },
        {
            $project: {
                _id: "$room._id",
                status: "$room.status",
                latestEndDate: "$latestContract.end_date",
            },
        },
        {
            $match: {
                $or: [
                    {latestEndDate: {$lt: moment().startOf("day").toDate()}},
                    {latestEndDate: {$exists: false}},
                ],
            },
        },
    ]);

    const roomIds = roomsToUpdate.map((room) => room._id);

    await BoardingRoom.updateMany({_id: {$in: roomIds}}, {$set: {status: ROOM_STATUS.NOT_RENTED}});
}
export default checkRoomStatus;
