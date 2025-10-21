"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ContextError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_ContextError extends A_Error_class_1.A_Error {
}
exports.A_ContextError = A_ContextError;
A_ContextError.NotAllowedForScopeAllocationError = 'Component is not allowed for scope allocation';
A_ContextError.ComponentAlreadyHasScopeAllocatedError = 'Component already has scope allocated';
A_ContextError.InvalidMetaParameterError = 'Invalid parameter provided to get meta';
A_ContextError.InvalidScopeParameterError = 'Invalid parameter provided to get scope';
A_ContextError.ScopeNotFoundError = 'Scope not found';
A_ContextError.InvalidFeatureParameterError = 'Invalid parameter provided to get feature';
A_ContextError.InvalidFeatureDefinitionParameterError = 'Invalid parameter provided to define feature';
A_ContextError.InvalidFeatureTemplateParameterError = 'Invalid parameter provided to get feature template';
A_ContextError.InvalidFeatureExtensionParameterError = 'Invalid parameter provided to extend feature';
A_ContextError.InvalidAbstractionParameterError = 'Invalid parameter provided to get abstraction';
A_ContextError.InvalidAbstractionDefinitionParameterError = 'Invalid parameter provided to define abstraction';
A_ContextError.InvalidAbstractionTemplateParameterError = 'Invalid parameter provided to get abstraction template';
A_ContextError.InvalidAbstractionExtensionParameterError = 'Invalid parameter provided to extend abstraction';
A_ContextError.InvalidInjectionParameterError = 'Invalid parameter provided to get injections';
A_ContextError.InvalidExtensionParameterError = 'Invalid parameter provided to get extensions';
A_ContextError.InvalidRegisterParameterError = 'Invalid parameter provided to register component';
A_ContextError.InvalidComponentParameterError = 'Invalid component provided';
//# sourceMappingURL=A-Context.error.js.map