import authRouter from "./auth";
import adminManagementRouter from "./admin-management";
import houseRouter from "./boarding-house";
import roomRouter from "./boarding-room";
import serviceRouter from "./service";
import userRouter from "./user";
import meterReadingRouter from "./meter-reading";
import adminRouter from "./admin";
import contractRouter from "./contract";
import billRouter from "./bill";

export default function route(app) {
    app.use("/auth", authRouter);
    app.use("/admin-management", adminManagementRouter);
    app.use("/boarding-houses", houseRouter);
    app.use("/boarding-rooms", roomRouter);
    app.use("/services", serviceRouter);
    app.use("/users", userRouter);
    app.use("/meter-reading", meterReadingRouter);
    app.use("/admins", adminRouter);
    app.use("/contracts", contractRouter);
    app.use("/bills", billRouter);
}
