"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CommandContext = void 0;
const A_Fragment_class_1 = require("../../A-Fragment/A-Fragment.class");
class A_CommandContext extends A_Fragment_class_1.A_Fragment {
    /**
     * ExecutionContext for the A-Command
     *
     */
    constructor(initialValues = {}) {
        super();
        this._memory = new Map(Object.entries(initialValues));
        this._errors = new Set();
    }
    get Errors() {
        return this._errors.size > 0 ? this._errors : undefined;
    }
    /**
     * Verifies that all required keys are present in the proxy values
     *
     * @param requiredKeys
     * @returns
     */
    verifyPrerequisites(requiredKeys) {
        return requiredKeys.every(key => this._memory.has(key));
    }
    /**
     * Adds an error to the context
     *
     * @param error
     */
    error(error) {
        this._errors.add(error);
    }
    /**
     * Saves a value in the context memory
     *
     * @param key
     * @param value
     */
    save(
    /**
     * Key to save the value under
     */
    key, 
    /**
     * Value to save
     */
    value) {
        this._memory.set(key, value);
    }
    /**
     * Removes a value from the context memory by key
     *
     * @param key
     */
    drop(key) {
        this._memory.delete(key);
    }
    /**
     * Clears all stored values in the context memory
     */
    clear() {
        this._memory.clear();
    }
    /**
     * Converts all stored values to a plain object
     *
     * [!] By default uses all saved in memory values
     *
     * @returns
     */
    toJSON() {
        const obj = {};
        this._memory.forEach((value, key) => {
            obj[key] =
                typeof value === 'object' && value !== null && 'toJSON' in value && typeof value.toJSON === 'function'
                    ? value.toJSON()
                    : value;
        });
        return obj;
    }
}
exports.A_CommandContext = A_CommandContext;
//# sourceMappingURL=A_Command.context.js.map