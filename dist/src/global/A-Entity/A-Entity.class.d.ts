import { A_TYPES__Entity_Serialized, A_TYPES__Entity_Init, A_TYPES__IEntity } from "./A-Entity.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { ASEID } from "../ASEID/ASEID.class";
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export declare class A_Entity<_ConstructorType extends A_TYPES__Entity_Init = A_TYPES__Entity_Init, _SerializedType extends A_TYPES__Entity_Serialized = A_TYPES__Entity_Serialized> implements A_TYPES__IEntity {
    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string;
    /**
     * DEFAULT Concept Name (Application Name) of the entity from environment variable A_CONCEPT_NAME
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept(): string;
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string;
    /**
     * ASEID is an entity identifier that is unique across the system
     * A - A_Concept or Application
     * S - System or Scope
     * E - Entity
     * ID - Identifier
     *
     * [!] ASEID is immutable and should not be changed after the entity is created
     *
     * [!] ASEID is composed of the following parts:
     * - concept: an application specific identifier from where the entity is coming from
     * - scope: the scope of the entity from concept
     * - entity: the name of the entity from concept
     * - id: the unique identifier of the entity
     *
     * [!] For more information about ASEID, please refer to the ASEID class documentation]
     */
    aseid: ASEID;
    /**
     * Create a new A_entity instance from Aseid String
     * e.g. project@scope:entity:0000000001
     *
     * @param aseid
     */
    constructor(
    /**
     * ASEID string that represents the entity
     */
    aseid?: string);
    /**
     * Create a new A_entity instance from Aseid instance
     * e.g. new ASEID({concept: 'project', scope: 'default', entity: 'entity', id: '0000000001'})
     *
     * @param aseid
     */
    constructor(
    /**
     * ASEID instance that represents the entity
     */
    aseid: ASEID);
    /**
     * Create a new A_entity instance from serialized object
     *
     * @param serialized
     */
    constructor(
    /**
     * Serialized object that represents the entity
     */
    serialized: _SerializedType);
    /**
     * Create a new A_entity instance from constructor object
     *
     * @param newEntity
     */
    constructor(
    /**
     * Constructor object that represents the entity
     */
    newEntity?: _ConstructorType);
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number;
    protected isStringASEID(x: unknown): x is string;
    protected isASEIDInstance(x: unknown): x is ASEID;
    /**
     * A "serialized" object is considered such if it is a non-null object
     * and contains an "aseid" property (this mirrors your original check).
     *
     * @param x
     * @returns
     */
    protected isSerializedObject(x: unknown): x is _SerializedType;
    /**
     * Constructor-style props = a plain object which does NOT contain "aseid".
     * This is the "create from provided fields" case.
     *
     * @param x
     * @returns
     */
    protected isConstructorProps(x: unknown): x is _ConstructorType;
    /**
     * Determines the appropriate initializer method based on the type of `props`.
     * The method checks if `props` is:
     * 1) a string that matches ASEID format -> fromASEID
     * 2) an ASEID instance -> fromASEID
     * 3) a serialized object (has 'aseid') -> fromJSON
     * 4) a plain object with no 'aseid' -> treat as constructor props -> fromNew
     *
     * [!] If `props` is undefined, it will call fromUndefined method
     *
     * If none of the above, it throws an error indicating incorrect constructor usage.
     *
     *
     * To get a custom initializer, override this method in the child class.
     * Example:
     * ```typescript
     * protected getInitializer(
     *   props?: string | ASEID | _SerializedType | _ConstructorType
     * ): (props: any) => void | (() => void) {
     *   if('customField' in props) {
     *       return this.fromCustomField.bind(this);
     *   }
     *   return super.getInitializer(props);
     * }
     * ```
     * @param props
     * @returns The appropriate initializer method
     */
    protected getInitializer(props?: string | ASEID | _SerializedType | _ConstructorType): (props: any) => void | (() => void);
    /**
     * Call a feature of the component with the provided scope
     *
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature: string, scope?: A_Scope): Promise<void>;
    /**
     * The default method that can be called and extended to load entity data.
     */
    load(scope?: A_Scope): Promise<void>;
    /**
     * The default method that can be called and extended to destroy entity data.
     */
    destroy(scope?: A_Scope): Promise<void>;
    /**
     * The default method that can be called and extended to save entity data.
     */
    save(scope?: A_Scope): Promise<void>;
    /**
     * Create a new entity from ASEID string or instance
     * [!] Executed when the constructor is called with a string or ASEID instance that represents the ASEID
     * [!] Executes By Default with new A_Entity('aseid-string') or new A_Entity(new ASEID(...)) if getInitializer has not been overridden
     *
     * @param aseid
     */
    fromASEID(aseid: string | ASEID): void;
    /**
     * Handles the case when no props are provided to the constructor.
     * This method can be overridden in child classes to set default values or perform specific initialization logic.
     * By default, it does nothing.
     *
     *
     * @returns
     */
    fromUndefined(): void;
    /**
     * Create a new entity from constructor object
     * [!] Executed when the constructor is called with an object that does not contain "aseid" property
     * [!] Executes By Default with new A_Entity({}) if getInitializer has not been overridden
     *
     * @param newEntity
     * @returns
     */
    fromNew(newEntity: _ConstructorType): void;
    /**
     * Creates a new entity from serialized object
     *
     * [!] Executed when the constructor is called with an object that contains "aseid" property
     * [!] Executes By Default with new A_Entity({ aseid: '...' }) if getInitializer has not been overridden
     *
     *
     * @param serialized
     * @returns
     */
    fromJSON(serialized: _SerializedType): void;
    /**
     * Converts the entity to a JSON object
     * [!] This method should be extended in the child classes to include all properties of the entity
     * [!] Includes aseid by default
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    /**
     * Returns the string representation of the entity
     * what is basically the ASEID string
     *
     * @returns
     */
    toString(): string;
}
