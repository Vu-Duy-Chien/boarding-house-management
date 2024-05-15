import Joi from "joi";
import {User} from "@/app/models";
import {GENDER_TYPE, MAX_STRING_SIZE, VALIDATE_PHONE_REGEX} from "@/configs";
import {AsyncValidate, FileUpload} from "@/utils/types";
import {validateName} from "@/utils/helpers/name.helper";

export const createUser = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .required()
        .label("Ảnh đại diện"),
    email: Joi.string()
        .trim()
        .max(MAX_STRING_SIZE)
        .required()
        .lowercase()
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    const user = await User.findOne({email: value, deleted: false});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .required()
        .pattern(VALIDATE_PHONE_REGEX)
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    if (value) {
                        const user = await User.findOne({phone: value, deleted: false});
                        return !user ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
    gender: Joi.number().valid(GENDER_TYPE.FEMALE, GENDER_TYPE.MALE).required().label("Giới tính"),
    citizen_no: Joi.string()
        .required()
        .label("Số căn cước công dân")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function () {
                    if (value) {
                        const user = await User.findOne({citizen_no: value, deleted: false});
                        return !user ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
    birthplace: Joi.string().trim().required().label("Quê quán"),
});

export const updateUser = Joi.object({
    name: Joi.string().trim().max(MAX_STRING_SIZE).custom(validateName).required().label("Họ tên"),
    avatar: Joi.object({
        originalname: Joi.string().trim().required().label("Tên ảnh"),
        mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
            .required()
            .label("Định dạng ảnh"),
        buffer: Joi.binary().label("Ảnh đại diện"),
    })
        .instance(FileUpload)
        .label("Ảnh đại diện"),
    email: Joi.string()
        .trim()
        .required()
        .max(MAX_STRING_SIZE)
        .lowercase()
        .email()
        .label("Email")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    const userId = req.user._id;
                    const user = await User.findOne({email: value, deleted: false, _id: {$ne: userId}});
                    return !user ? value : helpers.error("any.exists");
                }),
        ),
    phone: Joi.string()
        .required()
        .pattern(VALIDATE_PHONE_REGEX)
        .label("Số điện thoại")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    if (value) {
                        const userId = req.user._id;
                        const user = await User.findOne({phone: value, deleted: false, _id: {$ne: userId}});
                        return !user ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
    gender: Joi.number().valid(GENDER_TYPE.FEMALE, GENDER_TYPE.MALE).required().label("Giới tính"),
    citizen_no: Joi.string()
        .required()
        .label("Số căn cước công dân")
        .custom(
            (value, helpers) =>
                new AsyncValidate(value, async function (req) {
                    if (value) {
                        const userId = req.user._id;
                        const user = await User.findOne({
                            citizen_no: value,
                            deleted: false,
                            _id: {$ne: userId},
                        });
                        return !user ? value : helpers.error("any.exists");
                    }
                    return value;
                }),
        ),
    birthplace: Joi.string().trim().required().label("Quê quán"),
});
