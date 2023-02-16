"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = void 0;
const googleapis_1 = require("googleapis");
const sendMail = async (auth) => {
    const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
    gmail.users.messages.send({
        userId: 'me',
    });
};
exports.sendMail = sendMail;
