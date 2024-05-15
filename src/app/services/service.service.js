import {ContractService, Service} from "../models";

export async function create(house, data) {
    const service = new Service({
        ...data,
        house_id: house._id,
    });
    await service.save();
    return service;
}

export async function update(service, data) {
    Object.assign(service, data);
    await service.save();
    return service;
}

export async function remove(service) {
    service.deleted = true;
    await service.save();
    return await ContractService.updateMany({deleted: false, service_id: service._id}, {deleted: true});
}

export async function getList({q, page, per_page, field, sort_order}, house) {
    q = q ? {$regex: q, $options: "i"} : null;
    page = page ? parseInt(page) : 1;
    per_page = per_page ? parseInt(per_page) : 20;
    field = field || "created_at";
    sort_order = sort_order ? (sort_order === "asc" ? 1 : -1) : -1;

    const filter = {
        house_id: house._id,
        deleted: false,
        ...(q && {$or: [{name: q}, {description: q}]}),
    };

    const services = await Service.find(filter, {deleted: 0})
        .skip((page - 1) * per_page)
        .limit(per_page)
        .sort({[field]: sort_order});

    const total = await Service.countDocuments(filter);
    return {total, page, per_page, services};
}

export async function getAll(house) {
    return await Service.find({house_id: house._id, deleted: false}, {deleted: 0});
}
