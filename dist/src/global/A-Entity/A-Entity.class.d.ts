import { ASEID } from "@adaas/a-utils";
import { A_TYPES__Entity_JSON, A_TYPES__IEntity } from "./A-Entity.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export declare class A_Entity<_ConstructorType = any, _SerializedType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON> extends A_Fragment implements A_TYPES__IEntity {
    aseid: ASEID;
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
    protected fromNewEntity(newEntity: _ConstructorType): void;
    protected fromSerialized(serialized: _SerializedType): void;
    /**
     * Converts the entity to a JSON object
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    toString(): string;
}
