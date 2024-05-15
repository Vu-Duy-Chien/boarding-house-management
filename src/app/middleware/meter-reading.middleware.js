import {responseError} from "@/utils/helpers";
import {MeterReading} from "../models";
import moment from "moment";

export const checkMeterReadingExistInMonth = async function (req, res, next) {
    const room = req.room;
    const startOfMonth = moment().startOf("month").toDate();
    const endOfMonth = moment().endOf("month").toDate();

    const reading = await MeterReading.findOne({
        room_id: room._id,
        time: {
            $gte: startOfMonth,
            $lt: endOfMonth,
        },
        deleted: false,
    });

    if (!reading) {
        return next();
    }

    const currentTime = moment().format("MM/YYYY");

    return responseError(res, 409, `Thông số tháng ${currentTime} đã được tạo trước đó`);
};