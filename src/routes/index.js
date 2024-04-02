import authRouter from "./auth";
import adminManagementRouter from "./admin-management";

export default function route(app) {
    app.use("/auth", authRouter);
    app.use("/admin-management", adminManagementRouter);
}
