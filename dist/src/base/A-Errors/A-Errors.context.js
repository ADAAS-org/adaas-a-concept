"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Errors = void 0;
const a_utils_1 = require("@adaas/a-utils");
const errors_constants_1 = require("@adaas/a-utils/dist/src/constants/errors.constants");
const A_Fragment_class_1 = require("../../global/A-Fragment/A-Fragment.class");
class A_Errors extends A_Fragment_class_1.A_Fragment {
    constructor(params) {
        super(Object.assign(Object.assign({}, params), { name: params.name || 'a-errors' }));
        this.registeredErrors = new Map();
        this.addRegistry(errors_constants_1.A_CONSTANTS__DEFAULT_ERRORS);
        if (params.errors) {
            this.addRegistry(params.errors);
        }
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
        this.registeredErrors.set(error.code, error);
        return this;
    }
    /**
     * This method returns an error object by its code.
     *
     * @param code
     * @returns
     */
    get(code) {
        let template = this.registeredErrors.get(code);
        if (!template)
            template = this.registeredErrors.get(a_utils_1.A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR);
        return template;
    }
}
exports.A_Errors = A_Errors;
//# sourceMappingURL=A-Errors.context.js.map