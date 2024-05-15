import { BILL_STATUS } from "@/configs";
import Joi from "joi";

export const createOrUpdate = Joi.object({
    service_amount: Joi.number().min(0).required().label("Tổng tiền dịch vụ"),
    electric_amount: Joi.number().min(0).required().label("Tổng tiền điện"),
    water_amount: Joi.number().min(0).required().label("Tổng tiền nước"),
    other_costs: Joi.number().min(0).default(0).label("Chi phí khác"),
});

export const changeStatus = Joi.object({
    status: Joi.number().valid(BILL_STATUS.CANCEL, BILL_STATUS.PAID).required().label("Trạng thái hóa đơn")
});