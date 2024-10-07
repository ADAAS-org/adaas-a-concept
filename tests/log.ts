// import { A_CONSTANTS__DEFAULT_ERRORS } from "@adaas/a-concept/constants/errors.constants";
// import { A_Context } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class"
// import { A_Error } from "@adaas/a-concept/global/A_Error.class";
// import rl from 'readline';


// (async () => {

//     await A_Context.ready;

//     A_Context.configure({
//         verbose: true
//     })

//     A_Context.Logger.log('Test Log', {
//         test: 'test',
//         test2: 'test2',
//         foo: {
//             bar: 'bar',
//             baz: {
//                 qux: 'qux'
//             }
//         }
//     }, 'Maybe its a hige update');

//     A_Context.Logger.error(new Error('Test Error'), new A_Error(A_CONSTANTS__DEFAULT_ERRORS.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ));
//     A_Context.Logger.error(new A_Error(A_CONSTANTS__DEFAULT_ERRORS.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ));
//     A_Context.Logger.log(new A_Error(A_CONSTANTS__DEFAULT_ERRORS.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ));

//     const rlInterface = rl.createInterface({
//         input: process.stdin,
//         output: process.stdout
//     });

//     const answer = await new Promise<string>(resolve => rlInterface
//         .question(
//             A_Context.Logger.compile('pink', 'What is your name?', '(1,2,3,4)').join(' ') + '\n' +
//             A_Context.Logger.compile('pink', 'Answer (1,2,3,4)').join(' '),
//             resolve));

//     rl.moveCursor(process.stdout, 0, -1); // Move cursor to the beginning of the previous line
//     rl.clearLine(process.stdout, 0); // Clear the current line

//     const answer2 = await new Promise<string>(resolve => rlInterface
//         .question(
//             A_Context.Logger.compile('pink', 'Answer (1,2,3,4)').join(' '),
//             resolve));

//     rl.moveCursor(process.stdout, 0, -1); // Move cursor to the beginning of the previous line
//     rl.clearLine(process.stdout, 0); // Clear the current line
//     // console.log('Asnwer: ', answer);


// })()