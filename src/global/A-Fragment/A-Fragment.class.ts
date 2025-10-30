import { A_TYPES__DeepPartial } from "@adaas/a-concept/types/A_Common.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__Fragment_Init, A_TYPES__Fragment_Serialized } from "./A-Fragment.types";


/**
 * A_Fragment is a core architectural component that represents a singleton execution context
 * within the A-Concept framework. It serves as a shared memory container that can be passed
 * between Components, Entities, and Commands throughout the application pipeline.
 * 
 * Key Features:
 * - Singleton pattern: Only one instance per fragment type per scope
 * - Meta storage: Built-in key-value storage for pipeline data
 * - Type-safe: Full TypeScript generics support for meta items and serialization
 * - Serializable: Can be converted to JSON for persistence or transmission
 * 
 * @template _MetaItems - Type definition for the meta storage structure
 * @template _SerializedType - Type definition for the serialized output format
 * 
 * @example
 * ```typescript
 * // Basic usage with typed meta
 * class UserFragment extends A_Fragment<{ userId: string; role: string }> {
 *   constructor() {
 *     super({ name: 'UserFragment' });
 *   }
 * }
 * 
 * // Custom serialization
 * class SessionFragment extends A_Fragment<
 *   { sessionId: string; timestamp: number },
 *   { name: string; sessionData: string }
 * > {
 *   toJSON() {
 *     return {
 *       name: this.name,
 *       sessionData: `${this.get('sessionId')}-${this.get('timestamp')}`
 *     };
 *   }
 * }
 * ```
 */
export class A_Fragment<
    _MetaItems extends Record<string, any> = any,
    _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized & _MetaItems
