"use strict";
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
    from(meta) {
        this.meta = new Map(meta.meta);
        return this;
    }
    // ===================================================================================================
    // ================================ META OPERATIONS ==================================================
    // ===================================================================================================
    // Method to set values in the map
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
    // Method to get values from the map
    get(key) {
        return this.meta.get(key);
    }
    // Delete a key-value pair by key
    delete(key) {
        return this.meta.delete(key);
    }
    // Search for keys by regex
    findByRegex(regex) {
        const results = [];
        for (const [key, value] of this.meta.entries()) {
            if (regex.test(String(key))) {
                results.push([key, value]);
            }
        }
        return results;
    }
    // Check if a key exists
    has(key) {
        return this.meta.has(key);
    }
    // Get all entries in the map
    entries() {
        return this.meta.entries();
    }
    // Clear all entries
    clear() {
        this.meta.clear();
    }
}
exports.A_Meta = A_Meta;
//# sourceMappingURL=A-Meta.class.js.map