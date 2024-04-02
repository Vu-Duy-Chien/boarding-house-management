import express from "express";
import helmet from "helmet";
import {APP_DEBUG, NODE_ENV, PUBLIC_DIR, VIEW_DIR} from "./configs";
import {
    corsHandler,
    errorHandler,
    httpRequestHandler,
    notFoundHandler,
    rateLimitHandler,
} from "./utils/handlers";
import route from "./routes";

export function createApp() {
    // Init app
    const app = express();
    app.set("env", NODE_ENV);
    app.set("views", VIEW_DIR);
    app.set("view engine", "ejs");

    app.use(corsHandler);
    if (APP_DEBUG) {
        app.use(httpRequestHandler);
    }
    app.use(rateLimitHandler);
    app.use("/static", express.static(PUBLIC_DIR));
    app.use(helmet());
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));

    // Init routes
    route(app);

    // Not found handler
    app.use(notFoundHandler);

    // Error handler
    app.use(errorHandler);

    return app;
}
