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
import { A_TYPES__FeatureCallParams } from "../A-Feature/A-Feature.types";
import { A_Scope } from "../A-Scope/A-Scope.class";



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

    aseid!: ASEID;


    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string {
        return A_CommonHelper
            .toUpperSnakeCase(this.name)
            .toLocaleLowerCase()
            .replace(/_/g, '-');
    }

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
        aseid: string
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
        newEntity: _ConstructorType
    )
    constructor(props: string | ASEID | _SerializedType | _ConstructorType) {

        const initializer = this.getInitializer(props);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, props);
    }


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

    // --- Overloads: provide precise return-type depending on input ---
    protected getInitializer(
        props: string | ASEID | _SerializedType | _ConstructorType
    ): (props: any) => void {
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




    /**
     * Call a feature of the component
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

    fromASEID(aseid: string | ASEID): void {
        if (typeof aseid === 'string' && ASEID.isASEID(aseid)) {
            this.aseid = new ASEID(aseid);
        } else if (aseid instanceof ASEID) {
            this.aseid = aseid;
        } else {
            throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
    }

    fromNew(newEntity: _ConstructorType): void {
        // this.aseid = new ASEID

        return;
    }

    fromJSON(serialized: _SerializedType): void {
        this.aseid = new ASEID((serialized).aseid);
        return;
    }



    /**
     * Converts the entity to a JSON object 
     * 
     * 
     * @returns 
     */
    toJSON(): _SerializedType {
        return {
            aseid: this.aseid.toString()
        } as _SerializedType;
    }


    toString(): string {
        return this.aseid ? this.aseid.toString() : this.constructor.name;
    }
}