import { authorize } from './authorize';
import { allThreadsWithSingleMessage } from './utils';
import { sendVacationEmail } from './send';
import { checkIfNotCreateLabel, tagAllEmails } from './label';

const main = () => {
    setInterval(async () => {
        try {
            const auth = await authorize();
            const threads = await allThreadsWithSingleMessage(auth);
            await sendVacationEmail(threads, auth);
            const labelId = await checkIfNotCreateLabel(auth);
            await tagAllEmails(threads, labelId, auth);
        } catch (error) {
            console.log(error);
        }
        //function runs every 45-120 miliseconds
    }, Math.floor(Math.random() * (120000 - 45000 + 1) + 45000));
}

main();


