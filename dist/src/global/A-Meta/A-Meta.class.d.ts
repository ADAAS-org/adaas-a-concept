/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc.
 *
 * [!] Meta can be different depending on the type of input data
 */
export declare class A_Meta<_StorageItems extends Record<string, any>> implements Iterable<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
    protected meta: Map<keyof _StorageItems, _StorageItems[keyof _StorageItems]>;
    /**
     * Method to get the iterator for the meta object
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Allows to replicate received meta object by replacing internal meta to the received one
     *
     * @param meta
     * @returns
     */
    from(meta: A_Meta<_StorageItems>): A_Meta<_StorageItems>;
    /**
     * Method to set values in the map
     *
     * @param key
     * @param value
     */
    set<K extends keyof _StorageItems>(key: K, value: _StorageItems[K]): void;
    /**
     * Method to get values from the map
     *
     * @param key
     * @returns
     */
    get<K extends keyof _StorageItems>(key: K): _StorageItems[K] | undefined;
    /**
     * Method to delete values from the map
     *
     * @param key
     * @returns
     */
    delete(key: keyof _StorageItems): boolean;
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
    private convertToRegExp;
    /**
     * Method to find values in the map by name.
     *
     * Converts the Key in Map to a regular expression and then compares to the name
     *
     * @param name
     * @returns
     */
    find(name: string): [keyof _StorageItems, _StorageItems[keyof _StorageItems]][];
    /**
     * Method to find values in the map by regular expression
     *
     * Compares Map Key to the input regular expression
     *
     * @param regex
     * @returns
     */
    findByRegex(regex: RegExp): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Method to check if the map has a specific key
     *
     * @param key
     * @returns
     */
    has(key: keyof _StorageItems): boolean;
    /**
     * Method to get the size of the map
     *
     * @returns
     */
    entries(): IterableIterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Method to clear the map
     */
    clear(): void;
    toArray(): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
}
