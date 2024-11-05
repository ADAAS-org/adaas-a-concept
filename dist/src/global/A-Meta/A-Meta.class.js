"use strict";
// 
// 
// 
// 
// 
// 
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Meta = void 0;
/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc.
 *
 * [!] Meta can be different depending on the type of input data
 */
class A_Meta {
    constructor() {
        this.meta = new Map();
    }
    /**
     * Method to get the iterator for the meta object
     *
     * @returns
     */
    [Symbol.iterator]() {
        const iterator = this.meta.entries();
        return {
            next: () => iterator.next()
        };
    }
    // ===================================================================================================
    // ================================ META OPERATIONS ==================================================
    // ===================================================================================================
    /**
     * Allows to replicate received meta object by replacing internal meta to the received one
     *
     * @param meta
     * @returns
     */
    from(meta) {
        this.meta = new Map(meta.meta);
        return this;
    }
    /**
     * Method to set values in the map
     *
     * @param key
     * @param value
     */
    set(key, value) {
        const inheritedValue = this.meta.get(key)
            || Array.isArray(value)
            ? []
            : value instanceof Map
                ? new Map()
                : {};
        const targetValue = this.meta.get(key)
            || Array.isArray(value)
            ? [
                ...inheritedValue
            ] : value instanceof Map
            ? new Map(inheritedValue)
            : Object.assign({}, inheritedValue);
        this.meta.set(key, value);
    }
    /**
     * Method to get values from the map
     *
     * @param key
     * @returns
     */
    get(key) {
        return this.meta.get(key);
    }
    /**
     * Method to delete values from the map
     *
     * @param key
     * @returns
     */
    delete(key) {
        return this.meta.delete(key);
    }
    /**
     * This method is needed to convert the key to a regular expression and cover cases like:
     *
     * simple * e.g. "a*" instead of "a.*"
     *
     * simple ? e.g. "a?" instead of "a."
     *
     * etc.
     *
     * @param key
     * @returns
     */
    convertToRegExp(key) {
        return key instanceof RegExp
            ? key
            : new RegExp(key);
    }
    /**
     * Method to find values in the map by name.
     *
     * Converts the Key in Map to a regular expression and then compares to the name
     *
     * @param name
     * @returns
     */
    find(name) {
        const results = [];
        for (const [key, value] of this.meta.entries()) {
            if (this.convertToRegExp(String(key)).test(name)) {
                results.push([key, value]);
            }
        }
        return results;
    }
    /**
     * Method to find values in the map by regular expression
     *
     * Compares Map Key to the input regular expression
     *
     * @param regex
     * @returns
     */
    findByRegex(regex) {
        const results = [];
        for (const [key, value] of this.meta.entries()) {
            if (regex.test(String(key))) {
                results.push([key, value]);
            }
        }
        return results;
    }
    /**
     * Method to check if the map has a specific key
     *
     * @param key
     * @returns
     */
    has(key) {
        return this.meta.has(key);
    }
    /**
     * Method to get the size of the map
     *
     * @returns
     */
    entries() {
        return this.meta.entries();
    }
    /**
     * Method to clear the map
     */
    clear() {
        this.meta.clear();
    }
}
exports.A_Meta = A_Meta;
//# sourceMappingURL=A-Meta.class.js.map