import cors from "cors";
import {APP_URL_CLIENT, OTHER_URLS_CLIENT} from "@/configs";

const origin = [APP_URL_CLIENT, ...OTHER_URLS_CLIENT];

export const corsHandler = cors({
    origin,
    credentials: true,
});
