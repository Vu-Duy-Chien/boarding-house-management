import adminRouter from "./admin";
import adminManagementRouter from "./admin-management";

export default function route(app) {
    app.use("/admin", adminRouter);
    app.use("/admin-management", adminManagementRouter);
}
