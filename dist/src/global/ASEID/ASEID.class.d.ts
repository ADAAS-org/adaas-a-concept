import { A_TYPES__ASEID_Constructor, A_TYPES__ASEID_JSON } from "./ASEID.types";
import { A_TYPES__Required } from "../../types/A_Common.types";
export declare class ASEID {
    /**
     * ASEID Regular Expression
     */
    static readonly regexp: RegExp;
    /**
     * Tests if the identity string is an ASEID
     *
     * @param identity
     * @returns
     */
    static isASEID(identity: string): boolean;
    /**
     * Concept for the ASEID
     * Generally it is the application name or code, should correspond to the concept where the entity is used
     * Could be ID or ASEID
     */
    private _concept;
    /**
     * Entity Scope the primary location of the resource
     * Organization, or organization Unit
     * Could be ID or ASEID
     *
     */
    private _scope;
    /**
     * Entity Type the type of the resource
     */
    private _entity;
    /**
     * Entity ID the unique identifier of the resource
     */
    private _id;
    /**
     * Version of the entity (optional)
     */
    private _version?;
    /**
     * Shard of the entity (optional)
     */
    private _shard?;
    /**
     * ASEID is a structured identifier for entities in the A-Concept system.
     * using the format:
     *  A - A-Concept
     *  S - System
     *  E - Entity
     *  I - Identifier
     *  D - iDentifier
     *
     * Structure: CONCEPT_NAME + @ + SCOPE + : ENTITY_NAME + : + ID + @ + VERSION
     *
     * Example:
     *  - root@core:usr:0000000001
     *
     * [!] Concept is optional, if not provided will be used the current concept name
     * [!] Scope is optional, if not provided will be used the root scope of the current concept
     * [!] Version is optional, if not provided will be considered as latest version
     *
     * @param aseid - ASEID string representation or ASEID components as object
     */
    constructor(
    /**
     * ASEID string representation
     */
    aseid: string);
    constructor(
    /**
     * ASEID components as object
     */
    props: A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>);
    /**
     * Getters for ASEID components
     */
    get concept(): string;
    /**
     * Get the scope of the ASEID
     */
    get scope(): string;
    /**
     * Get the entity of the ASEID
     */
    get entity(): string;
    /**
     * Get the id of the ASEID
     */
    get id(): string;
    /**
     * Get the version of the ASEID (if any)
     */
    get version(): string | undefined;
    /**
     * Get the shard of the ASEID (if any)
     */
    get shard(): string | undefined;
    /**
     * get Internal Initializer based on the type of the parameter provided
     *
     * @param param1
     * @returns
     */
    private getInitializer;
    /**
     * Initialize ASEID from string
     *
     * @param param1
     */
    private fromString;
    /**
     * Initialize ASEID from object
     *
     * @param param1
     */
    private fromObject;
    /**
     * String representation of the ASEID
     *
     * @returns
     */
    toString(): string;
    /**
     * JSON representation of the ASEID
     *
     * @returns
     */
    toJSON(): A_TYPES__ASEID_JSON;
    protected verifyInput(param1: string | A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>): void;
}
