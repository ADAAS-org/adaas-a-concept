"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CallerError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_CallerError extends A_Error_class_1.A_Error {
}
exports.A_CallerError = A_CallerError;
/**
 * This error code indicates that there was an issue initializing the A-Caller
 */
A_CallerError.CallerInitializationError = 'Unable to initialize A-Caller';
//# sourceMappingURL=A_Caller.error.js.map