> {
    /**
     * The unique identifier/name for this fragment instance.
     * Used for identification and debugging purposes.
     */
    protected _name: string;

    /**
     * Internal meta storage using A_Meta for type-safe key-value operations.
     * This stores all the fragment's runtime data that can be accessed and modified
     * throughout the execution pipeline.
     */
    protected _meta: A_Meta<_MetaItems> = new A_Meta<_MetaItems>();


    /**
     * Creates a new A_Fragment instance.
     * 
     * A_Fragment implements the singleton pattern for execution contexts, allowing
     * shared state management across different parts of the application pipeline.
     * Each fragment serves as a memory container that can store typed data and be
     * serialized for persistence or transmission.
     * 
     * Key Benefits:
     * - Centralized state management for related operations
     * - Type-safe meta operations with full IntelliSense support
     * - Serialization support for data persistence
     * - Singleton pattern ensures consistent state within scope
     * 
     * @param params - Initialization parameters
     * @param params.name - Optional custom name for the fragment (defaults to class name)
     * 
     * @example
     * ```typescript
     * const fragment = new A_Fragment<{ userId: string }>({ 
     *   name: 'UserSessionFragment' 
     * });
     * fragment.set('userId', '12345');
     * ```
     */
    constructor(params: Partial<A_TYPES__Fragment_Init> = {}) {
        this._name = params.name || this.constructor.name;
    }

    /**
     * Gets the fragment's unique name/identifier.
     * 
     * @returns The fragment name
     */
    get name(): string {
        return this._name;
    }

    /**
     * Gets direct access to the underlying Meta object for advanced meta operations.
     * 
     * Use this when you need to perform bulk operations or access Meta-specific methods.
     * For simple get/set operations, prefer using the direct methods on the fragment.
     * 
     * @returns The Meta instance containing the fragment's meta
     * 
     * @example
     * ```typescript
     * const fragment = new A_Fragment<{ users: string[], count: number }>();
     * 
     * // Advanced operations using meta
     * fragment.meta.setMultiple({
     *   users: ['alice', 'bob'],
     *   count: 2
     * });
     * 
     * // Get all keys
     * const keys = fragment.meta.keys();
     * ```
     */
    get meta(): A_Meta<_MetaItems> {
        return this._meta;
    }

    /**
     * Checks if a specific meta key exists in the fragment.
     * 
     * @param param - The key to check for existence
     * @returns True if the key exists, false otherwise
     * 
     * @example
     * ```typescript
     * if (fragment.has('userId')) {
     *   console.log('User ID is set');
     * }
     * ```
     */
    has(param: keyof _MetaItems): boolean {
        return this._meta.has(param);
    }

    /**
     * Retrieves a value from the fragment's meta.
     * 
     * @param param - The key to retrieve
     * @returns The value associated with the key, or undefined if not found
     * 
     * @example
     * ```typescript
     * const userId = fragment.get('userId');
     * if (userId) {
     *   console.log(`Current user: ${userId}`);
     * }
     * ```
     */
    get<K extends keyof _MetaItems>(param: K): _MetaItems[K] | undefined {
        return this._meta.get(param);
    }

    /**
     * Stores a value in the fragment's meta.
     * 
     * @param param - The key to store the value under
     * @param value - The value to store
     * 
     * @example
     * ```typescript
     * fragment.set('userId', '12345');
     * fragment.set('role', 'admin');
     * ```
     */
    set<K extends keyof _MetaItems>(param: K, value: _MetaItems[K]): void {
        this._meta.set(param, value);
    }

    /**
     * Removes a specific key from the fragment's meta.
     * 
     * @param param - The key to remove
     * 
     * @example
     * ```typescript
     * fragment.drop('temporaryData');
     * ```
     */
    drop(param: keyof _MetaItems): void {
        this._meta.delete(param);
    }

    /**
     * Clears all data from the fragment's meta.
     * 
     * Use with caution as this will remove all stored data in the fragment.
     * 
     * @example
     * ```typescript
     * fragment.clear(); // All meta data is now gone
     * ```
     */
    clear(): void {
        this._meta.clear();
    }

    /**
     * Gets the number of items stored in the fragment's meta.
     * 
     * @returns The count of stored meta items
     * 
     * @example
     * ```typescript
     * console.log(`Fragment contains ${fragment.size()} items`);
     * ```
     */
    size(): number {
        return this._meta.size();
    }

    /**
     * Gets all keys currently stored in the fragment's meta.
     * 
     * @returns Array of all meta keys
     * 
     * @example
     * ```typescript
     * const keys = fragment.keys();
     * console.log('Stored keys:', keys);
     * ```
     */
    keys(): (keyof _MetaItems)[] {
        return this._meta.toArray().map(([key]) => key);
    }

    /**
     * Sets multiple values at once in the fragment's meta.
     * 
     * @param data - Object containing key-value pairs to set
     * 
     * @example
     * ```typescript
     * fragment.setMultiple({
     *   userId: '12345',
     *   role: 'admin',
     *   lastLogin: new Date()
     * });
     * ```
     */
    setMultiple(data: A_TYPES__DeepPartial<_MetaItems>): void {
        Object.entries(data).forEach(([key, value]) => {
            if (value !== undefined) {
                this._meta.set(key as keyof _MetaItems, value);
            }
        });
    }

    /**
     * Creates a shallow copy of the fragment with the same meta data.
     * 
     * @param newName - Optional new name for the cloned fragment
     * @returns A new fragment instance with copied meta
     * 
     * @example
     * ```typescript
     * const original = new A_Fragment<{ data: string }>({ name: 'original' });
     * original.set('data', 'test');
     * 
     * const clone = original.clone('cloned');
     * console.log(clone.get('data')); // 'test'
     * ```
     */
    clone(newName?: string): A_Fragment<_MetaItems, _SerializedType> {
        const cloned = new (this.constructor as any)({ 
            name: newName || `${this._name}_copy` 
        });
        
        // Copy all meta data
        this._meta.toArray().forEach(([key, value]) => {
            cloned.set(key, value);
        });
        
        return cloned;
    }


    /**
     * Serializes the fragment to a JSON-compatible object.
     * 
     * This method combines the fragment's name with all meta data to create
     * a serializable representation. The return type is determined by the
     * _SerializedType generic parameter, allowing for custom serialization formats.
     * 
     * @returns A serialized representation of the fragment
     * 
     * @example
     * ```typescript
     * const fragment = new A_Fragment<{ userId: string, role: string }>({
     *   name: 'UserFragment'
     * });
     * fragment.set('userId', '12345');
     * fragment.set('role', 'admin');
     * 
     * const json = fragment.toJSON();
     * // Result: { name: 'UserFragment', userId: '12345', role: 'admin' }
     * ```
     */
    toJSON(): _SerializedType {
        const result = {
            name: this.name,

            ...this.meta.toArray().reduce((acc, [key, value]) => {
                acc[key] = value;
                return acc;
            }, {} as _MetaItems)
        };

        return result as unknown as _SerializedType;
    }
}