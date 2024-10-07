// import { A_CONSTANTS__ERROR_CODES } from '@adaas/a-concept/constants/errors.constants';
// import { A_ContextClass } from '@adaas/a-concept/global/A-Namespace/A_Namespace.class';
// import { A_Error } from '@adaas/a-concept/global/A_Error.class';
// import { config } from 'dotenv';
// config();
// jest.retryTimes(0);

// describe('Context Tests', () => {

//     it('Should load default context ', async () => {
//         const testContext = new A_ContextClass({
//             namespace: 'test',
//         });

//         await testContext.ready;
//     });


//     it('Should log data ', async () => {
//         const testContext = new A_ContextClass({
//             namespace: 'test',
//         });

//         await testContext.ready;

//         testContext.Logger.log('Test Log');
//     });

//     it('Should throw Error ', async () => {

//         const namespace = 'test-namespace';
//         const testContext = new A_ContextClass({
//             namespace,
//         });

//         await testContext.ready;

//         try {
//             testContext.Errors.throw(A_CONSTANTS__ERROR_CODES.METHOD_NOT_IMPLEMENTED);
//         } catch (error) {
//             testContext.Logger.error(error);

//             expect(error).toBeDefined();
//             expect(error).toBeInstanceOf(A_Error);
//             expect((error as A_Error).code).toBe(
//                 `${namespace}@error:${A_CONSTANTS__ERROR_CODES.METHOD_NOT_IMPLEMENTED}`
//             );
//         }
//     });

//     it('Should log original error ', async () => {

//         const namespace = 'test-error-namespace';
//         const testContext = new A_ContextClass({
//             namespace,
//         });

//         await testContext.ready;
//         try {
//             try {
//                 throw new Error('Test Error');
//             } catch (error) {
//                 throw testContext.Errors.wrap(error);
//             }
//         } catch (error) {
//             testContext.Logger.error(error);


//             expect(error).toBeDefined();
//             expect(error).toBeInstanceOf(A_Error);
//         }
//     });

//     it('Should read allowed configuration property ', async () => {

//         const namespace = 'test-config-read-ok';
//         const testContext = new A_ContextClass({
//             namespace,
//         });

//         const ignoreErrors = testContext.getConfigurationProperty('CONFIG_IGNORE_ERRORS');

//         expect(ignoreErrors).toBe(false);
//     });

//     it('Should fail to read unknown property', async () => {

//         const namespace = 'test-config-read-fail';
//         const testContext = new A_ContextClass({
//             namespace,
//         });

//         try {
//             testContext.getConfigurationProperty('TEST_PROPERTY' as any);
//         } catch (error) {
//             testContext.Logger.error(error);

//             expect(error).toBeDefined();
//             expect(error).toBeInstanceOf(A_Error);
//             expect((error as A_Error).code).toBe(
//                 `${namespace}@error:${A_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ}`
//             );
//         }

//     });

//     it('Should Log data properly', async () => {

//         const namespace = 'test-config-read-fail';
//         const testContext = new A_ContextClass({
//             namespace,
//         });

//         testContext.Logger.log(`
//             Some Suff that should be done`, {
//             test: 'data',
//             test2: {
//                 test: 'data'
//             }
//         });

//     });

// });