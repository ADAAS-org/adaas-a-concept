import {
    A_CommonHelper,
    A_Error,
    ASEID
} from "@adaas/a-utils";
import {
    A_TYPES__Entity_JSON,
    A_TYPES__IEntity
} from "./A-Entity.types";
import { A_CONSTANTS__DEFAULT_ERRORS } from "@adaas/a-utils/dist/src/constants/errors.constants";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "@adaas/a-concept/constants/env.constants";



/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities. 
 * However, entity may hide some of its responsibilities behind the interface to prevent overload. 
 * 
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export class A_Entity<
    _ConstructorType = any,
    _SerializedType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON
>
    implements A_TYPES__IEntity {


    // ====================================================================
    // ================== Static A-Entity Information ============================
    // ====================================================================

    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string {
        return A_CommonHelper.toKebabCase(this.name);
    }

    /**
     * DEFAULT Namespace of the entity from environment variable A_CONCEPT_NAMESPACE
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get namespace(): string {
        return A_Context.root.name;
    }

    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string {
        return process && process.env ? process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_DEFAULT_SCOPE] || 'core' : 'core';
    }

    // ====================================================================
    // ================== Instance A-Entity Information ====================
    // ====================================================================

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
     * - namespace: an application specific identifier from where the entity is coming from
     * - scope: the scope of the entity from Application Namespace
     * - entity: the name of the entity from Application Namespace
     * - id: the unique identifier of the entity
     *
     * [!] For more information about ASEID, please refer to the ASEID class documentation]
     */
    aseid!: ASEID;



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
        aseid?: string
    )
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
        aseid: ASEID
    )
    /**
     * Create a new A_entity instance from serialized object
     * 
     * @param serialized 
     */
    constructor(
        /**
         * Serialized object that represents the entity
         */
        serialized: _SerializedType
    )
    /**
     * Create a new A_entity instance from constructor object
     * 
     * @param newEntity 
     */
    constructor(
        /**
         * Constructor object that represents the entity
         */
        newEntity?: _ConstructorType
    )
    constructor(props?: string | ASEID | _SerializedType | _ConstructorType) {

        const initializer = this.getInitializer(props);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, props);
    }
    // ====================================================================
    // ================== DUPLICATED ASEID Getters ========================
    // ====================================================================

    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number {
        return this.aseid.id;
    }

    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string {
        return this.aseid.namespace
    }

    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string {
        return this.aseid.scope;
    }

    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     * 
     */
    get entity(): string {
        return this.aseid.entity;
    }

    /**
     * Extracts the version from the ASEID
     * version is the version of the entity
     */

    get version(): string | undefined {
        return this.aseid.version;
    }

    /**
     * Extracts the shard from the ASEID
     * shard is the shard of the entity
     */
    get shard(): string | undefined {
        return this.aseid.shard;
    }

    // ====================================================================
    // ================== Constructor Helpers =============================
    // ====================================================================


    // --- Type guards used to classify `props` properly ---
    protected isStringASEID(x: unknown): x is string {
        return typeof x === "string" && ASEID.isASEID(x);
    }

    protected isASEIDInstance(x: unknown): x is ASEID {
        return x instanceof ASEID;
    }

    /**
     * A "serialized" object is considered such if it is a non-null object 
     * and contains an "aseid" property (this mirrors your original check). 
     * 
     * @param x 
     * @returns 
     */
    protected isSerializedObject(x: unknown): x is _SerializedType {
        return !!x && typeof x === "object" && "aseid" in (x as object);
    }

    /**
     * Constructor-style props = a plain object which does NOT contain "aseid".
     * This is the "create from provided fields" case.
     * 
     * @param x 
     * @returns 
     */
    protected isConstructorProps(x: unknown): x is _ConstructorType {
        return !!x && typeof x === "object" && !("aseid" in (x as object));
    }

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
    protected getInitializer(
        props?: string | ASEID | _SerializedType | _ConstructorType
    ): (props: any) => void | (() => void) {

        if (!props) {
            return this.fromUndefined
        }

        // 1) string that matches ASEID format -> fromASEID
        if (this.isStringASEID(props)) {
            return this.fromASEID as (p: string) => void;
        }

        // 2) ASEID instance -> fromASEID
        if (this.isASEIDInstance(props)) {
            return this.fromASEID as (p: ASEID) => void;
        }

        // 3) serialized object (has 'aseid') -> fromJSON
        if (this.isSerializedObject(props)) {
            return this.fromJSON as (p: _SerializedType) => void;
        }

        // 4) plain object with no 'aseid' -> treat as constructor props -> fromNew
        if (this.isConstructorProps(props)) {
            return this.fromNew as (p: _ConstructorType) => void;
        }

        // none of the above -> throw consistent error
        throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
    }


    /**
     * Call a feature of the component with the provided scope
     * 
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     * 
     * @param lifecycleMethod 
     * @param args 
     */
    async call(
        feature: string,
        scope: A_Scope = A_Context.scope(this)
    ) {
        //  scope can be completely custom without relation to the entity scope
        //  or it can be inherited from the entity scope
        // [!Not Now!] however, each feature should create own scope regardless of the passed scope
        //  to avoid any possible side effects
        if (scope && !scope.isInheritedFrom(A_Context.scope(this))) {
            scope = scope.inherit(A_Context.scope(this));
        }

        const newFeature = A_Context.feature(this, feature, scope);

        return await newFeature.process();
    }


    // ====================================================================
    // ================== Entity Base Methods =============================
    // ====================================================================

    /**
     * The default method that can be called and extended to load entity data.
     */
    async load(
        scope?: A_Scope,
    ) {
        return this.call('load', scope);
    }

    /**
     * The default method that can be called and extended to destroy entity data.
     */
    async destroy(scope?: A_Scope) {
        return this.call('destroy', scope);
    }

    /**
     * The default method that can be called and extended to save entity data.
     */
    async save(scope?: A_Scope) {
        return this.call('save', scope);
    }



    // ====================================================================
    // ================== Entity Serialization ============================
    // ====================================================================

    /**
     * Create a new entity from ASEID string or instance
     * [!] Executed when the constructor is called with a string or ASEID instance that represents the ASEID
     * [!] Executes By Default with new A_Entity('aseid-string') or new A_Entity(new ASEID(...)) if getInitializer has not been overridden
     * 
     * @param aseid 
     */
    fromASEID(aseid: string | ASEID): void {
        if (typeof aseid === 'string' && ASEID.isASEID(aseid)) {
            this.aseid = new ASEID(aseid);
        } else if (aseid instanceof ASEID) {
            this.aseid = aseid;
        } else {
            throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
    }

    /**
     * Handles the case when no props are provided to the constructor.
     * This method can be overridden in child classes to set default values or perform specific initialization logic.
     * By default, it does nothing.
     * 
     * 
     * @returns 
     */
    fromUndefined(): void {
        this.aseid = new ASEID({
            namespace: (this.constructor as typeof A_Entity).namespace,
            scope: (this.constructor as typeof A_Entity).scope,
            entity: (this.constructor as typeof A_Entity).entity,
            id: `${new Date().getTime().toString()}-${Math.floor(Math.random() * 10000000).toString()}`,
        });
        return;
    }

    /**
     * Create a new entity from constructor object
     * [!] Executed when the constructor is called with an object that does not contain "aseid" property
     * [!] Executes By Default with new A_Entity({}) if getInitializer has not been overridden
     * 
     * @param newEntity 
     * @returns 
     */
    fromNew(newEntity: _ConstructorType): void {
        this.aseid = new ASEID({
            namespace: (this.constructor as typeof A_Entity).namespace,
            scope: (this.constructor as typeof A_Entity).scope,
            entity: (this.constructor as typeof A_Entity).entity,
            id: `${new Date().getTime().toString()}-${Math.floor(Math.random() * 10000000).toString()}`,
        });

        return;
    }


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
    fromJSON(serialized: _SerializedType): void {
        this.aseid = new ASEID(serialized.aseid);
        return;
    }



    /**
     * Converts the entity to a JSON object 
     * [!] This method should be extended in the child classes to include all properties of the entity
     * [!] Includes aseid by default 
     * 
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        return {
            aseid: this.aseid.toString()
        } as _SerializedType;
    }


    /**
     * Returns the string representation of the entity
     * what is basically the ASEID string
     * 
     * @returns 
     */
    toString(): string {
        return this.aseid ? this.aseid.toString() : this.constructor.name;
    }
}