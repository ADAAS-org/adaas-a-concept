import { A_TYPES__Required, ASEID } from "@adaas/a-utils";
import { A_TYPES__Entity_JSON, A_TYPES__EntityBaseMethod, A_TYPES__EntityBaseMethods, A_TYPES__EntityCallParams, A_TYPES__IEntity } from "./A-Entity.types";
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export declare class A_Entity<_ConstructorType = any, _SerializedType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON, _FeatureNames extends Array<string | A_TYPES__EntityBaseMethod> = A_TYPES__EntityBaseMethods> implements A_TYPES__IEntity {
    aseid: ASEID;
    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string;
    constructor(aseid: string);
    constructor(aseid: ASEID);
    constructor(serialized: _SerializedType);
    constructor(newEntity: _ConstructorType);
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
    call(
    /**
     * A-Feature method name to be called
     */
    feature: _FeatureNames[number]): Promise<any>;
    call(
    /**
     * A-Feature name to be called
     */
    params: A_TYPES__Required<Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>, ['name']>): Promise<any>;
    call(
    /**
    * A-Feature method name to be called
    */
    feature: _FeatureNames[number], 
    /**
     * Parameters to provide additional data to the feature
     */
    params: Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>): Promise<any>;
    load(): Promise<void>;
    destroy(): Promise<void>;
    save(): Promise<void>;
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
