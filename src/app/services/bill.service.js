import {BILL_STATUS} from "@/configs";
import {Bill, BoardingHouse, BoardingRoom, ContractService, MeterReading, User} from "../models";
import moment from "moment";
import _ from "lodash";
import XLSX from "xlsx";

export async function getBill(req) {
    const contract = req.contract;
    const room = req.room;

    const bill = await Bill.findOne({
        contract_id: contract._id,
        deleted: false,
        time: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
        },
    });

    const listService = await ContractService.aggregate([
        {
            $match: {
                contract_id: contract._id,
            },
        },
        {
            $lookup: {
                from: "services",
                localField: "service_id",
                foreignField: "_id",
                as: "service",
            },
        },
        {
            $unwind: "$service",
        },
        {
            $addFields: {
                name: "$service.name",
                unit: "$service.unit",
                price: "$service.price",
                amount: {$multiply: ["$service.price", "$quantity"]},
            },
        },
        {
            $project: {
                _id: 0,
                service: 0,
                deleted: 0,
                house_id: 0,
                contract_id: 0,
                service_id: 0,
                updated_at: 0,
            },
        },
    ]);

    let result;

    const house = await BoardingHouse.findOne({_id: room.house_id});

    const electricService = {
        quantity: 0,
        name: "Điện",
        unit: "Số (Kwh)",
        price: house.electricity_unit_price,
        amount: 0,
    };

    const waterService = {
        quantity: 0,
        name: "Nước",
        unit: "Khối (m3)",
        price: house.water_unit_price,
        amount: 0,
    };

    const meterReading = await MeterReading.findOne({
        room_id: room._id,
        time: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
        },
    });

    if (meterReading) {
        const electric = meterReading.current_electric_reading - meterReading.old_electric_reading;
        const water = meterReading.current_water_reading - meterReading.old_water_reading;
        if (house) {
            if (electric) {
                electricService.quantity = electric;
                electricService.amount = electric * house.electricity_unit_price;
            }
            if (water) {
                waterService.quantity = water;
                waterService.amount = water * house.water_unit_price;
            }
        }
    }

    if (bill) {
        listService.push(electricService);
        listService.push(waterService);
        result = {...bill._doc};
        result.contract_code = contract.code;
        result.room_price = room.price;
        result.services = listService;
    } else {
        const service_amount = listService.reduce((total, item) => total + item.price * item.quantity, 0);
        const total_amount = electricService.amount + waterService.amount + service_amount + room.price;

        listService.push(electricService);
        listService.push(waterService);

        result = {
            room_id: room._id,
            room_price: room.price,
            contract_code: contract.code,
            services: listService,
            created_at: moment().toDate(),
            time: moment().startOf("month").toDate(),
            total_amount,
            service_amount,
            electric_amount: electricService.amount,
            water_amount: waterService.amount,
            meter_reading_id: meterReading?._id,
            status: BILL_STATUS.UNPAID,
        };
    }
    return result;
}

export async function createOrUpdateBill(req) {
    const bill = req.bill;
    const room = req.room;
    const {service_amount, electric_amount, water_amount, other_costs} = req.body;
    const total_amount = service_amount + electric_amount + water_amount + other_costs + room.price;
    if (bill) {
        bill.service_amount = service_amount;
        bill.electric_amount = electric_amount;
        bill.water_amount = water_amount;
        bill.other_costs = other_costs;
        bill.total_amount = total_amount;
        await bill.save();
    } else {
        const contract = req.contract;
        const code = "INV" + moment().unix();
        const time = moment().startOf("month").toDate();

        const data = {
            house_id: room.house_id,
            contract_id: contract._id,
            user_id: contract.user_id,
            room_id: room._id,
            code,
            total_amount,
            service_amount,
            electric_amount,
            water_amount,
            other_costs,
            time,
            status: BILL_STATUS.UNPAID,
        };
        const meterReading = await MeterReading.findOne({
            room_id: room._id,
            time: {
                $gte: moment().startOf("month").toDate(),
                $lte: moment().endOf("month").toDate(),
            },
        });
        if (meterReading) {
            data.meter_reading_id = meterReading._id;
        }
        const bill = new Bill(data);
        return await bill.save();
    }
}

export async function getList(req) {
    const house = req.house;
    let {q, field, sort_order, page, per_page} = req.query;

    const {target_month, status} = req.query;

    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    let filter = {
        ...(q && {$or: [{"room.name": q}, {code: q}]}),
    };

    if (target_month) {
        filter = {
            ...filter,
            time: {
                $gte: moment(target_month).startOf("month").toDate(),
                $lte: moment(target_month).endOf("month").toDate(),
            },
        };
    }

    if ([BILL_STATUS.PAID, BILL_STATUS.UNPAID].includes(status)) {
        filter = {
            ...filter,
            status,
        };
    }

    const queryBills = Bill.aggregate();
    queryBills
        .match({
            deleted: false,
            house_id: house._id,
            status: {$ne: BILL_STATUS.CANCEL},
        })
        .lookup({
            from: "boarding_rooms",
            localField: "room_id",
            foreignField: "_id",
            as: "room",
        })
        .unwind("$room")
        .lookup({
            from: "users",
            localField: "user_id",
            foreignField: "_id",
            as: "user",
        })
        .unwind("$user")
        .match(filter)
        .sort({[field]: sort_order, _id: -1})
        .project({deleted: 0})
        .facet({
            metadata: [{$count: "total"}],
            data: [{$skip: (page - 1) * per_page}, {$limit: per_page}],
        });

    const [result] = await queryBills.exec();
    const total = _.isEmpty(result.metadata) ? 0 : result.metadata[0].total;
    const bills = result.data;
    return {total, page, per_page, bills};
}

export async function changeStatus(req) {
    const bill = req.bill;
    const {status} = req.body;
    bill.status = status;
    await bill.save();
    return;
}

export async function exportExcel(bill) {
    const room = await BoardingRoom.findOne({_id: bill.room_id});
    const user = await User.findOne({_id: bill.user_id});
    const data = [
        {
            "Mã hóa đơn": bill.code,
            "Tên phòng trọ": room.name,
            "Người đại diện": user.name,
            "Tháng/năm": moment(bill.time).format("MM/yyyy"),
            "Tiền dịch vụ": bill.service_amount,
            "Tiền điện": bill.electric_amount,
            "Tiền nước": bill.water_amount,
            "Chi phí khác": bill.other_costs,
            "Thành tiền": bill.total_amount,
            "Ngày tạo": moment().format("DD/MM/yyyy"),
        },
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(data);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    const excelBuffer = XLSX.write(workbook, {bookType: "xlsx", type: "buffer"});
    return excelBuffer;
}
