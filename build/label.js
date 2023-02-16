"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tagAllEmails = exports.checkIfNotCreateLabel = void 0;
const googleapis_1 = require("googleapis");
const newLabelName = 'TESTV2';
const checkIfNotCreateLabel = async (auth) => {
    console.log('checking labels...');
    try {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const res = await gmail.users.labels.list({
            userId: 'me'
        });
        console.log(res.data.labels);
        if (res.data.labels?.filter(e => e.name === newLabelName).length === 0) {
            const re = await gmail.users.labels.create({
                userId: 'me',
                requestBody: {
                    name: newLabelName,
                    labelListVisibility: "labelShow",
                    messageListVisibility: "show",
                }
            });
            return re?.data?.id || 'Label_2';
        }
        else {
            return res.data.labels?.filter(e => e.name === newLabelName)[0]?.id || 'Label_2';
        }
    }
    catch (error) {
        console.log(error);
    }
};
exports.checkIfNotCreateLabel = checkIfNotCreateLabel;
const tagEmailLabel = async (thread, labelId, auth) => {
    try {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const res = await gmail.users.threads.modify({
            userId: 'me',
            id: thread.id,
            requestBody: {
                addLabelIds: [labelId]
            }
        });
        //@ts-ignore
        console.log(res.data.messages[0].labelIds);
    }
    catch (error) {
        console.log(error);
    }
};
const tagAllEmails = async (threads, labelId, auth) => {
    console.log(`tagging Email with ${newLabelName}...`);
    for (let i = 0; i < threads.length; i++) {
        try {
            await tagEmailLabel(threads[i], labelId, auth);
        }
        catch (error) {
            console.log(error);
        }
    }
};
exports.tagAllEmails = tagAllEmails;
