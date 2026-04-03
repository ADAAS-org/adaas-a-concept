import { A_MetaDecorator } from "./A-Meta.decorator";
import { A_TYPES__Meta_Constructor } from "./A-Meta.types";

/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc. 
 * 
 * [!] Meta can be different depending on the type of input data
 */
export class A_Meta<
    _StorageItems extends Record<any, any> = any,
    _SerializedType extends Record<string, any> = Record<string, any>
> implements Iterable<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {

    /**
     * Allows to set a custom meta class for the Component or Container or Entity, or anything else. 
     * 
     * @param target 
     * @returns 
     */
    static Define<T extends A_Meta>(target: A_TYPES__Meta_Constructor<T>) {
        return A_MetaDecorator(target);
    }



    protected meta: Map<keyof _StorageItems, _StorageItems[keyof _StorageItems]> = new Map();


    /**
     * Method to get the iterator for the meta object
     * 
     * @returns 
     */
    [Symbol.iterator](): Iterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
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
    from(
        meta: A_Meta<_StorageItems>
    ): A_Meta<_StorageItems> {
        this.meta = new Map(meta.meta);

        return this;
    }
    /**
     * Allows to create a copy of the meta object with the same values, this is needed to ensure that when we inherit meta from the parent component, we create a copy of it, not a reference to the same object. This allows us to modify the meta of the child component without affecting the meta of the parent component.
     * 
     * @returns 
     */
    clone(): A_Meta<_StorageItems> {
        const ctor = this.constructor as new () => this;
        const copy = new ctor();
        copy.meta = new Map(this.meta);
        return copy;
    }
    /**
     * Method to set values in the map
     * 
     * @param key 
     * @param value 
     */
    set<K extends keyof _StorageItems>(key: K, value: _StorageItems[K]) {

        const inheritedValue = this.meta.get(key)
            || Array.isArray(value)
            ? []
            : (value as any) instanceof Map
                ? new Map()
                : {};
        const targetValue = this.meta.get(key)
            || Array.isArray(value)
            ? [
                ...inheritedValue as any
            ] : (value as any) instanceof Map
                ? new Map(inheritedValue as any)
                : { ...inheritedValue };

        this.meta.set(key, value);

    }
    /**
     * Method to get values from the map
     * 
     * @param key 
     * @returns 
     */
    get<K extends keyof _StorageItems>(key: K): _StorageItems[K] | undefined {
        return this.meta.get(key) as _StorageItems[K];
    }
    /**
     * Method to delete values from the map
     * 
     * @param key 
     * @returns 
     */
    delete(key: keyof _StorageItems): boolean {
        return this.meta.delete(key);
    }
    /**
     * Method to get the size of the map
     * 
     * @returns 
     */
    size(): number {
        return this.meta.size;
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
    /**
     * Cache for compiled RegExp instances keyed by their string source.
     * Avoids re-compiling the same regex pattern on every find() call.
     */
    private _regExpCache?: Map<string, RegExp>;

    private convertToRegExp(key: string | RegExp): RegExp {
        if (key instanceof RegExp) return key;

        // Use cache to avoid re-compiling the same regex pattern repeatedly
        if (!this._regExpCache) {
            this._regExpCache = new Map();
        }
        let cached = this._regExpCache.get(key);
        if (!cached) {
            cached = new RegExp(key);
            this._regExpCache.set(key, cached);
        }
        return cached;
    }
    /**
     * Method to find values in the map by name.
     * 
     * Converts the Key in Map to a regular expression and then compares to the name
     * 
     * @param name 
     * @returns 
     */
    find(name: string) {
        const results: Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> = [];
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
    findByRegex(regex: RegExp): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
        const results: Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> = [];
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
    has(key: keyof _StorageItems): boolean {
        return this.meta.has(key);
    }
    /**
     * Method to get the size of the map
     * 
     * @returns 
     */
    entries(): IterableIterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
        return this.meta.entries();
    }
    /**
     * Method to clear the map
     */
    clear(): void {
        this.meta.clear();
    }
    /**
     * Method to convert the meta to an array of key-value pairs
     * 
     * @returns 
     */
    toArray(): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
        return Array.from(this.meta.entries());
    }
    /**
     * Helper method to recursively convert the meta object to a JSON-compatible format. It handles nested A_Meta instances, Maps, Arrays, and plain objects.
     * 
     * @param value 
     * @returns 
     */
    protected recursiveToJSON(value: any): any {
        switch (true) {
            case value instanceof A_Meta:
                return value.toJSON();

            case value instanceof Map:
                const obj: Record<string, any> = {};
                for (const [k, v] of value.entries()) {
                    obj[String(k)] = this.recursiveToJSON(v);
                }
                return obj;

            case Array.isArray(value):
                return value.map((item) => this.recursiveToJSON(item));

            case !!value && typeof value === 'object':
                const res: Record<string, any> = {};
                for (const [k, v] of Object.entries(value)) {
                    res[k] = this.recursiveToJSON(v);
                }
                return res;

            default:
                return value;
        }
    }
    /**
     * Serializes the meta to a JSON object
     * Uses internal storage to convert to JSON
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        const json: Record<string, any> = {};

        for (const [key, value] of this.meta.entries()) {
            json[String(key)] = this.recursiveToJSON(value);
        }
        return json as _SerializedType;
    }
}