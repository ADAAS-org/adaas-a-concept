"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Errors = void 0;
const A_Namespace_class_1 = require("../../global/A-Namespace/A_Namespace.class");
const a_utils_1 = require("@adaas/a-utils");
const errors_constants_1 = require("@adaas/a-utils/dist/src/constants/errors.constants");
class A_Errors extends A_Namespace_class_1.A_Namespace {
    constructor(params) {
        super(params);
        this.registeredErrors = new Map();
        if (params.errors) {
            this.addRegistry(params.errors);
        }
        this.addRegistry(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS);
    }
    /**
     * This method adds a dictionary of errors to the registry.
     *
     * @param registry
     */
    addRegistry(registry) {
        const errors = Array.isArray(registry) ? registry : Object.values(registry);
        errors.forEach(err => this.registerError(err));
        return this;
    }
    /**
     *
     * Adds an error to the registry
     *
     * @param error
     */
    registerError(error) {
        this.registeredErrors.set(error.code, Object.assign(Object.assign({}, error), { code: `${this.name}@error:${error.code}` }));
        return this;
    }
    /**
     * This method returns an error object by its code.
     *
     * @param code
     * @returns
     */
    getError(code) {
        let template = this.registeredErrors.get(code);
        if (!template)
            template = this.registeredErrors.get(a_utils_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        if (template.serverCode) {
            return new a_utils_1.A_ServerError(template);
        }
        else {
            return new a_utils_1.A_Error(template);
        }
    }
    /**
     * This method throws an error by its code.
     *
     * @param code
     */
    throw(code) {
        const err = this.getError(code);
        throw err;
    }
    /**
     *  This method wraps an error into the SDK error object.
     *
     * @param error
     * @returns
     */
    wrap(error) {
        if (error instanceof a_utils_1.A_Error) {
            return new a_utils_1.A_ServerError(error);
        }
        return new a_utils_1.A_Error(error);
    }
}
exports.A_Errors = A_Errors;
//# sourceMappingURL=A-Errors.namespace.js.map