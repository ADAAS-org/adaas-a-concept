/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc. 
 * 
 * [!] Meta can be different depending on the type of input data
 */
export class A_Meta<
    _StorageItems extends Record<string, any>
// _StorageItems extends Record<string, Map<string | Symbol, any> | Array<any> | A_TYPES__Dictionary<any>>
> implements Iterable<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {

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
    private convertToRegExp(key: string | RegExp): RegExp {
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


    toArray(): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
        return Array.from(this.meta.entries());
    }
}