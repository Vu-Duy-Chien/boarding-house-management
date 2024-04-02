import moment from "moment";
import jwt from "jsonwebtoken";
import {Admin} from "../models";
import {cache, JWT_EXPIRES_IN, TOKEN_TYPE} from "@/configs";
import {FileUpload} from "@/utils/types";
import {comparePassword, generatePassword, generateToken} from "@/utils/helpers";
import {capitalizeName} from "@/utils/helpers/name.helper";

export const tokenBlocklist = cache.create("token-block-list");
export const activateOTPlist = cache.create("activate-OTP-code-list");
export const forgotPasswordOTPlist = cache.create("forgot-password-OTP-code-list");
export const userChangePasswordList = cache.create("user-change-password-list");

export async function checkValidUserLogin({password}, user) {
    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            user.account_type = 1;
            return user;
        }
    }

    return false;
}

export async function checkValidAdminLogin({email, password}) {
    const admin = await Admin.findOne({
        email,
        deleted: false,
        status: 1,
    });

    if (admin) {
        const verified = comparePassword(password, admin.password);
        if (verified) {
            admin.account_type = 1;
            return admin;
        }
    }

    return false;
}

export function authToken(account_id, account_type) {
    const access_token = generateToken(TOKEN_TYPE.AUTHORIZATION, {account_id, account_type}, JWT_EXPIRES_IN);
    const decode = jwt.decode(access_token);
    const expire_in = decode.exp - decode.iat;
    return {
        access_token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function register({name, email, password, phone}) {
    const user = new Admin({
        name,
        email,
        password: generatePassword(password),
        phone,
        point: 50,
        confirmed: false,
        status: 1,
    });
    return await user.save();
}

export async function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    await tokenBlocklist.set(token, 1, expiresIn - now);
}

export async function profile(account) {
    const result = await Admin.aggregate([
        {
            $match: {_id: account._id, deleted: false},
        },
        {
            $lookup: {
                from: "roles",
                localField: "role_ids",
                foreignField: "_id",
                as: "permissions",
            },
        },
        {
            $addFields: {
                permissions: "$permissions.name",
            },
        },
        {
            $project: {
                password: 0,
                deleted: 0,
                role_ids: 0,
            },
        },
    ]);
    return result;
}

export async function updateProfile(currentUser, {name, email, phone, avatar}) {
    currentUser.name = name;
    currentUser.email = email;
    currentUser.phone = phone;
    if (avatar) {
        if (currentUser.avatar) {
            FileUpload.remove(currentUser.avatar);
        }
        avatar = avatar.save("images");
        currentUser.avatar = avatar;
    }

    return await currentUser.save();
}

export async function updateInfo(currentUser, {name, email}) {
    currentUser.name = capitalizeName(name);
    currentUser.email = email;

    return await currentUser.save();
}
export async function resetPassword(account, new_password) {
    account.password = generatePassword(new_password);
    await account.save();
    return account;
}

export async function activate(user) {
    user.confirmed = true;
    return await user.save();
}
