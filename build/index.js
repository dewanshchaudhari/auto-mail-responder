"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const authorize_1 = require("./authorize");
const utils_1 = require("./utils");
const send_1 = require("./send");
const label_1 = require("./label");
const main = () => {
    setInterval(async () => {
        try {
            const auth = await (0, authorize_1.authorize)();
            const threads = await (0, utils_1.allThreadsWithSingleMessage)(auth);
            await (0, send_1.sendVacationEmail)(threads, auth);
            const labelId = await (0, label_1.checkIfNotCreateLabel)(auth);
            await (0, label_1.tagAllEmails)(threads, labelId, auth);
        }
        catch (error) {
            console.log(error);
        }
    }, Math.floor(Math.random() * (120000 - 45000 + 1) + 45000));
};
main();
