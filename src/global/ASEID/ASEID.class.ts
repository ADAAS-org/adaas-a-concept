import {
    A_TYPES__ASEID_Constructor,
    A_TYPES__ASEID_JSON
} from "./ASEID.types";
import { A_IdentityHelper } from "@adaas/a-concept/helpers/A_Identity.helper";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_Context } from "../A-Context/A-Context.class";
import { ASEID_Error } from "./ASEID.error";
import { A_TYPES__Required } from "@adaas/a-concept/types/A_Common.types";



export class ASEID {


    //==========================================================================
    //============================= STATIC METHODS ===========================
    //==========================================================================
    /**
     * ASEID Regular Expression
     */
    static readonly regexp: RegExp = new RegExp(`^[a-z|A-Z|0-9|-]+@[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-|\\.]+(@v[0-9|\\.]+|@lts)?$`)
    /**
     * Tests if the identity string is an ASEID
     * 
     * @param identity 
     * @returns 
     */
    static isASEID(identity: string): boolean {
        return this.regexp.test(
            identity
        )
    }



    // ====================================================================
    // ==================== Hidden ASEID Information ======================
    // ====================================================================
    /**
     * Concept for the ASEID
     * Generally it is the application name or code, should correspond to the concept where the entity is used
     * Could be ID or ASEID
     */
    private _concept!: string;
    /**
     * Entity Scope the primary location of the resource 
     * Organization, or organization Unit
     * Could be ID or ASEID
     * 
     */
    private _scope!: string
    /**
     * Entity Type the type of the resource
     */
    private _entity!: string
    /**
     * Entity ID the unique identifier of the resource
     */
    private _id!: string
    /**
     * Version of the entity (optional)
     */
    private _version?: string
    /**
     * Shard of the entity (optional)
     */
    private _shard?: string






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
        aseid: string
    )
    constructor(
        /**
         * ASEID components as object 
         */
        props: A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>
    )
    constructor(param1: string | A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>) {
        this.verifyInput(param1);

        const initializer = this.getInitializer(param1);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1);
    }

    /**
     * Getters for ASEID components
     */
    get concept(): string {
        return this._concept || A_Context.concept;
    }
    /**
     * Get the scope of the ASEID
     */
    get scope(): string {
        return this._scope || A_Context.root.name;
    }
    /**
     * Get the entity of the ASEID
     */
    get entity(): string {
        return this._entity;
    }
    /**
     * Get the id of the ASEID
     */
    get id(): string {
        return this._id;
    }
    /**
     * Get the version of the ASEID (if any)
     */
    get version(): string | undefined {
        return this._version;
    }
    /**
     * Get the shard of the ASEID (if any)
     */
    get shard(): string | undefined {
        return this._shard;
    }

    /**
     * get Internal Initializer based on the type of the parameter provided
     * 
     * @param param1 
     * @returns 
     */
    private getInitializer(
        param1: string | A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>
    ): (param1: any) => void | (() => void) {
        switch (true) {
            case A_TypeGuards.isString(param1):
                return this.fromString;

            case A_TypeGuards.isObject<A_TYPES__ASEID_Constructor>(param1):
                return this.fromObject;

            default:
                throw new ASEID_Error(
                    ASEID_Error.ASEIDInitializationError,
                    'Invalid parameters provided to ASEID constructor'
                );
        }
    }


    /**
     * Initialize ASEID from string
     * 
     * @param param1 
     */
    private fromString(param1: string) {
        const [concept, body, version] = param1.split('@');
        const [scope, entity, idCandidate] = body.split(':');

        const shard = idCandidate.includes('.') ? idCandidate.split('.')[0] : undefined;
        const id = idCandidate.includes('.') ? idCandidate.split('.')[1] : idCandidate;

        this._concept = concept || A_Context.root.name;
        this._scope = scope || A_Context.root.name;
        this._entity = entity;
        this._id = id;
        this._version = version;
        this._shard = shard;
    }
    /**
     * Initialize ASEID from object
     * 
     * @param param1 
     */
    private fromObject(param1: A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>) {
        this._concept = param1.concept
            ? ASEID.isASEID(param1.concept)
                ? new ASEID(param1.concept).id
                : param1.concept
            : A_Context.concept;

        this._scope = param1.scope
            ? A_TypeGuards.isNumber(param1.scope)
                ? A_IdentityHelper.formatWithLeadingZeros(param1.scope) :
                ASEID.isASEID(param1.scope)
                    ? new ASEID(param1.scope).id
                    : param1.scope
            : A_Context.root.name

        this._entity = param1.entity;

        this._id = A_TypeGuards.isNumber(param1.id)
            ? A_IdentityHelper.formatWithLeadingZeros(param1.id)
            : param1.id;

        this._version = param1.version;
        this._shard = param1.shard;
    }


    /**
     * String representation of the ASEID
     * 
     * @returns 
     */
    toString(): string {
        return `${this.concept}@${this.scope}:${this.entity}:${this.shard ? (this.shard + '.' + this.id) : this.id}${this.version ? ('@' + this.version) : ''}`
    }

    /**
     * JSON representation of the ASEID
     * 
     * @returns 
     */
    toJSON(): A_TYPES__ASEID_JSON {
        return {
            concept: this._concept,
            scope: this._scope,
            entity: this._entity,
            id: this._id,
            version: this._version,
            shard: this._shard
        }
    }

    // --------------------------------------------------------------------------
    // ----------------------- PROTECTED HELPERS --------------------------------
    // --------------------------------------------------------------------------


    protected verifyInput(param1: string | A_TYPES__Required<Partial<A_TYPES__ASEID_Constructor>, ['id', 'entity']>) {

        switch (true) {
            // 1) check for string and validate it as ASEID
            case A_TypeGuards.isString(param1) && !ASEID.isASEID(param1):
                throw new ASEID_Error(ASEID_Error.ASEIDValidationError, 'Invalid ASEID format provided')

            // 2) check for object and validate required fields
            case A_TypeGuards.isObject<A_TYPES__ASEID_Constructor>(param1) && !param1.id:
                throw new ASEID_Error(ASEID_Error.ASEIDValidationError, 'ASEID id is required')

            // 3) check for object and validate required fields
            case A_TypeGuards.isObject<A_TYPES__ASEID_Constructor>(param1) && !param1.entity:
                throw new ASEID_Error(ASEID_Error.ASEIDValidationError, 'ASEID entity is required')

        }
    }
}