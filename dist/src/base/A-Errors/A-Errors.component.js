"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ErrorsManager = void 0;
const A_Scope_class_1 = require("../../global/A-Scope/A-Scope.class");
const A_Inject_decorator_1 = require("../../decorators/A-Inject/A-Inject.decorator");
const A_Errors_context_1 = require("./A-Errors.context");
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
let A_ErrorsManager = class A_ErrorsManager extends A_Component_class_1.A_Component {
    constructor(scope, errors) {
        super();
        this.scope = scope;
        this.errors = errors;
    }
    throw(param) {
        switch (true) {
            // In case of error code
            case typeof param === 'string':
                const template = this.errors.get(param);
                const namedCode = `${A_Context_class_1.A_Context.root}@${this.scope.name}:error:${template.code}`;
                if ('serverCode' in template)
                    throw new a_utils_1.A_ServerError(Object.assign(Object.assign({}, template), { code: namedCode }));
                else
                    throw new a_utils_1.A_Error(Object.assign(Object.assign({}, template), { code: namedCode }));
            // In case of error object
            case param instanceof a_utils_1.A_Error:
                throw param;
            // Otherwise wrap the error
            default:
                throw this.wrap(param);
        }
    }
    /**
     *  This method wraps an error into the SDK error object.
     *
     * @param error
     * @returns
     */
    wrap(error) {
        switch (true) {
            case error instanceof a_utils_1.A_Error:
                let newCode = `${A_Context_class_1.A_Context.root}@${this.scope.name}:error:${error.code}`;
                if (a_utils_1.ASEID.isASEID(error.code)) {
                    const aseid = new a_utils_1.ASEID(error.code);
                    if (aseid.scope !== this.scope.name)
                        newCode = `${A_Context_class_1.A_Context.root}@${this.scope.name}:error:${aseid.id}`;
                }
                if ('serverCode' in error)
                    return new a_utils_1.A_ServerError({
                        originalError: error,
                        code: newCode,
                        serverCode: error.serverCode,
                        name: error.name,
                        message: error.message,
                        link: error.link,
                        description: error.description
                    });
                else
                    return new a_utils_1.A_Error({
                        originalError: error,
                        code: newCode,
                        name: error.name,
                        message: error.message,
                        link: error.link,
                        description: error.description
                    });
            default:
                return new a_utils_1.A_Error(error);
        }
    }
};
exports.A_ErrorsManager = A_ErrorsManager;
exports.A_ErrorsManager = A_ErrorsManager = __decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Scope_class_1.A_Scope)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Errors_context_1.A_Errors))
], A_ErrorsManager);
//# sourceMappingURL=A-Errors.component.js.map