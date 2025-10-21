"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_InjectError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_InjectError extends A_Error_class_1.A_Error {
}
exports.A_InjectError = A_InjectError;
A_InjectError.InvalidInjectionTarget = 'Invalid target for A-Inject decorator';
A_InjectError.MissingInjectionTarget = 'Missing target for A-Inject decorator';
//# sourceMappingURL=A-Inject.error.js.map