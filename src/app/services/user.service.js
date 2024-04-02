import { LINK_STATIC_URL } from "@/configs";
import {Admin as User} from "@/app/models";
import { generatePassword} from "@/utils/helpers";

export async function create({name, email, password, phone}) {
    const user = new User({
        name,
        email,
        phone,
        password: generatePassword(password),
    });
    await user.save();
    return user;
}

export async function filter({q, page, per_page, field, sort_order}) {
    q = q ? {$regex: q, $options: "i"} : null;

    const filter = {
        ...(q && {$or: [{name: q}, {email: q}, {phone: q}]}),
    };

    const users = (
        await User.find(filter, {password: 0})
            .skip((page - 1) * per_page)
            .limit(per_page)
            .sort({[field]: sort_order})
    ).map((user) => {
        if (user.avatar) {
            user.avatar = LINK_STATIC_URL + user.avatar;
        }
        return user;
    });

    const total = await User.countDocuments(filter);
    return {total, page, per_page, users};
}

export async function details(userId) {
    const user = await User.findById(userId, {password: 0});
    user.avatar = LINK_STATIC_URL + user.avatar;
    return user;
}

export async function update(user, {name, email, phone}) {
    user.name = name;
    user.email = email;
    user.phone = phone;
    await user.save();
    return user;
}

export async function resetPassword(user, new_password) {
    user.password = generatePassword(new_password);
    await user.save();
    return user;
}

export async function remove(user) {
    await User.deleteOne({_id: user._id});
}
