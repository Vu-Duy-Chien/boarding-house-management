import {generatePassword} from "@/utils/helpers";
import {Admin} from "@/app/models";
import {PERMISSIONS} from "@/configs";

export default async function () {
    let EMAIL = process.env.SUPER_ADMIN_EMAIL;
    let PASSWORD = process.env.SUPER_ADMIN_PASSWORD;
    if (!EMAIL || !PASSWORD) {
        EMAIL = "admin@gmail.com";
        PASSWORD = "Admin@123";
        console.warn("---------------------------------------------------------------");
        console.warn('"Super Admin" is not configured. Using the default account:');
        console.warn(`Email: ${EMAIL}`);
        console.warn(`Password: ${PASSWORD}`);
        console.warn("---------------------------------------------------------------");
    }
    const superAdmin = {
        name: "Super Admin",
        email: EMAIL,
        password: generatePassword(PASSWORD),
        permissions: [PERMISSIONS.SUPER_ADMIN],
        status: 1,
    };

    await Admin.findOneAndUpdate({email: superAdmin.email}, {$set: superAdmin}, {upsert: true});
}
