import {generatePassword} from "@/utils/helpers";
import {Admin} from "../models";

export async function updateProfile(admin, {name, phone}) {
    admin.name = name;
    admin.phone = phone || null;

    return await admin.save();
}

export async function create({name, email, password, phone}) {
    const admin = new Admin({
        name,
        email,
        phone: phone || null,
        password: generatePassword(password)
    });
    await admin.save();
    return admin;
}

export async function updateAdmin(admin, {name, email, phone}) {
    admin.name = name;
    admin.email = email;
    admin.phone = phone || null;
    await admin.save();
    return admin;
}

export async function remove(admin) {
    admin.deleted = true;
    await admin.save();
}

export async function changeStatus(admin, status) {
    admin.status = status;
    await admin.save();
}

export async function changePassword(admin, password) {
    admin.password = generatePassword(password);
    await admin.save();
}

export async function getList({q, page, per_page, field, sort_order}, req) {
    const currentAccount = req.currentAccount;
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    const filter = {
        _id: {$ne: currentAccount._id},
        deleted: false,
        ...(q && {$or: [{name: q}, {email: q}, {phone: q}]}),
    };

    const admins = await Admin.find(filter, {password: 0, deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    const total = await Admin.countDocuments(filter);
    return {total, page, per_page, admins};
}
