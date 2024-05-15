import {MeterReading} from "../models";
import moment from "moment";

export async function createOrUpdate(room, {current_electric_reading, current_water_reading}) {
    const startOfMonth = moment().startOf("month").toDate();

    let meter = await MeterReading.findOne({room_id: room._id, time: startOfMonth});

    if (!meter) {
        meter = new MeterReading({
            house_id: room.house_id,
            room_id: room._id,
            time: startOfMonth,
            old_electric_reading: room.current_electric_reading,
            old_water_reading: room.current_water_reading,
            current_electric_reading,
            current_water_reading,
        });
    }
    if (meter) {
        meter.current_electric_reading = current_electric_reading;
        meter.current_water_reading = current_water_reading;
    }

    await meter.save();
    room.current_electric_reading = current_electric_reading;
    room.current_water_reading = current_water_reading;
    await room.save();
    return meter;
}

export async function getList({q, page, per_page, field, sort_order, time}, house) {
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    let filter = {
        house_id: house._id,
        deleted: false,
    };

    if (time) {
        filter = {
            ...filter,
            time: moment(time).startOf("month").toDate(),
        };
    }

    const services = await MeterReading.aggregate([
        {$match: filter},
        {
            $lookup: {
                from: "boarding_rooms",
                localField: "room_id",
                foreignField: "_id",
                as: "room",
            },
        },
        {
            $unwind: {
                path: "$room",
            },
        },
        {$match: {...(q && {"room.name": q})}},
        {
            $skip: (page - 1) * per_page,
        },
        {
            $limit: per_page,
        },
        {
            $sort: {[field]: sort_order},
        },
    ])
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    const total = await MeterReading.countDocuments(filter);
    return {total, page, per_page, services};
}
