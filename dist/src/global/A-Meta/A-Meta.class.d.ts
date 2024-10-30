/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc.
 *
 * [!] Meta can be different depending on the type of input data
 */
export declare class A_Meta<_StorageItems extends Record<string, any>> {
    protected meta: Map<keyof _StorageItems, _StorageItems[keyof _StorageItems]>;
    from(meta: A_Meta<_StorageItems>): A_Meta<_StorageItems>;
    set<K extends keyof _StorageItems>(key: K, value: _StorageItems[K]): void;
    get<K extends keyof _StorageItems>(key: K): _StorageItems[K] | undefined;
    delete(key: keyof _StorageItems): boolean;
    findByRegex(regex: RegExp): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    has(key: keyof _StorageItems): boolean;
    entries(): IterableIterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    clear(): void;
}
