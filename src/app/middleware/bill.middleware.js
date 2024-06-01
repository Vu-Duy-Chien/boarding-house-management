import {responseError} from "@/utils/helpers";
import moment from "moment";
import {Bill} from "../models";
import {BILL_STATUS} from "@/configs";
import {isValidObjectId} from "mongoose";

export const checkBillByContract = async function (req, res, next) {
    const contract = req.contract;
    const bill = await Bill.findOne({
        contract_id: contract._id,
        deleted: false,
        time: {
            $gte: moment().startOf("month").toDate(),
            $lte: moment().endOf("month").toDate(),
        },
        status: {$ne: BILL_STATUS.CANCEL},
    });
    if (!bill) {
        return next();
    } else {
        if (bill.status === BILL_STATUS.PAID) {
            return responseError(res, 404, "Hóa đơn tháng này đã được thanh toán.");
        }
        req.bill = bill;
        return next();
    }
};

export const checkBillIdForChangeStatus = async function (req, res, next) {
    const _id = req.params.billId;

    if (isValidObjectId(_id)) {
        const bill = await Bill.findOne({_id, deleted: false});
        if (bill && [BILL_STATUS.CANCEL, BILL_STATUS.PAID].includes(bill.status)) {
            return responseError(res, 400, "Hóa đơn đã chuyển trạng thái không thể sửa lại.");
        }
        if (bill && bill.status === BILL_STATUS.UNPAID) {
            req.bill = bill;
            return next();
        }
    }

    return responseError(res, 404, "Hóa đơn không tồn tại hoặc đã bị xóa.");
};

export const checkBillIdForExportExcel = async function (req, res, next) {
    const _id = req.params.billId;

    if (isValidObjectId(_id)) {
        const bill = await Bill.findOne({_id, deleted: false});
        if (bill?.status === BILL_STATUS.CANCEL) {
            return responseError(res, 400, "Hóa đơn đã bị hủy không thể xuất file excel.");
        }
        if (bill && [BILL_STATUS.PAID, BILL_STATUS.UNPAID].includes(bill?.status)) {
            req.bill = bill;
            return next();
        }
    }

    return responseError(res, 404, "Hóa đơn không tồn tại hoặc đã bị xóa.");
};
