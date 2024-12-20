import {
    A_CommonHelper,
    A_Error, A_TYPES__Required,
    ASEID
} from "@adaas/a-utils";
import {
    A_TYPES__Entity_JSON,
    A_TYPES__EntityBaseMethod,
    A_TYPES__EntityBaseMethods,
    A_TYPES__EntityCallParams,
    A_TYPES__IEntity
} from "./A-Entity.types";
import { A_CONSTANTS__DEFAULT_ERRORS } from "@adaas/a-utils/dist/src/constants/errors.constants";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";



/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities. 
 * However, entity may hide some of its responsibilities behind the interface to prevent overload. 
 * 
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
export class A_Entity<
    _ConstructorType = any,
    _SerializedType extends A_TYPES__Entity_JSON = A_TYPES__Entity_JSON,
    _FeatureNames extends Array<string | A_TYPES__EntityBaseMethod> = A_TYPES__EntityBaseMethods
>
    implements A_TYPES__IEntity {

    aseid!: ASEID;


    /**
     * Entity Identifier that corresponds to the class name
     */
    static get entity(): string {
        return A_CommonHelper
            .toUpperSnakeCase(this.constructor.name)
            .toLocaleLowerCase()
            .replace(/_/g, '-');
    }

    constructor(
        aseid: string
    )
    constructor(
        aseid: ASEID
    )
    constructor(
        serialized: _SerializedType
    )
    constructor(
        newEntity: _ConstructorType
    )
    constructor(props: string | ASEID | _SerializedType | _ConstructorType) {

        
        switch (true) {
            case (typeof props === 'string' && ASEID.isASEID(props)):
                this.aseid = new ASEID(props);
                break;
            case (props instanceof ASEID):
                this.aseid = props;
                break;
            case (!!props && typeof props === 'object' && 'aseid' in props):
                this.fromJSON(props);
                break;

            case (typeof props === 'object'):
                this.fromNew(props as _ConstructorType);
                break

            default:
                throw new A_Error(A_CONSTANTS__DEFAULT_ERRORS.INCORRECT_A_ENTITY_CONSTRUCTOR);
        }
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
        /**
         * A-Feature method name to be called
         */
        feature: _FeatureNames[number],
    ): Promise<any>
    async call(
        /**
         * A-Feature name to be called
         */
        params: A_TYPES__Required<Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>, ['name']>,
    ): Promise<any>
    async call(
        /**
        * A-Feature method name to be called
        */
        feature: _FeatureNames[number],
        /**
         * Parameters to provide additional data to the feature
         */
        params: Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>,
    ): Promise<any>

    async call(
        param1: _FeatureNames[number] | A_TYPES__Required<Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>, ['name']>,
        param2?: Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>>
    ): Promise<any> {

        const feature: string = typeof param1 === 'string'
            ? param1
            : param1.name;
        const params: Partial<A_TYPES__EntityCallParams<_FeatureNames[number]>> = typeof param1 === 'string'
            ? param2 || {}
            : param1;


        console.log('WTF???? ', A_Context.scope(this))

        const newFeature = A_Context.feature(A_Context.scope(this), this, feature, params);

        return await newFeature.process();
    }


    // ====================================================================
    // ================== Entity Base Methods =============================
    // ====================================================================


    async load() {
        await this.call(A_TYPES__EntityBaseMethod.DESTROY, {
            entities: [
                this
            ]
        });
    }



    async destroy() {
        await this.call(A_TYPES__EntityBaseMethod.DESTROY, {
            entities: [
                this
            ],
        });
    }



    async save() {
        await this.call(A_TYPES__EntityBaseMethod.SAVE, {
            entities: [
                this
            ]
        });
    }



    // ====================================================================
    // ================== Entity Serialization ============================
    // ====================================================================

    fromNew(newEntity: _ConstructorType): void {
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