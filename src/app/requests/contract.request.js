import {AsyncValidate} from "@/utils/types";
import Joi from "joi";
import {Admin, BoardingRoom, Service, User} from "../models";
import {isValidObjectId} from "mongoose";
import {ADMIN_STATUS, ROOM_STATUS} from "@/configs";
import moment from "moment";

export const create = Joi.object({
    room_id: Joi.string()
        .required()
        .label("Phòng trọ")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    if (isValidObjectId(value)) {
                        const room = await BoardingRoom.findOne({
                            _id: value,
                            deleted: false,
                        });

                        if(room && room.status === ROOM_STATUS.RENTED){
                            return helpers.message("Phòng trọ đã có hợp đồng.");
                        }

                        if (room) {
                            req.room = room;
                            return value;
                        }
                    }

                    return helpers.error("any.not-exists");
                }),
        ),
    user_id: Joi.string()
        .required()
        .label("Người đại diện")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    const room = req.room;

                    if (isValidObjectId(value)) {
                        const filter = {
                            _id: value,
                            deleted: false,
                        };
                        if (room?.house_id) {
                            filter.house_id = room.house_id;
                        }
                        const user = await User.findOne(filter);
                        if (user) {
                            req.user = user;
                            return value;
                        }
                    }

                    return helpers.error("any.not-exists");
                }),
        ),
    admin_id: Joi.string()
        .required()
        .label("Chủ đại diện")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async (req) => {
                    if (isValidObjectId(value)) {
                        const admin = await Admin.findOne({
                            _id: value,
                            deleted: false,
                            status: ADMIN_STATUS.UNLOCK,
                        });
                        if (admin) {
                            req.admin = admin;
                            return value;
                        }
                    }

                    return helpers.error("any.not-exists");
                }),
        ),
    start_date: Joi.date()
        .iso()
        .required()
        .label("Ngày bắt đầu")
        .custom((value, helpers) => {
            if (moment(value).startOf("day") < moment().startOf("day")) {
                return helpers.message("Ngày bắt đầu không thể nhỏ hơn thời gian hiện tại");
            }
            return value;
        }),
    end_date: Joi.date()
        .iso()
        .required()
        .label("Ngày hết hạn")
        .custom((value, helpers) => {
            const start_date = moment(helpers.state.ancestors[0].start_date).startOf("day");
            if (moment(value).startOf("day") <= start_date) {
                return helpers.message("Ngày hết hạn không thể nhỏ hơn hoặc bằng ngày bắt đầu");
            }
            return value;
        }),
    services: Joi.array()
        .default([])
        .label("Dịch vụ")
        .items({
            _id: Joi.string()
                .required()
                .label("Mã dịch vụ")
                .custom(
                    (value, helpers) =>
                        new AsyncValidate(value, async function () {
                            if (isValidObjectId(value)) {
                                const service = await Service.findOne({
                                    _id: value,
                                    deleted: false,
                                });
                                if (service) {
                                    return value;
                                }
                            }

                            return helpers.error("any.not-exists");
                        }),
                ),
            quantity: Joi.number().required().min(1).label("Số lượng"),
        }),
});

export const update = Joi.object({
    start_date: Joi.date()
        .iso()
        .required()
        .label("Ngày bắt đầu")
        .custom((value, helpers) => {
            if (moment(value).startOf("day") < moment().startOf("day")) {
                return helpers.message("Ngày bắt đầu không thể nhỏ hơn thời gian hiện tại");
            }
            return value;
        }),
    end_date: Joi.date()
        .iso()
        .required()
        .label("Ngày hết hạn")
        .custom((value, helpers) => {
            const start_date = moment(helpers.state.ancestors[0].start_date).startOf("day");
            if (moment(value).startOf("day") < start_date) {
                return helpers.message("Ngày hết hạn không thể nhỏ hơn ngày bắt đầu");
            }
            return value;
        }),
    services: Joi.array()
        .default([])
        .label("Dịch vụ")
        .items({
            _id: Joi.string()
                .required()
                .label("Mã dịch vụ")
                .custom(
                    (value, helpers) =>
                        new AsyncValidate(value, async function () {
                            if (isValidObjectId(value)) {
                                const service = await Service.findOne({
                                    _id: value,
                                    deleted: false,
                                });
                                if (service) {
                                    return value;
                                }
                            }

                            return helpers.error("any.not-exists");
                        }),
                ),
            quantity: Joi.number().required().min(1).label("Số lượng"),
        }),
});
