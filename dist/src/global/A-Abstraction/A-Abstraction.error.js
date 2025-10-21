"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_AbstractionError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_AbstractionError extends A_Error_class_1.A_Error {
}
exports.A_AbstractionError = A_AbstractionError;
/**
 * This error code indicates that there was an issue extending the abstraction execution
 */
A_AbstractionError.AbstractionExtensionError = 'Unable to extend abstraction execution';
//# sourceMappingURL=A-Abstraction.error.js.map