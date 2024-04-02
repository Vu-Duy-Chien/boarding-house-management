import {connect as connectToMongodb} from "mongoose";
import {logger} from "./logger";
import {DATABASE_URI, DB_NAME, DB_PASSWORD, DB_USERNAME} from "./constants";
import {normalizeError} from "@/utils/helpers";

class MongoDB {
    constructor() {
        this.dbName = DB_NAME;
        this.user = DB_USERNAME;
        this.pass = DB_PASSWORD;
        this.autoCreate = true;
        this.autoIndex = true;
        this.connectTimeoutMS = 5000;
        this.socketTimeoutMS = 5000;
        this.authSource = "admin";
    }
    async connect() {
        try {
            await connectToMongodb(DATABASE_URI, this);
            console.info("Database connection successful.");
        } catch (error) {
            console.error("Failed to connect to the database.");
            logger.error({
                message: "Error connecting to database",
                error: normalizeError(error),
            });
        }
    }
}

export const db = new MongoDB();
