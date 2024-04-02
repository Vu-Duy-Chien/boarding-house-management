import {spawn} from "child_process";
import {createApp} from ".";
import {db} from "./configs";
import commands from "./app/commands";

const host = process.env.HOST || "localhost";
const port = parseInt(process.env.PORT, 10) || 3456;

const app = createApp();

db.connect();

// Run Server
const server = app.listen(port, host, function () {
    console.log(`Server is running on http://${host}:${port} in ${app.settings.env} mode.`);
});

// Cron job
commands();

// Eslint
if (process.env.__ESLINT__ === "true") {
    const command = "npm";
    const args = ["run", "lint", "--silent"];
    const options = {stdio: "inherit", shell: true};
    const eslintProcess = spawn(command, args, options);

    eslintProcess.on("close", function (code) {
        if (code !== 0) {
            console.log("Server is gracefully shutting down...");
            server.close(function () {
                console.log("Server has been closed. Goodbye!");
                process.exit(code);
            });
        }
    });
}
