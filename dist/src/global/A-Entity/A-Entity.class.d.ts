import { ASEID } from "@adaas/a-utils";
import { A_TYPES__Entity_JSON, A_TYPES__IEntity } from "./A-Entity.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export declare class A_Entity<_ConstructorType = any, _SerializedType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON> implements A_TYPES__IEntity {
    aseid: ASEID;
    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string;
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
    aseid: string);
    /**
     * Create a new A_entity instance from Aseid instance
     * e.g. new ASEID({namespace: 'project', scope: 'default', entity: 'entity', id: '0000000001'})
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
    newEntity: _ConstructorType);
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
    protected getInitializer(props: string | ASEID | _SerializedType | _ConstructorType): (props: any) => void;
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number;
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string;
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string;
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     *
     */
    get entity(): string;
    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */
    get version(): string | undefined;
    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard(): string | undefined;
    /**
     * Call a feature of the component
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature: string, scope?: A_Scope): Promise<any>;
    /**
     * The default method that can be called and extended to load entity data.
     */
    load(scope?: A_Scope): Promise<any>;
    /**
     * The default method that can be called and extended to destroy entity data.
     */
    destroy(scope?: A_Scope): Promise<any>;
    /**
     * The default method that can be called and extended to save entity data.
     */
    save(scope?: A_Scope): Promise<any>;
    fromASEID(aseid: string | ASEID): void;
    fromNew(newEntity: _ConstructorType): void;
    fromJSON(serialized: _SerializedType): void;
    /**
     * Converts the entity to a JSON object
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    toString(): string;
}
