import * as billService from "@/app/services/bill.service";
import {responseSuccess} from "@/utils/helpers";

export async function getBill(req, res) {
    return responseSuccess(res, await billService.getBill(req));
}

export async function createOrUpdateBill(req, res) {
    return responseSuccess(res, await billService.createOrUpdateBill(req));
}

export async function getListBill(req, res) {
    return responseSuccess(res, await billService.getList(req));
}

export async function changeBillStatus(req, res) {
    return responseSuccess(res, await billService.changeStatus(req));
}

export async function exportBillToExcelFile(req, res) {
    const excelBuffer = await billService.exportExcel(req.bill);
    res.setHeader("Content-Disposition", 'attachment; filename="data.xlsx"');
    res.setHeader("Content-Type", "application/octet-stream");
    return res.send(excelBuffer);
}
