"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_StageError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_StageError extends A_Error_class_1.A_Error {
    static get CompileError() {
        return 'Unable to compile A-Stage';
    }
}
exports.A_StageError = A_StageError;
//# sourceMappingURL=A-Stage.error.js.map