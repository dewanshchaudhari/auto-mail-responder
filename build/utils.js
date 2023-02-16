"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.allThreadsWithSingleMessage = exports.listLabels = void 0;
const googleapis_1 = require("googleapis");
const listLabels = async (auth) => {
    try {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const res = await gmail.users.labels.list({
            userId: 'me',
        });
        const labels = res.data.labels;
        if (!labels || labels.length === 0) {
            console.log('No labels found.');
            return;
        }
        console.log('Labels:');
        labels.forEach((label) => {
            console.log(`- ${label.name}`);
        });
    }
    catch (error) {
        console.log(error);
    }
};
exports.listLabels = listLabels;
const getThreads = async (id, auth) => {
    try {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const thread = await gmail.users.threads.get({
            userId: 'me',
            id: id,
        });
        if (thread.data.id && thread.data.messages?.length === 1 && thread.data.messages[0].labelIds?.includes('INBOX')) {
            // console.log(thread.data.messages[0].payload?.headers)
            const threadDetails = {
                id: thread.data.id,
                to: thread.data.messages[0].payload?.headers?.find(e => e.name === 'From')?.value || thread.data.messages[0].payload?.headers?.find(e => e.name === 'Reply-To')?.value || '',
                from: thread.data.messages[0].payload?.headers?.find(e => e.name === 'To')?.value || '',
                replyTo: thread.data.messages[0].payload?.headers?.find(e => e.name === 'Reply-To')?.value || thread.data.messages[0].payload?.headers?.find(e => e.name === 'From')?.value || '',
            };
            return threadDetails;
        }
        else
            return false;
    }
    catch (error) {
        console.log(error);
    }
};
const allThreadsWithSingleMessage = async (auth) => {
    console.log('checking threads which contains only one message...');
    const threadIds = [];
    try {
        const gmail = googleapis_1.google.gmail({ version: 'v1', auth });
        const res = await gmail.users.threads.list({
            userId: 'me',
            q: 'INBOX'
        });
        if (res.data.threads)
            for (let i = 0; i < res.data.threads?.length; i++) {
                const isSingleThread = await getThreads(res.data.threads[i]?.id, auth);
                if (isSingleThread)
                    threadIds.push(isSingleThread);
                if (threadIds.length === 1)
                    return threadIds;
            }
    }
    catch (error) {
        console.log(error);
    }
    return threadIds;
};
exports.allThreadsWithSingleMessage = allThreadsWithSingleMessage;
