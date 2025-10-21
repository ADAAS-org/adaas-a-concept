"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Caller = void 0;
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Caller_error_1 = require("./A_Caller.error");
/**
 * This is a common class that uses to return an entity that initiates a feature call
 *
 * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
 *
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 *
 */
class A_Caller {
    /**
     * A_Caller allows to get the component that initiated the feature call
     *
     * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
     *
     * [!] If Scope is not provided, a new empty scope will be created and inherited from the global scope
     *
     * @param component
     * @param scope
     */
    constructor(component) {
        this.validateParams(component);
        this._component = component;
    }
    get component() {
        return this._component;
    }
    /**
     * Validates the provided parameters and Ensures that the component is of an allowed type
     *
     * @param component
     */
    validateParams(component) {
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureCall(component)) {
            throw new A_Caller_error_1.A_CallerError(A_Caller_error_1.A_CallerError.CallerInitializationError, `Invalid A-Caller component provided of type: ${typeof component} with value: ${JSON.stringify(component).slice(0, 100)}...`);
        }
    }
}
exports.A_Caller = A_Caller;
//# sourceMappingURL=A_Caller.class.js.map