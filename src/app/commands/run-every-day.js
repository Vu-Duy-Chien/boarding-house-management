import cron from "node-cron";
import {commandHandler} from "@/utils/handlers";
import checkRoomStatus from "./check-room-status";

async function runEveryDay() {
    await checkRoomStatus(true);
}
// run crone job every day 12 AM
const task = cron.schedule("0 0 0 * * *", commandHandler(runEveryDay), {runOnInit: true});

export default task;
