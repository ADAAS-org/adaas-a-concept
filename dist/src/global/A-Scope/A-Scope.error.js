"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ScopeError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_ScopeError extends A_Error_class_1.A_Error {
}
exports.A_ScopeError = A_ScopeError;
A_ScopeError.InitializationError = 'A-Scope Initialization Error';
A_ScopeError.ConstructorError = 'Unable to construct A-Scope instance';
A_ScopeError.CircularInheritanceError = 'A-Scope Circular Inheritance Error';
//# sourceMappingURL=A-Scope.error.js.map