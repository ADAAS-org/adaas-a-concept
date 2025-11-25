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
    _SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized
> {
    /**
     * The unique identifier/name for this fragment instance.
     * Used for identification and debugging purposes.
     */
    protected _name: string;

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
        };

        return result as _SerializedType;
    }
}