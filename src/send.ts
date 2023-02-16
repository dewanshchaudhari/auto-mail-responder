import { google } from "googleapis";
//sending email using buffer and converting it into base64 string before sending
const sendMail = async (thread: { id: string; to: string; from: string; replyTo: string; }, auth: any) => {
    try {
        const messages = [
            `From: ${thread.from}`,
            `To: ${thread.to}`,
            `In-Reply-To: ${thread.replyTo}`,
            'Content-Type: text/html; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: Re: Automated reply`,
            '',
            '<h1>User is currently enjoying his vacation and would be available in few days</h1>',
            '',
        ];
        const message = messages.join('\n');
        const encodedMessage = Buffer.from(message)
        const gmail = google.gmail({ version: 'v1', auth });
        const res = await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage.toString('base64'),
                threadId: thread.id
            }

        });
    } catch (error) {
        console.log(error);
    }


}
//sending vacation emails to each thread id
export const sendVacationEmail = async (threads: { id: string; to: string; from: string; replyTo: string; }[], auth: any) => {
    console.log('sending message...');
    for (let i = 0; i < threads.length; i++) {
        try {
            await sendMail(threads[i], auth);
        } catch (error) {
            console.log(error)
        }

    }
}