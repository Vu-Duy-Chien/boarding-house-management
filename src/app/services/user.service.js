import {User} from "@/app/models";
import {LINK_STATIC_URL} from "@/configs";
import {FileUpload} from "@/utils/types";

export async function create({name, email, phone, gender, citizen_no, birthplace, avatar}, house) {
    if (avatar) {
        avatar = avatar.save();
    }
    const user = new User({
        house_id: house._id,
        name,
        email,
        phone,
        gender,
        citizen_no,
        birthplace,
        avatar,
    });
    await user.save();
    return user;
}

export async function update(user, {name, email, phone, gender, citizen_no, birthplace, avatar}) {
    if (avatar) {
        if (user.avatar) {
            FileUpload.remove(user.avatar);
        }
        avatar = avatar.save("images");
        user.avatar = avatar;
    }
    user.name = name;
    user.email = email;
    user.phone = phone;
    user.gender = gender;
    user.citizen_no = citizen_no;
    user.birthplace = birthplace;
    await user.save();
    return user;
}

export async function getList({q, page, per_page, field, sort_order}, house) {
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    const filter = {
        deleted: false,
        house_id: house._id,
        ...(q && {$or: [{name: q}, {email: q}, {phone: q}, {birthplace: q}, {citizen_no: q}]}),
    };

    const users = await User.find(filter, {deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    users.forEach((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
    });

    const total = await User.countDocuments(filter);
    return {total, page, per_page, users};
}

export async function details(userId) {
    const user = await User.findById(userId, {deleted: 0});
    return user;
}

export async function remove(user) {
    user.deleted = true;
    await user.save();
}

export async function getAllUser(house) {
    const users = await User.find({house_id: house._id, deleted: false}, {deleted: 0});
    users.forEach((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
    });
    return users;
}
