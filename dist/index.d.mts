declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES: {
    /**
     * Name of the application
     *
     * DEFAULT value is 'a-concept'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_NAME: "A_CONCEPT_NAME";
    /**
     * Root scope of the application
     *
     * DEFAULT value is 'root'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_ROOT_SCOPE: "A_CONCEPT_ROOT_SCOPE";
    /**
     * Environment of the application e.g. development, production, staging
     */
    readonly A_CONCEPT_ENVIRONMENT: "A_CONCEPT_ENVIRONMENT";
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    readonly A_CONCEPT_ROOT_FOLDER: "A_CONCEPT_ROOT_FOLDER";
    /**
     * Allows to define a default error description for errors thrown without a description
     */
    readonly A_ERROR_DEFAULT_DESCRIPTION: "A_ERROR_DEFAULT_DESCRIPTION";
};
type A_TYPES__ConceptENVVariables = (typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES][];
declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_NAME", "A_CONCEPT_ROOT_SCOPE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "A_ERROR_DEFAULT_DESCRIPTION"];

type Decrement = [never, 0, 1, 2, 3, 4, 5];
type A_TYPES__DeepPartial<T, D extends number = 5> = {
    [P in keyof Required<T>]?: [
        D
    ] extends [never] ? any : Required<T>[P] extends Array<infer U> ? Array<A_TYPES__DeepPartial<U, Decrement[D]>> : Required<T>[P] extends Function ? Required<T>[P] : Required<T>[P] extends object ? A_TYPES__DeepPartial<T[P], Decrement[D]> : T[P];
};
type A_TYPES__ObjectKeyEnum<T, E> = {
    [P in keyof Required<T>]?: T[P] extends object ? A_TYPES__ObjectKeyEnum<T[P], E> : E;
};
type A_TYPES__Dictionary<T> = {
    [Key: string]: T;
};
type A_TYPES__NonObjectPaths<T> = T extends object ? {
    [K in keyof T]: `${Exclude<K, symbol>}${""}`;
}[keyof T] : never;
type A_TYPES__Paths<T, D extends number = 5> = [D] extends [never] ? never : (T extends object ? {
    [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${A_TYPES__Paths<T[K], Decrement[D]>}`}`;
}[keyof T] : never);
type A_TYPES__UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;
type A_TYPES__PathsToObject<_Obj, T extends readonly string[]> = A_TYPES__UnionToIntersection<{
    [K in keyof T]: T[K] extends `${infer Key}.${infer Rest}` ? {
        [P in Key]: P extends keyof _Obj ? A_TYPES__PathsToObject<Required<_Obj>[P], [Rest]> : any;
    } : {
        [P in T[K]]: `${T[K]}` extends keyof Required<_Obj> ? Required<_Obj>[`${T[K]}`] : never;
    };
}[number]>;
type A_TYPES__Required<T, arr extends (A_TYPES__Paths<T>)[] = (A_TYPES__Paths<T>)[]> = A_TYPES__PathsToObject<T, arr> & T;
type A_TYPES__ExtractNested<T, P extends string> = P extends `${infer K}.${infer Rest}` ? K extends keyof T ? {
    [Key in K]: A_TYPES__ExtractNested<T[K], Rest>;
} : never : P extends keyof T ? {
    [Key in P]: T[P];
} : never;
type A_TYPES__ExtractProperties<T, P extends A_TYPES__Paths<T>[]> = A_TYPES__UnionToIntersection<{
    [K in keyof P]: P[K] extends string ? A_TYPES__ExtractNested<T, P[K]> : never;
}[number]>;

/**
 * A Meta is an entity that stores all the metadata for the specific entity like container, component, feature, etc.
 *
 * [!] Meta can be different depending on the type of input data
 */
declare class A_Meta<_StorageItems extends Record<string, any> = any, _SerializedType extends Record<string, any> = Record<string, any>> implements Iterable<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]> {
    protected meta: Map<keyof _StorageItems, _StorageItems[keyof _StorageItems]>;
    /**
     * Method to get the iterator for the meta object
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Allows to replicate received meta object by replacing internal meta to the received one
     *
     * @param meta
     * @returns
     */
    from(meta: A_Meta<_StorageItems>): A_Meta<_StorageItems>;
    /**
     * Method to set values in the map
     *
     * @param key
     * @param value
     */
    set<K extends keyof _StorageItems>(key: K, value: _StorageItems[K]): void;
    /**
     * Method to get values from the map
     *
     * @param key
     * @returns
     */
    get<K extends keyof _StorageItems>(key: K): _StorageItems[K] | undefined;
    /**
     * Method to delete values from the map
     *
     * @param key
     * @returns
     */
    delete(key: keyof _StorageItems): boolean;
    /**
     * Method to get the size of the map
     *
     * @returns
     */
    size(): number;
    /**
     * This method is needed to convert the key to a regular expression and cover cases like:
     *
     * simple * e.g. "a*" instead of "a.*"
     *
     * simple ? e.g. "a?" instead of "a."
     *
     * etc.
     *
     * @param key
     * @returns
     */
    private convertToRegExp;
    /**
     * Method to find values in the map by name.
     *
     * Converts the Key in Map to a regular expression and then compares to the name
     *
     * @param name
     * @returns
     */
    find(name: string): [keyof _StorageItems, _StorageItems[keyof _StorageItems]][];
    /**
     * Method to find values in the map by regular expression
     *
     * Compares Map Key to the input regular expression
     *
     * @param regex
     * @returns
     */
    findByRegex(regex: RegExp): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Method to check if the map has a specific key
     *
     * @param key
     * @returns
     */
    has(key: keyof _StorageItems): boolean;
    /**
     * Method to get the size of the map
     *
     * @returns
     */
    entries(): IterableIterator<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    /**
     * Method to clear the map
     */
    clear(): void;
    toArray(): Array<[keyof _StorageItems, _StorageItems[keyof _StorageItems]]>;
    protected recursiveToJSON(value: any): any;
    /**
     * Serializes the meta to a JSON object
     * Uses internal storage to convert to JSON
     *
     * @returns
     */
    toJSON(): _SerializedType;
}

declare enum A_TYPES__ContainerMetaKey {
    FEATURES = "a-container-features",
    INJECTIONS = "a-container-injections",
    ABSTRACTIONS = "a-container-abstractions",
    EXTENSIONS = "a-container-extensions"
}

declare enum A_TYPES__A_Stage_Status {
    /**
     * The stage is currently being processed
     */
    PROCESSING = "PROCESSING",
    /**
     * The stage has been completed
     */
    COMPLETED = "COMPLETED",
    /**
     * The stage has failed
     */
    FAILED = "FAILED",
    /**
     * The stage has been skipped
     */
    SKIPPED = "SKIPPED",
    /**
     * The stage has been paused
     */
    /**
     * The stage has been stopped
     */
    /**
     * The stage has been started
     */
    /**
     * The stage has been initialized
     */
    INITIALIZED = "INITIALIZED",
    /**
     * The stage has been aborted
     */
    ABORTED = "ABORTED"
}
type A_TYPES_StageExecutionBehavior = 'async' | 'sync';
type A_TYPES__A_StageStep = {
    /**
     * The component to be called
     */
    component: A_TYPES__Component_Constructor | A_Container | string;
    /**
     * The method to be called on the component
     */
    handler: string;
    /**
     * Original Feature Extension name
     *
     * [!] could be string or regex
     *
     */
    name: string;
    /**
     * In case its async it will be executed independently from the main thread.
     *
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     *
     */
    behavior: A_TYPES_StageExecutionBehavior;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    before: string;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    after: string;
    /**
     * Indicates whether to throw an error if the step fails.
     *
     * [!] By default is true
     */
    throwOnError: boolean;
    /**
     *
     */
    override: string;
};
type A_TYPES__Stage_Serialized = {
    /**
     * The name of the stage
     */
    name: string;
    /**
     *  The status of the stage
     *
     */
    status: A_TYPES__A_Stage_Status;
};
type A_TYPES__A_StageStepProcessingExtraParams = {
    steps: A_TYPES__A_StageStep[];
    filter: (step: A_TYPES__A_StageStep) => boolean;
};

interface A_TYPES__ASEID_Constructor {
    /**
     * Concept for the ASEID
     * Generally it is the application name or code, should correspond to the concept where the entity is used
     * Could be ID or ASEID
     */
    concept?: string;
    /**
     * Entity Scope the primary location of the resource
     * Organization, or organization Unit or Internal/External
     * Could be ID or ASEID
     *
     */
    scope: number | string;
    /**
     * Entity Type the type of the resource
     */
    entity: string;
    /**
     * Entity ID the unique identifier of the resource
     */
    id: number | string;
    /**
     * Version of the entity (optional)
     */
    version?: string;
    /**
     * Shard of the entity (optional)
     */
    shard?: string;
}
interface A_TYPES__ASEID_ConstructorConfig {
    /**
     * If true, the entity ASEID will be distributed across multiple shards.
     * In this case SHARD should be provided via Environment Variables (A_SHARD) or Configurations
     *
     */
    sharding?: boolean;
}
type A_TYPES__ASEID_JSON = {
    /**
     * Concept for the ASEID
     */
    concept: string;
    /**
     * Entity Scope the primary location of the resource
     */
    scope: string;
    /**
     * Entity Type the type of the resource
     */
    entity: string;
    /**
     * Entity ID the unique identifier of the resource
     */
    id: string;
    /**
     * Version of the entity (optional)
     */
    version?: string;
    /**
     * Shard of the entity (optional)
     */
    shard?: string;
};

declare class ASEID {
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

declare enum A_TYPES__EntityMetaKey {
    EXTENSIONS = "a-component-extensions",
    FEATURES = "a-component-features",
    ABSTRACTIONS = "a-component-abstractions",
    INJECTIONS = "a-component-injections"
}

/**
 * Entity interface
 */
interface A_TYPES__IEntity {
    /**
     * The ASEID of the entity
     */
    aseid: ASEID;
}
/**
 * Entity constructor type
 * Uses the generic type T to specify the type of the entity
 */
type A_TYPES__Entity_Constructor<T = A_Entity> = new (...args: any[]) => T;
/**
 * Entity initialization type
 */
type A_TYPES__Entity_Init = any;
/**
 * Entity serialized type
 */
type A_TYPES__Entity_Serialized = {
    /**
     * The ASEID of the entity
     */
    aseid: string;
};
/**
 * Entity meta type
 */
type A_TYPES__EntityMeta = {
    [A_TYPES__EntityMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[];
    }>;
    case: any;
    [A_TYPES__EntityMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta;
    }>;
    /**
     * Injections defined on the component per handler
     */
    [A_TYPES__EntityMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta;
    }>;
};

/**
 * A_Entity is another abstraction that describes all major participants in the system business logic.
 * Each Entity should have a clear definition and a clear set of responsibilities.
 * However, entity may hide some of its responsibilities behind the interface to prevent overload.
 *
 * Each entity should be connected to the ContextFragment (Scope) and should be able to communicate with other entities.
 */
declare class A_Entity<_ConstructorType extends A_TYPES__Entity_Init = A_TYPES__Entity_Init, _SerializedType extends A_TYPES__Entity_Serialized = A_TYPES__Entity_Serialized> implements A_TYPES__IEntity {
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
    call(feature: string, scope?: A_Scope): any;
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

/**
 * A-Feature decorator
 *
 * This decorator allows to define a custom lifecycle stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Feature and A-Feature decorators is that A-Feature methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
declare function A_Feature_Define(config?: Partial<A_TYPES__FeatureDefineDecoratorConfig>): (target: A_TYPES__FeatureDefineDecoratorTarget, propertyKey: string, descriptor: A_TYPES__FeatureDefineDecoratorDescriptor) => A_TYPES__FeatureDefineDecoratorDescriptor;

/**
 * A-Extend decorator
 *
 * This decorator allows to define a custom Extend stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Extend and A-Extend decorators is that A-Extend methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
/**
 * Use regexp in case if you need more flexibility and control over the name of the method
 *
 * @param regexp
 */
declare function A_Feature_Extend(
/**
 * The regular expression to match the name of the Feature method to be extended
 *
 * Example:
 *
 * ```ts
 *  @A_Feature.Extend(/.*\.load/)
 * ```
 */
regexp: RegExp): any;
/**
 * In this case the name configurations will be used as an input to get scope and name of target function
 * [!] Not that for all SCOPE will be used OR operator
 *
 * @param config
 */
declare function A_Feature_Extend(
/**
 * Configuration for the A-Feature-Extend decorator
 */
config: Partial<A_TYPES__FeatureExtendDecoratorConfig>): any;
/**
 * In this case the name of function will be used as a name of the Feature.
 * [!] AND it will be applicable for ANY element where the name is the same as the name of the function
 */
declare function A_Feature_Extend(): any;

/**
 * Entity constructor type
 * Uses the generic type T to specify the type of the entity
 */
type A_TYPES__Error_Constructor<T = A_Error> = new (...args: any[]) => T;
/**
 * Error initialization type
 */
type A_TYPES__Error_Init = {
    /**
     * Error title
     *
     * A short description of the error
     */
    title: string;
    /**
     * Error code representing the type of error
     *
     * Should be unique within the application or service
     *
     * Example: 'validation-error', 'not-found', 'user-not-found', 'unauthorized' etc.
     *
     * [!] Note: It is recommended to use kebab-case for error codes
     * [!] Note: If not provided would be used a kebab-case message of the error
     */
    code?: string;
    /**
     * Possible Scope if needed to identify the error by it's execution environment
     *
     * For example, error of type 'validation' could happen in different scopes
     * like 'user', 'admin', 'system' etc. This will help to identify the error context better
     *
     * Could be string or A_Scope instance
     *
     * [!] Note: If not provided, the default scope of the A_Error will be used (A_Context.root.name)
     */
    scope?: string | A_Scope;
    /**
     * Detailed description of the error
     */
    description?: string;
    /**
     * Link to the documentation or support page for the error
     */
    link?: string;
    /**
     * Original Error if any
     */
    originalError?: Error | unknown;
};
/**
 * Error serialized type
 */
type A_TYPES__Error_Serialized = {
    /**
     * ASEID of the error
     */
    aseid: string;
    /**
     * A brief title of the error
     */
    title: string;
    /**
     * Error message
     */
    message: string;
    /**
     * Type of the error
     */
    type: string;
    /**
     * Error code
     */
    code: string;
    /**
     * Error description
     */
    description: string;
    /**
     * Link to documentation or support page
     */
    link?: string;
    /**
     * Scope of the error
     */
    scope: string;
    /**
     * Original error message if any
     */
    originalError?: string;
};

declare class A_Error<_ConstructorType extends A_TYPES__Error_Init = A_TYPES__Error_Init, _SerializedType extends A_TYPES__Error_Serialized = A_TYPES__Error_Serialized> extends Error {
    /**
     * Error Identifier that corresponds to the class name
     */
    static get entity(): string;
    /**
     * DEFAULT Namespace of the error from environment variable A_CONCEPT_NAMESPACE
     *
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept(): string;
    /**
     * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
     *
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string;
    /**
     * ASEID of the error instance
     */
    protected _aseid: ASEID;
    /**
     * Title of the error
     */
    protected _title: string;
    /**
     * Possible Scope if needed to identify the error by it's execution environment
     */
    protected _scope?: string;
    /**
     * Unique code representing the type of error
     */
    protected _code?: string;
    /**
     * Detailed description of the error
     */
    protected _description?: string;
    /**
     * Original Error if any
     */
    protected _originalError?: Error | any;
    /**
     * Link to the documentation or support page for the error
     */
    protected _link?: string;
    /**
     * A_Error is a custom error class for A_Concept framework.
     * This error allows to have more structured error handling.
     * Each error has a unique code, description and a link to the documentation.
     *
     * Example of usage:
     * ```typescript
     *
     * // 1) all parameters will be used as provided
     * throw new A_Error({
     *    message: 'User not found',
     *    code: 'USER_NOT_FOUND',
     *    description: 'The user with the given ID was not found.',
     *    link: 'https://support.adaas.org/error/USER_NOT_FOUND'
     * });
     *
     * // or
     * // 2) only message is provided, other parameters will be set to default values:
     * //     - code: 'user-not-found' (kebab-case of the message)
     * //     - description: 'User not found' (same as message)
     * //     - link: Empty
     * throw new A_Error('User not found');
     *
     * // or
     * // 3) Provided Message and Description, other parameters will be set to default values:
     * //     - code: 'user-not-found' (kebab-case of the message)
     * //     - description: 'The user with the given ID was not found.' (as provided)
     * //     - link: Empty
     * throw new A_Error('User not found', 'The user with the given ID was not found.');
     *
     *
     * ```
     * [!] Note: The behavior of A_Error is similar to the A_Entity however it cannot have own A_Features.
     * [!] Note: This class can be inherited to create custom error classes.
     *
     * @param message
     */
    constructor(
    /**
     * A_Error Constructor params
     */
    params: _ConstructorType);
    constructor(
    /**
     * Error message
     */
    message: string);
    constructor(
    /**
     * Original JS Error
     */
    error: Error);
    constructor(
    /**
     * Error message
     */
    title: string, 
    /**
     * Detailed description of the error
     */
    description: string);
    /**
     * Returns the ASEID of the error instance
     */
    get aseid(): ASEID;
    /**
     * Returns the title of the error
     *
     * Example: 'User not found', 'Validation error', 'Unauthorized access', etc.
     *
     * [!] Note: This title should be short and concise, less than 60 characters
     * [!] Note: If title exceeds 60 characters, there would be an error thrown
     * [!] Note: This title is intended to be human-readable and can be displayed in UI or logs
     */
    get title(): string;
    /**
     * Returns an Error message what is a brief title of the error
     *
     */
    get message(): string;
    /**
     * Returns a unique code representing the type of error
     *
     * If code is not provided, it will generate a kebab-case of the message
     *
     * Example: 'validation-error', 'not-found', 'user-not-found', 'unauthorized' etc.
     *
     * [!] Note: It is recommended to use kebab-case for error codes
     * [!] Note: If not provided would be used a kebab-case message of the error
     */
    get code(): string;
    /**
     * Returns the type of the error which corresponds to the static entity of the class
     *
     * Example: 'a-error', 'validation-error', 'not-found-error', 'user-error', etc.
     *
     * Defaults to the kebab-case of the class name
     *
     * [!] Note: naming ad separation are fully dependent on the architecture of the application
     * [!] Note: It is recommended to use kebab-case for error types
     * [!] Note: This type is intended to group similar errors together
     */
    get type(): string;
    /**
     * Returns a link with possible documentation or support page for the error
     * If link is not provided, it will generate a link based on the ASEID of the error that points to the A-Concept support page
     *
     * Example: https://adaas.support/a-concept/errors/{ASEID}
     *
     * [!] Note: ASEID is generated based on the static properties of the class (concept, scope, entity) and the code of the error
     */
    get link(): string;
    /**
     * The scope name of the error instance
     *
     * If scope is not provided, it will use the static scope of the class
     *
     * [!] Note: Scope is an application specific identifier that can be used to group entities together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    get scope(): string;
    /**
     * A detailed description of the error
     * If description is not provided, it will use the environment variable A_ERROR_DEFAULT_DESCRIPTION or a generic message
     *
     * Example: 'The user with the given ID was not found.', 'The provided data is invalid.', 'You do not have permission to access this resource.', etc.
     *
     * [!] Note: This description is intended to provide more context about the error and can be used for debugging or logging purposes
     */
    get description(): string;
    /**
     * Returns the original error if any
     *
     * This can be useful for debugging purposes to see the original stack trace or error message
     *
     * [!] Note: Original error is optional and may not be present in all cases
     */
    get originalError(): Error | any | undefined;
    /**
     * Determines which initializer method to use based on the type of the first parameter.
     *
     * @param param1
     * @returns
     */
    protected getInitializer(param1: _ConstructorType | Error | string | any, param2?: string): (param1: any, param2: any) => void | (() => void);
    /**
     * Initializes the A_Error instance from a standard Error object.
     *
     * @param error
     */
    protected fromError(error: Error): void;
    /**
     * Initializes the A_Error instance from a message.
     *
     * @param title
     * @param description
     */
    protected fromMessage(message: string): void;
    /**
     * Initializes the A_Error instance from a serialized object.
     *
     * @param serialized
     */
    protected fromJSON(serialized: _SerializedType): void;
    fromTitle(title: string, description: string): void;
    /**
     * Initializes the A_Error instance from a constructor parameters object.
     *
     * @param params
     */
    protected fromConstructor(params: _ConstructorType): void;
    /**
     * Serializes the A_Error instance to a plain object.
     *
     *
     * @returns
     */
    toJSON(): _SerializedType;
    /**
     * Checks if the provided title exceeds 60 characters.
     * If it does, throws a validation A_Error.
     *
     * @param title
     */
    protected validateTitle(title: string): void;
}

declare class A_Stage {
    /**
     * The feature that owns this stage
     */
    private readonly _feature;
    /**
     * Initial Instructions to process the stage
     */
    private readonly _definition;
    /**
     * Possible errors during stage processing
     */
    private _error?;
    /**
     * Indicates the current status of the stage
     */
    private _status;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    private _processed;
    /**
     * A_Stage is a callable A_Function within A_Feature that should be run with specific parameters.
     * [!] Depending on the Stage Definition type sync/async function can be executed correspondingly.
     *
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
     */
    constructor(
    /**
     * The feature that owns this stage
     */
    feature: A_Feature, 
    /**
     * The step definitions of the stage
     */
    step: A_TYPES__A_StageStep);
    /**
     * Returns the name of the stage
     */
    get name(): string;
    /**
     * Returns the definition of the stage
     */
    get definition(): A_TYPES__A_StageStep;
    /**
     * Returns the current status of the stage
     */
    get status(): A_TYPES__A_Stage_Status;
    /**
     * Returns the feature that owns this stage
     */
    get feature(): A_Feature;
    /**
     * Returns true if the stage is processed (completed, failed, or skipped)
     */
    get isProcessed(): boolean;
    /**
     * Returns the error of the stage
     */
    get error(): A_Error | undefined;
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    protected getStepArgs(scope: A_Scope, step: A_TYPES__A_StageStep): Promise<(A_Container | A_Component | A_Entity<any, A_TYPES__Entity_Serialized> | A_Scope<any, A_TYPES__Component_Constructor[], A_TYPES__Error_Constructor[], A_TYPES__Entity_Constructor[], A_Fragment<A_TYPES__Fragment_Serialized>[]> | A_Feature<A_TYPES__FeatureAvailableComponents> | A_Fragment<A_TYPES__Fragment_Serialized> | A_Error<A_TYPES__Error_Init, A_TYPES__Error_Serialized> | A_TYPES__ScopeResolvableComponents[] | undefined)[]>;
    /**
     * Resolves the component of the step
     *
     * @param step
     * @returns
     */
    protected getStepComponent(scope: A_Scope, step: A_TYPES__A_StageStep): A_TYPES__ScopeResolvableComponents;
    /**
     * Calls the handler of the step
     *
     * @param step
     * @returns
     */
    protected callStepHandler(step: A_TYPES__A_StageStep, scope: A_Scope): Promise<any>;
    skip(): void;
    /**
     * This method processes the stage by executing all the steps
     *
     * @param scope - Scope to be used to resolve the steps dependencies
     */
    process(
    /**
     * Scope to be used to resolve the steps dependencies
     */
    scope?: A_Scope): Promise<void>;
    protected completed(): void;
    protected failed(error: Error | A_Error | any): void;
    /**
     * Serializes the stage to JSON
     *
     */
    toJSON(): A_TYPES__Stage_Serialized;
    /**
     * Returns a string representation of the stage
     *
     * @returns
     */
    toString(): string;
}

declare class A_StepsManager {
    entities: A_TYPES__A_StageStep[];
    graph: Map<string, Set<string>>;
    visited: Set<string>;
    tempMark: Set<string>;
    sortedEntities: string[];
    private _isBuilt;
    constructor(entities: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>);
    private prepareSteps;
    private ID;
    private buildGraph;
    private matchEntities;
    private visit;
    toSortedArray(): Array<string>;
    toStages(feature: A_Feature): Array<A_Stage>;
}

declare class A_StageError extends A_Error {
    static readonly ArgumentsResolutionError = "A-Stage Arguments Resolution Error";
    static get CompileError(): string;
}

declare class A_FeatureError extends A_Error<A_TYPES__FeatureError_Init> {
    /**
     * Indicates that the Feature has been interrupted
     */
    static readonly Interruption = "Feature Interrupted";
    /**
     * Indicates that there was an error initializing the Feature
     *
     * Failed during the A-Feature initialization process
     */
    static readonly FeatureInitializationError = "Unable to initialize A-Feature";
    /**
     * Indicates that there was an error processing the Feature
     *
     * Failed during the A-Feature processing
     */
    static readonly FeatureProcessingError = "Error occurred during A-Feature processing";
    /**
     * Indicates that there was an error defining the Feature
     *
     * Failed during the @A_Feature.Define() decorator execution
     */
    static readonly FeatureDefinitionError = "Unable to define A-Feature";
    /**
     * Indicates that there was an error extending the Feature
     *
     * Failed during the @A_Feature.Extend() decorator execution
     */
    static readonly FeatureExtensionError = "Unable to extend A-Feature";
    /**
     * Stage where the error occurred
     */
    stage?: A_Stage;
    protected fromConstructor(params: A_TYPES__FeatureError_Init): void;
}

/**
 * This is a common class that uses to return an entity that initiates a feature call
 *
 * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
 *
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 *
 */
declare class A_Caller<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {
    /**
     * The component that initiated the feature call
     */
    protected _component: T;
    /**
     * A_Caller allows to get the component that initiated the feature call
     *
     * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
     *
     * [!] If Scope is not provided, a new empty scope will be created and inherited from the global scope
     *
     * @param component
     * @param scope
     */
    constructor(component: T);
    get component(): T;
    /**
     * Validates the provided parameters and Ensures that the component is of an allowed type
     *
     * @param component
     */
    protected validateParams(component: T): void;
}

/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 *
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods
 * across the different, distributed components
 *
 */
declare class A_Feature<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> {
    /**
     * Define a new A-Feature
     */
    static get Define(): typeof A_Feature_Define;
    /**
     * Extend an existing A-Feature
     */
    static get Extend(): typeof A_Feature_Extend;
    /**
     * The name of the Feature
     */
    protected _name: string;
    /**
     * List of stages that are part of this Feature
     */
    protected _stages: Array<A_Stage>;
    /**
     * The Stage currently being processed
     */
    protected _current?: A_Stage;
    /**
     * Actual Index of the current Stage being processed
     */
    protected _index: number;
    /**
     * Steps Manager to organize the steps into stages
     */
    protected _SM: A_StepsManager;
    /**
     * The Caller that initiated the Feature call
     */
    protected _caller: A_Caller<T>;
    /**
     * The current state of the Feature
     */
    protected _state: A_TYPES__FeatureState;
    /**
     * The error that caused the Feature to be interrupted
     */
    protected _error?: A_FeatureError;
    /**
     * A-Feature is a pipeline distributed by multiple components that can be easily attached or detached from the scope.
     * Feature itself does not have scope, but attached to the caller who dictates how feature should be processed.
     *
     * Comparing to A-Command Feature does not store any state except statuses for better analysis.
     *
     * [!] Note: If A-Feature should have result use A-Fragment
     *
     * @param params
     */
    constructor(
    /**
     * Feature Initialization parameters
     */
    params: A_TYPES__Feature_Init<T>);
    /**
     * The name of the Feature
     */
    get name(): string;
    /**
     * The error that caused the Feature to be interrupted
     */
    get error(): A_FeatureError | undefined;
    /**
     * The current state of the Feature
     */
    get state(): A_TYPES__FeatureState;
    /**
     * Sets the current state of the Feature
     */
    get index(): number;
    /**
     * Returns the current A-Feature Stage
     */
    get stage(): A_Stage | undefined;
    /**
     * The Caller that initiated the Feature call
     */
    get caller(): A_Caller<T>;
    /**
     * The Scope allocated for the Feature Execution
     */
    get scope(): A_Scope;
    /**
     * The number of stages in the feature
     */
    get size(): number;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone(): boolean;
    /**
     * Indicates whether the feature has been processed (completed, failed, or interrupted)
     */
    get isProcessed(): boolean;
    /**
     * Iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator](): Iterator<A_Stage, any>;
    /**
     * Validates the provided parameters for A-Feature initialization
     *
     * @param params
     */
    protected validateParams(params: A_TYPES__Feature_Init<T>): void;
    /**
     * Returns the appropriate initializer method based on the provided parameters
     *
     * @param params
     * @returns
     */
    protected getInitializer(params: A_TYPES__Feature_Init<T>): (param1: any) => void | (() => void);
    /**
     * Initializes the A-Feature from the provided template
     *
     * @param params
     */
    protected fromTemplate(params: A_TYPES__Feature_InitWithTemplate<T>): void;
    /**
     * Initializes the A-Feature from the provided component
     *
     * @param params
     */
    protected fromComponent(params: A_TYPES__Feature_InitWithComponent<T>): void;
    /**
     * This method processes the feature by executing all the stages
     *
     */
    process(
    /**
     * Optional scope to be used to resolve the steps dependencies
     * If not provided, the scope of the caller component will be used
     */
    scope?: A_Scope): Promise<void>;
    /**
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage: any): void;
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * @param result
     * @returns
     */
    completed(): Promise<void>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to mark the feature as failed
     *
     * @param error
     */
    failed(error: A_FeatureError): Promise<void>;
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    interrupt(
    /**
     * The reason of feature interruption
     */
    reason?: string | A_StageError | Error): Promise<void>;
    toString(): string;
}

/**
 * Feature constructor type
 * Uses the generic type T to specify the type of the feature
 */
type A_TYPES__Feature_Constructor<T = A_Feature> = new (...args: any[]) => T;
/**
 * Feature initialization type
 */
type A_TYPES__Feature_Init<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = A_TYPES__Feature_InitWithComponent<T> | A_TYPES__Feature_InitWithTemplate<T>;
/**
 * Feature initialization type using component
 */
type A_TYPES__Feature_InitWithComponent<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = {
    /**
     * Feature Name
     */
    name: string;
    /**
     * The component from where the feature is calling. It's important for proper scoping.
     * Based on the component would be retrieved connected components, entities and containers.
     *
     * [!] Could be Container, Entity, Component or Command
     */
    component: T;
    /**
     * In case when Entity is not attached to the scope can be used to transparently show dependencies
     *
     *
     */
    scope?: A_Scope;
};
/**
 * Feature initialization type using template
 */
type A_TYPES__Feature_InitWithTemplate<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = {
    /**
     * Feature Name
     */
    name: string;
    /**
     * The scope from where to retrieve dependent components, entities and containers.
     *
     * [!] Important for proper scoping.
     */
    scope: A_Scope;
    /**
     * The component from where the feature is calling. It's important for proper scoping.
     * Based on the component would be retrieved connected components, entities and containers.
     *
     * [!] Could be Container, Entity, Component or Command
     */
    component?: T;
    /**
     * Optional Feature template to be used instead of building it from decorators
     */
    template: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>;
};
/**
 * Feature serialized type
 */
type A_TYPES__Feature_Serialized = {};
/**
 * Feature lifecycle states
 */
declare enum A_TYPES__FeatureState {
    /**
     * The feature has been initialized
     */
    INITIALIZED = "INITIALIZED",
    /**
     * The feature is currently being processed
     */
    PROCESSING = "PROCESSING",
    /**
     * The feature has been completed
     */
    COMPLETED = "COMPLETED",
    /**
     * The feature has been interrupted
     */
    INTERRUPTED = "INTERRUPTED",
    /**
     * The feature has failed
     */
    FAILED = "FAILED"
}
type A_TYPES__FeatureError_Init = {
    /**
     * Stage where the error occurred
     */
    stage?: A_Stage;
} & A_TYPES__Error_Init;
/**
 * A list of component where features can be Defined
 *
 * [!] On this component Feature Definition is Available
 */
type A_TYPES__FeatureAvailableComponents = InstanceType<A_TYPES__FeatureAvailableConstructors>;
/**
 * A list of constructors where features can be Defined
 *
 * [!] On this component Feature Definition is Available
 */
type A_TYPES__FeatureAvailableConstructors = A_TYPES__Component_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Container_Constructor;
/**
 * Indicates a type of Feature Define decorator
 */
type A_TYPES__FeatureDefineDecoratorDescriptor = TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>;
/**
 * Describes additional configuration properties to be used in Feature Define decorator
 */
type A_TYPES__FeatureDefineDecoratorConfig = {
    /**
     * Feature name
     *
     * [!] By default uses the method name
     */
    name: string;
    /**
     * Indicates a default behavior of the feature. If true the feature will be automatically attached to the execution.
     *
     * [!] Before feature execution the method itself will be called to prepare the feature template
     * [!] Default is false
     */
    invoke: boolean;
    /**
     * Allows to add a default behavior or number of steps that will be part of the feature
     */
    template: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>;
};
/**
 * Describes a single template item used in Feature Define decorator
 */
type A_TYPES__FeatureDefineDecoratorTemplateItem = A_TYPES__Required<Partial<A_TYPES__A_StageStep>, ['name', 'handler', 'component']>;
/**
 * Describes a target where Feature Define decorator can be applied
 *
 * [!] The feature can be defined on Container, Entity, Component or Command
 */
type A_TYPES__FeatureDefineDecoratorTarget = A_Container | A_Entity | A_Component;
/**
 * A type of Meta information stored by Feature Define decorator
 * This information then uses by A-Context to build a proper feature template
 */
type A_TYPES__FeatureDefineDecoratorMeta = {
    /**
     * Feature name
     * mainly it's a unique combination of the class name and method name
     */
    name: string;
    /**
     * Actual method name in the class
     */
    handler: string;
    /**
     * Indicates a default behavior of the feature. If true the feature will be automatically attached to the execution.
     *
     * [!] Before feature execution the method itself will be called to prepare the feature template
     * [!] Default is false
     */
    invoke: boolean;
    /**
     * Allows to add a default behavior or number of steps that will be part of the feature
     */
    template: Array<A_TYPES__A_StageStep>;
};
/**
 * Descriptor type for A_Extend decorator
 */
type A_TYPES__FeatureExtendDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
/**
 * Target type for A_Extend decorator
 *
 * [!] Can be applied only on A-Components
 */
type A_TYPES__FeatureExtendDecoratorTarget = A_Component | A_Container | A_Entity;
/**
 * Configuration type for A_Extend decorator
 *
 * This is an INPUT parameter provided by the user
 */
type A_TYPES__FeatureExtendDecoratorConfig = {
    /**
     * Name of the container Lifecycle method to be extended.
     *
     * [!] If not provided will be used the name of the method.
     * [!!] If name contains "." dot it will be considered as a path to the method.
     */
    name: string;
    /**
     * Container class or container name uses to identify the proper container in case when the name is not unique.
     *
     * [!] If not provided will be applied to all containers with the same name.
     * [!!] By default uses OR to join all provided items. If you need more complex Logic, please use Regexp instead
     *
     * [!!!] In case if you need to exclude some containers, entities or components, please use "exclude" property
     *
     * Example:
     *
     * ```ts
     *  @A_Feature.Extend({
     *      name: 'load',
     *      scope: {
     *          include: [A_Container1, A_Entity1],
     *          exclude: [A_Component1]
     *      }
     *  })
     * ```
     */
    scope: Array<A_TYPES__FeatureExtendDecoratorScopeItem> | Partial<A_TYPES__FeatureExtendDecoratorScopeConfig>;
    /**
     * The behavior of the method.
     * In case its async it will be executed independently from the main thread.
     *
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     *
     */
    behavior: A_TYPES_StageExecutionBehavior;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] It applies for the following structure :'Component.methodName'
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     * Example:
     * ```ts
     *  @A_Feature.Extend({
     *      name: 'load',
     *      before: ['Component1.methodName', 'Component2.methodName2']
     *  })
     *  // OR
     *  @A_Feature.Extend({
     *      name: 'load',
     *      before: /Component2\..+/
     *  })
     * ```
     */
    before: Array<string> | RegExp;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] It applies for the following structure :'Component.methodName'
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     * Example:
     * ```ts
     *  @A_Feature.Extend({
     *      name: 'load',
     *      after: ['Component1.methodName', 'Component2.methodName2']
     *  })
     *  // OR
     *  @A_Feature.Extend({
     *      name: 'load',
     *      after: /Component2\..+/
     *  })
     * ```
     *
     */
    after: Array<string> | RegExp;
    /**
     * Indicates whether to throw an error if the step fails.
     *
     * [!] By default is true
     */
    throwOnError: boolean;
    /**
     * Allows to override particular steps in the feature sequence by provided names [Component].[Method] or by regexp
     */
    override: Array<string> | RegExp;
};
/**
 * Scope item that can be used in A_Extend decorator configuration
 */
type A_TYPES__FeatureExtendDecoratorScopeConfig = {
    /**
     * A list of components, entities or containers to include in the scope of the extension
     */
    include?: Array<A_TYPES__FeatureExtendDecoratorScopeItem>;
    /**
     * A list of components, entities or containers to exclude from the scope of the extension
     */
    exclude?: Array<A_TYPES__FeatureExtendDecoratorScopeItem>;
};
/**
 * A single item that can be used in scope configuration
 */
type A_TYPES__FeatureExtendDecoratorScopeItem = A_TYPES__Container_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Component_Constructor;
/**
 * Meta type for A_Extend decorator
 */
type A_TYPES__FeatureExtendDecoratorMeta = {
    /**
     * Original Feature Extension name
     *
     * [!] could be string or regex
     */
    name: string;
    /**
     * Actual method name in the class
     */
    handler: string;
    /**
     * The behavior of the method.
     * In case its async it will be executed independently from the main thread.
     *
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     *
     */
    behavior: A_TYPES_StageExecutionBehavior;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    before: string;
    /**
     * Allows to define the order of the execution of the method.
     *
     * [!] In case the method has circular dependencies it will Throw an error.
     *
     */
    after: string;
    /**
     * Indicates whether to throw an error if the step fails.
     *
     * [!] By default is true
     */
    throwOnError: boolean;
    /**
     * Allows to override particular steps in the feature sequence by provided names [Component].[Method] or by regexp
     */
    override: string;
};

/**
 * Container constructor type
 * Uses the generic type T to specify the type of the container
 */
type A_TYPES__Container_Constructor<T = A_Container> = new (...args: any[]) => T;
/**
 * Container initialization type
 */
type A_TYPES__Container_Init = {
    /**
     * The extra name for the container (optional)
     */
    name?: string;
} & A_TYPES__Scope_Init;
/**
 * Container serialized type
 */
type A_TYPES__Container_Serialized = {
    /**
     * The ASEID of the container
     */
    aseid: string;
};
/**
 * Meta information stored in each Container
 */
type A_TYPES__ContainerMeta = {
    /**
     * Extensions applied to the component per handler
     */
    [A_TYPES__ContainerMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[];
    }>;
    [A_TYPES__ContainerMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta;
    }>;
    [A_TYPES__ContainerMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__ConceptAbstraction[];
    }>;
    [A_TYPES__ContainerMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta;
    }>;
};
type A_TYPES__ContainerMetaExtension = A_TYPES__FeatureExtendDecoratorMeta;

declare class A_Container {
    /**
     * Configuration of the container that will be used to run it.
     */
    protected readonly config: Partial<A_TYPES__Container_Init>;
    /**
     * Name of the container
     */
    get name(): string;
    /**
     * Returns the scope where the container is registered
     */
    get scope(): A_Scope;
    /**
     * This class should combine Components to achieve the goal withing Concept
     *
     * Container is a direct container that should be "run" to make Concept work.
     * So because of that Container can be:
     * - HTTP Server
     * - BASH Script
     * - Database Connection
     * - Microservice
     * - etc.
     *
     * @param config - Configuration of the container that will be used to run it.
     */
    constructor(
    /**
     * Configuration of the container that will be used to run it.
     */
    config?: Partial<A_TYPES__Container_Init>);
    /**
     * Calls the feature with the given name in the given scope
     *
     * [!] Note: This method creates a new instance of the feature every time it is called
     *
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
    /**
     * Name of the feature to call
     */
    feature: string, 
    /**
     * scope in which the feature will be executed
     */
    scope?: A_Scope): Promise<void>;
}

declare enum A_TYPES__ConceptAbstractions {
    /**
     * Run the concept.
     */
    Run = "run",
    /**
     * Build the concept.
     */
    Build = "build",
    /**
     * Publish the concept.
     */
    Publish = "publish",
    /**
     * Deploy the concept.
     */
    Deploy = "deploy",
    /**
     * Load the concept.
     */
    Load = "load",
    /**
     * Start the concept.
     */
    Start = "start",
    /**
     * Stop the concept.
     */
    Stop = "stop"
}

/**
 * A-Abstraction Extend decorator allows to extends behavior of each concept abstraction execution.
 * In case some components or containers requires to extend the behavior of the abstraction like 'start', 'build' or 'deploy'
 * for example, this decorator allows to do so.
 *
 * @param name - abstraction name
 * @param config - configuration of the abstraction extension
 * @returns
 */
declare function A_Abstraction_Extend(
/**
 * Name of the Concept Abstraction to extend
 */
name: A_TYPES__ConceptAbstractions, 
/**
 * Configuration of the Abstraction Extension
 *
 */
config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;

declare class A_Abstraction {
    /**
     * The name of the Abstraction e.g. 'deploy', 'start', 'test', etc.
     */
    protected _name: A_TYPES__ConceptAbstractions;
    /**
     * List of features that are part of this Abstraction
     */
    protected _features: A_Feature[];
    /**
     * The Feature currently being processed
     */
    protected _current?: A_Feature;
    /**
     * Actual Index of the current Feature being processed
     */
    protected _index: number;
    /**
     * Allows to extends A-Abstraction with additional methods
     */
    static get Extend(): typeof A_Abstraction_Extend;
    /**
     * A-Abstraction is an object that is common for any application.
     * By providing components and creating abstraction extensions it's possible to create a unique behavior of the whole solution.
     *
     * Every application has basic abstractions like 'start', 'stop', 'deploy', 'test', etc.
     * They can be easily extended with additional logic from both containers and components.
     *
     *
     * @param params
     */
    constructor(
    /**
     * Parameters to define the A-Abstraction
     */
    params: A_TYPES__Abstraction_Init);
    /**
     * Returns the name of the Abstraction
     */
    get name(): string;
    /**
     * Returns the current Feature being processed
     */
    get feature(): A_Feature | undefined;
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone(): boolean;
    [Symbol.iterator](): Iterator<A_Feature, any>;
    /**
     * This method moves the Abstraction processing to the next Feature in the list
     *
     * @param stage
     */
    next(stage: any): void;
    /**
     * Allows to process all stages of the Abstraction
     *
     * @returns
     */
    process(
    /**
     * Allows to override the scope in which the Abstraction will be processed
     *
     */
    scope?: A_Scope): Promise<void>;
}

/**
 * Abstraction constructor type
 * Uses the generic type T to specify the type of the abstraction
 */
type A_TYPES__Abstraction_Constructor<T = A_Abstraction> = new (...args: any[]) => T;
/**
 * Abstraction initialization type
 */
type A_TYPES__Abstraction_Init = {
    /**
     * Name of the A-Abstraction
     */
    name: A_TYPES__ConceptAbstractions;
    /**
     * Features that compose the A-Abstraction
     */
    containers: Array<A_Container>;
};
/**
 * Abstraction serialized type
 */
type A_TYPES__Abstraction_Serialized = {
    /**
     * The ASEID of the abstraction
     */
    aseid: string;
};
/**
 * Components that can extend Abstractions
 */
type A_TYPES__AbstractionAvailableComponents = A_Component | A_Container;
type A_TYPES__AbstractionDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
type A_TYPES__AbstractionDecoratorConfig = A_TYPES__FeatureExtendDecoratorConfig;

declare class A_Concept<_Imports extends A_Container[] = A_Container[]> {
    protected props: A_TYPES__Concept_Init<_Imports>;
    /**
     * Load the concept. This step runs before any other steps to ensure that all components are loaded.
     */
    static Load(
    /**
     * provide additional configuration for the abstraction extension to make it dependent on other factors
     */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): ReturnType<typeof A_Abstraction_Extend>;
    /**
     * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
     *
     * [!] To extend the logic just create a custom containers and override the default behavior.
     */
    static Publish(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): ReturnType<typeof A_Abstraction_Extend>;
    /**
     * Deploy the concept to the environment.
     */
    static Deploy(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     * Compiles the Concept in case there are some containers that require that.
     *
     * Can be used for static websites or any other concept that requires a build step.
     *
     */
    static Build(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     *  Main execution of the concept.
     */
    static Run(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     *  Start the concept. Uses for servers or any other background services.
     */
    static Start(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     * Stop the concept. Uses for servers or any other background services.
     */
    static Stop(
    /**
    * provide additional configuration for the abstraction extension to make it dependent on other factors
    */
    config?: Partial<A_TYPES__AbstractionDecoratorConfig>): (target: A_Container | A_Component, propertyKey: string, descriptor: A_TYPES__AbstractionDecoratorDescriptor) => void;
    /**
     * Name of the concept
     *
     * By default, the name of the Concept is 'a-concept'
     */
    private _name;
    /**
     * A list of internally defined containers that the concept uses.
     */
    protected _containers: A_Container[];
    /**
     * A-Concept is a placeholder for the concept of the any program.
     *
     * Concept - could be any Program regardless environment and it's goal.
     * It could be mobile, web or simple html page.
     * All depends on Containers and Components installed and provided in the Concept.
     *
     *
     * [!] Concept operates ONLY with all Components and Containers provided to achieve the goal.
     *
     *
     * @param props - Initialization properties for the Concept
     */
    constructor(props: A_TYPES__Concept_Init<_Imports>);
    /**
     * Name of the concept
     */
    get name(): string;
    /**
     * The primary Root scope of the concept.
     */
    get scope(): A_Scope<any, A_TYPES__Component_Constructor[], A_TYPES__Error_Constructor[], A_TYPES__Entity_Constructor[], A_Fragment<A_TYPES__Fragment_Serialized>[]>;
    /**
     * Register a class or value in the concept scope.
     */
    get register(): A_Scope['register'];
    /**
     * Resolve a class or value from the concept scope.
     */
    get resolve(): A_Scope['resolve'];
    /**
     * Load the concept.
     */
    load(scope?: A_Scope): Promise<void>;
    /**
     * Run the concept.
     */
    run(scope?: A_Scope): Promise<void>;
    /**
     * Start the concept.
     *
     * @param params
     */
    start(scope?: A_Scope): Promise<void>;
    /**
     * Stop the concept.
     *
     * @param params
     */
    stop(scope?: A_Scope): Promise<void>;
    /**
     * Build the concept.
     */
    build(scope?: A_Scope): Promise<void>;
    /**
     * Deploy the concept.
     */
    deploy(scope?: A_Scope): Promise<void>;
    /**
     * Publish the concept.
     */
    publish(scope?: A_Scope): Promise<void>;
    /**
     * Call the specific method of the concept or included modules.
     */
    call<K extends Record<_Imports[number]['name'], string>>(
    /**
     * Name of the method to call
     */
    method: K[keyof K], 
    /**
     * Container in which the method is located
     */
    container: _Imports[number]): Promise<void>;
}

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
declare class A_Fragment<_SerializedType extends A_TYPES__Fragment_Serialized = A_TYPES__Fragment_Serialized> {
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
    constructor(params?: Partial<A_TYPES__Fragment_Init>);
    /**
     * Gets the fragment's unique name/identifier.
     *
     * @returns The fragment name
     */
    get name(): string;
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
    toJSON(): _SerializedType;
}

/**
 * Fragment constructor type
 * Uses the generic type T to specify the type of the fragment
 */
type A_TYPES__Fragment_Constructor<T = A_Fragment> = new (...args: any[]) => T;
/**
 * Fragment initialization type
 */
type A_TYPES__Fragment_Init = {
    name: string;
};
/**
 * Fragment serialized type
 */
type A_TYPES__Fragment_Serialized = {
    /**
     * The Name of the fragment
     */
    name: string;
};

/**
 * Concept constructor type
 * Uses the generic type T to specify the type of the concept
 */
type A_TYPES__Concept_Constructor<T = A_Concept> = new (...args: any[]) => T;
/**
 * Concept initialization type
 * Uses the generic type T to specify the type of containers that the concept will use
 */
type A_TYPES__Concept_Init<T extends Array<A_Container>> = {
    /**
     * The name of the Concept
     * If name is not provided, will be used from environment variable A_CONCEPT_NAME
     *
     * By default, the name of the Concept is 'a-concept'
     *
     */
    name?: string;
    /**
     * A set of Context Fragments to register globally for the concept.
     * These fragments will be available in the global context.
     *
     */
    fragments?: Array<InstanceType<A_TYPES__Fragment_Constructor>>;
    /**
     * A set of Containers that the concept depends on.
     * These containers will create a new Container for the concept.
     */
    containers?: T;
    /**
     * A set of Entities that the concept can use.
     * These components will be used in the concept.
     */
    entities?: Array<InstanceType<A_TYPES__Entity_Constructor> | A_TYPES__Entity_Constructor>;
    /**
     * A set of Components available for all containers and fragments in the concept.
     * These components will be registered in the root scope of the concept.
     *
     * [!] Note that these components will be available in all containers and fragments in the concept.
     */
    components?: Array<A_TYPES__Component_Constructor>;
};
/**
 * Concept serialized type
 */
type A_TYPES__Concept_Serialized = {};
/**
 * Uses as a transfer object to pass configurations to Feature constructor
 */
type A_TYPES__ConceptAbstractionMeta = {
    /**
     * The arguments that will be passed to the handler
     */
    args: A_TYPES__A_InjectDecorator_Meta;
} & A_TYPES__FeatureExtendDecoratorMeta;
/**
 * Uses to define the extension that will be applied to the Concept
 */
type A_TYPES__ConceptAbstraction = A_TYPES__FeatureExtendDecoratorMeta;

declare enum A_TYPES__ComponentMetaKey {
    EXTENSIONS = "a-component-extensions",
    FEATURES = "a-component-features",
    INJECTIONS = "a-component-injections",
    ABSTRACTIONS = "a-component-abstractions"
}

/**
 * Component constructor type
 * Uses the generic type T to specify the type of the component
 */
type A_TYPES__Component_Constructor<T = A_Component> = new (...args: any[]) => T;
/**
 * Component initialization type
 */
type A_TYPES__Component_Init = any;
/**
 * Component serialized type
 */
type A_TYPES__Component_Serialized = {
    /**
     * The ASEID of the component
     */
    aseid: string;
};
/**
 * Component meta type
 */
type A_TYPES__ComponentMeta = {
    /**
     * Extensions applied to the component per handler
     */
    [A_TYPES__ComponentMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__FeatureExtendDecoratorMeta[];
    }>;
    /**
     * Features defined on the component per handler
     */
    [A_TYPES__ComponentMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__FeatureDefineDecoratorMeta;
    }>;
    /**
     * Injections defined on the component per handler
     */
    [A_TYPES__ComponentMetaKey.INJECTIONS]: A_Meta<{
        /**
         * Where Key is the name of the injection
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__A_InjectDecorator_Meta;
    }>;
    /**
     *  Abstractions extended by the component per handler
     */
    [A_TYPES__ComponentMetaKey.ABSTRACTIONS]: A_Meta<{
        /**
         * Where Key is the name of the stage
         *
         * Where value is the list of injections
         */
        [Key: string]: A_TYPES__ConceptAbstraction[];
    }>;
};
type A_TYPES__ComponentMetaExtension = A_TYPES__FeatureExtendDecoratorMeta;

type A_TYPES__CallerComponent = A_Container | A_Component | A_Entity;
/**
 * Caller constructor type
 * Uses the generic type T to specify the type of the caller component
 */
type A_TYPES__Caller_Constructor<T = A_Caller> = new (...args: any[]) => T;
/**
 * Caller initialization type
 */
type A_TYPES__Caller_Init = {};
/**
 * Caller serialized type
 */
type A_TYPES__Caller_Serialized = {};

/**
 * A-Inject decorator descriptor type
 * Indicates the type of the decorator function
 */
type A_TYPES__A_InjectDecoratorDescriptor = TypedPropertyDescriptor<(...args: any[]) => Promise<void>>;
/**
 * A-Inject decorator return type
 * Indicates what the decorator function returns
 */
type A_TYPES__A_InjectDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
type A_TYPES__A_InjectDecorator_Meta = Array<{
    target: A_TYPES__InjectableConstructors;
    require?: boolean;
    load?: string;
    defaultArgs?: any;
    create?: boolean;
    instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>;
}>;
/**
 * Targets that can be injected into Extended functions or constructors
 *
 */
type A_TYPES__InjectableTargets = A_TYPES__Component_Constructor | InstanceType<A_TYPES__Component_Constructor> | InstanceType<A_TYPES__Container_Constructor>;
type A_TYPES__InjectableConstructors = A_TYPES__Component_Constructor | A_TYPES__Container_Constructor | A_TYPES__Entity_Constructor | A_TYPES__Feature_Constructor | A_TYPES__Caller_Constructor | A_TYPES__Fragment_Constructor | A_TYPES__Error_Constructor | string;
type A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T extends A_Entity = A_Entity> = {
    query: Partial<A_TYPES__A_InjectDecorator_EntityInjectionQuery<T>>;
    pagination: Partial<A_TYPES__A_InjectDecorator_EntityInjectionPagination>;
};
type A_TYPES__A_InjectDecorator_EntityInjectionQuery<T extends A_Entity = A_Entity> = {
    aseid: string;
} & {
    [key in keyof T]?: any;
};
type A_TYPES__A_InjectDecorator_EntityInjectionPagination = {
    count: number;
    from: 'start' | 'end';
};

declare class A_Scope<_MetaItems extends Record<string, any> = any, _ComponentType extends A_TYPES__Component_Constructor[] = A_TYPES__Component_Constructor[], _ErrorType extends A_TYPES__Error_Constructor[] = A_TYPES__Error_Constructor[], _EntityType extends A_TYPES__Entity_Constructor[] = A_TYPES__Entity_Constructor[], _FragmentType extends A_Fragment[] = A_Fragment[]> {
    /**
     * Scope Name uses for identification and logging purposes
     */
    protected _name: string;
    /**
     * Parent scope reference, used for inheritance of components, fragments, entities and commands
     */
    protected _parent?: A_Scope;
    /**
     * Internal meta storage using A_Meta for type-safe key-value operations.
     * This stores all the scope's runtime data that can be accessed and modified
     * throughout the execution pipeline or within running containers.
     */
    protected _meta: A_Meta<_MetaItems>;
    /**
     * A set of allowed components, A set of constructors that are allowed in the scope
     *
     */
    protected _allowedComponents: Set<_ComponentType[number]>;
    /**
     * A set of allowed errors, A set of constructors that are allowed in the scope
     */
    protected _allowedErrors: Set<_ErrorType[number]>;
    /**
     * A set of allowed entities, A set of constructors that are allowed in the scope
     */
    protected _allowedEntities: Set<_EntityType[number]>;
    /**
     * A set of allowed fragments, A set of constructors that are allowed in the scope
     */
    protected _allowedFragments: Set<A_TYPES__Fragment_Constructor<_FragmentType[number]>>;
    /**
     * Storage for the components, should be strong as components are unique per scope
     */
    protected _components: Map<_ComponentType[number], InstanceType<_ComponentType[number]>>;
    /**
     * Storage for the errors, should be strong as errors are unique per code
     */
    protected _errors: Map<string, InstanceType<_ErrorType[number]>>;
    /**
     * Storage for the entities, should be strong as entities are unique per aseid
     */
    protected _entities: Map<string, InstanceType<_EntityType[number]>>;
    /**
     * Storage for the fragments, should be weak as fragments are singletons per scope
     */
    protected _fragments: Map<A_TYPES__Fragment_Constructor<_FragmentType[number]>, _FragmentType[number]>;
    /**
     * Returns the name of the scope
     */
    get name(): string;
    /**
     * Returns the meta object of the scope
     */
    get meta(): A_Meta<_MetaItems, Record<string, any>>;
    /**
     * Returns a list of Constructors for A-Components that are available in the scope
     */
    get allowedComponents(): Set<_ComponentType[number]>;
    /**
     * Returns a list of Constructors for A-Entities that are available in the scope
     */
    get allowedEntities(): Set<_EntityType[number]>;
    /**
     * Returns a list of Constructors for A-Fragments that are available in the scope
     */
    get allowedFragments(): Set<A_TYPES__Fragment_Constructor<_FragmentType[number]>>;
    /**
     * Returns a list of Constructors for A-Errors that are available in the scope
     */
    get allowedErrors(): Set<_ErrorType[number]>;
    /**
     * Returns an Array of entities registered in the scope
     *
     * [!] One entity per aseid
     */
    get entities(): Array<InstanceType<_EntityType[number]>>;
    /**
     * Returns an Array of fragments registered in the scope
     *
     * [!] One fragment per scope
     */
    get fragments(): Array<_FragmentType[number]>;
    /**
     * Returns an Array of components registered in the scope
     *
     * [!] One component instance per scope
     */
    get components(): Array<InstanceType<_ComponentType[number]>>;
    /**
     * Returns an Array of errors registered in the scope
     *
     * [!] One error per code
     */
    get errors(): Array<InstanceType<_ErrorType[number]>>;
    /**
     * Returns the parent scope of the current scope
     *
     * @param setValue
     * @returns
     */
    get parent(): A_Scope | undefined;
    /**
     * A_Scope refers to the visibility and accessibility of :
     * - variables,
     * - Components,
     * - Context Fragments
     * - Entities
     * - and objects in different parts of your code.
     * Scope determines where a particular piece of data (like a variable or function)
     * can be accessed, modified, or referenced, and it plays a crucial role in avoiding naming collisions and ensuring data integrity.
     *
     * [!] The scope behavior is similar to tree structure where each scope can have a parent scope and inherit its components, fragments, entities and errors
     *
     * @param params
     * @param config
     */
    constructor();
    constructor(
    /**
     * A set of constructors that are allowed in the scope
     */
    params: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>, 
    /**
     * Configuration options for the scope
     */
    config?: Partial<A_TYPES__ScopeConfig>);
    /**
     * Determines which initializer method to use based on the type of the first parameter.
     *
     * @param param1
     * @returns
     */
    protected getInitializer(param1?: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>, param2?: Partial<A_TYPES__ScopeConfig>): (param1: any, param2: any) => void | (() => void);
    protected defaultInitialized(params?: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>, config?: Partial<A_TYPES__ScopeConfig>): void;
    /**
     * This method is used to initialize the components in the scope
     * To save memory components are initialized only when they are requested
     *
     * This method only registers the component in the scope in case they are not registered yet
     *
     * @param _components
     */
    protected initComponents(_components?: _ComponentType): void;
    /**
     * This method is used to initialize the errors in the scope
     *
     * This method only registers the errors in the scope in case they are not registered yet
     *
     * @param _errors
     */
    protected initErrors(_errors?: _ErrorType): void;
    /**
     * This method is used to initialize the entities in the scope
     *
     * This method only registers the entities in the scope in case they are not registered yet
     *
     * @param _entities
     */
    protected initEntities(_entities?: [
        ..._EntityType,
        ...InstanceType<_EntityType[number]>[]
    ]): void;
    /**
     * This method is used to initialize the fragments in the scope
     *
     * This method only registers the fragments in the scope in case they are not registered yet
     *
     * @param _fragments
     */
    protected initFragments(_fragments?: _FragmentType): void;
    /**
     * This method is used to initialize the meta in the scope
     *
     * This method only sets the meta values in the scope in case they are not set yet
     *
     * @param _meta
     */
    protected initMeta(_meta?: Partial<_MetaItems>): void;
    /**
     * This method is used to destroy the scope and all its registered components, fragments and entities
     *
     * [!] This method deregisters all components, fragments and entities from the A-Context
     * [!] This method also clears all internal registries and collections
     */
    destroy(): void;
    /**
     * Retrieves a value from the scope's meta.
     *
     * @param param - The key to retrieve
     * @returns The value associated with the key, or undefined if not found
     *
     * @example
     * ```typescript
     * const userId = scope.get('userId');
     * if (userId) {
     *   console.log(`Current user: ${userId}`);
     * }
     * ```
     */
    get<K extends keyof _MetaItems>(param: K): _MetaItems[K] | undefined;
    /**
     * Stores a value in the scope's meta.
     *
     * @param param - The key to store the value under
     * @param value - The value to store
     *
     * @example
     * ```typescript
     * scope.set('userId', '12345');
     * scope.set('role', 'admin');
     * ```
     */
    set<K extends keyof _MetaItems>(param: K, value: _MetaItems[K]): void;
    /**
     * Returns the issuer of the scope, useful for debugging and tracking purposes
     *
     * Issuer can be:
     * - A Container that allocated the scope
     * - A Feature that allocated the scope
     *
     * [!] Note that the issuer is the direct allocator of the scope, so if a Container allocated a Feature that allocated the scope, the issuer will be the Feature
     *
     * @returns
     */
    issuer<T extends A_TYPES__ScopeLinkedComponents>(): T | undefined;
    /**
     * This method is used to inherit from a parent scope
     *
     * [!] This method checks for circular inheritance and throws an error if detected
     *
     * @param parent
     * @returns
     */
    inherit(parent: A_Scope): A_Scope;
    /**
     * This method is used to check if the component is available in the scope
     *
     * [!] Note that this method checks for the component in the current scope and all parent scopes
     *
     * @param component
     * @returns
     */
    has<T extends A_Component>(
    /**
     * Provide a component constructor to check if it's available in the scope
     */
    component: A_TYPES__Component_Constructor<T>): boolean;
    has<T extends A_Entity>(
    /**
     * Provide an entity constructor to check if it's available in the scope
     *
     * [!] Note that entities are unique per aseid, so this method checks if there's at least one entity of the provided type in the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): boolean;
    has<T extends A_Fragment>(
    /**
     * Provide a fragment constructor to check if it's available in the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): boolean;
    has<T extends A_Error>(
    /**
     * Provide an error constructor to check if it's available in the scope
     */
    error: A_TYPES__Error_Constructor<T>): boolean;
    has(
    /**
     * Provide a string to check if a component, entity or fragment with the provided name is available in the scope
     */
    constructor: string): boolean;
    /**
     * Merges two scopes into a new one
     *
     * [!] Notes:
     *  - this method does NOT modify the existing scopes
     *  - parent of the new scope will be the parent of the current scope or the parent of anotherScope (if exists)
     *
     * @param anotherScope
     * @returns
     */
    merge(anotherScope: A_Scope): A_Scope;
    /**
     * Allows to retrieve the constructor of the component or entity by its name
     *
     * [!] Notes:
     * - In case of search for A-Entity please ensure that provided string corresponds to the static entity property of the class. [!] By default it's the kebab-case of the class name
     * - In case of search for A_Component please ensure that provided string corresponds to the class name in PascalCase
     *
     * @param name
     * @returns
     */
    resolveConstructor<T extends A_Entity>(
    /**
     * Provide the entity name or static entity property to retrieve its constructor
     */
    name: string): A_TYPES__Entity_Constructor<T>;
    resolveConstructor<T extends A_Component>(
    /**
     * Provide the component name in PascalCase to retrieve its constructor
     */
    name: string): A_TYPES__Component_Constructor<T>;
    resolveConstructor<T extends A_Fragment>(
    /**
     * Provide the fragment name in PascalCase to retrieve its constructor
     */
    name: string): A_TYPES__Fragment_Constructor<T>;
    /**
     * This method allows to resolve/inject a component, fragment or entity from the scope
     * Depending on the provided parameters it can resolve:
     * - A single component/fragment/entity by its constructor or name
     * - An array of components/fragments/entities by providing an array of constructors
     * - An entity or an array of entities by providing the entity constructor and query instructions
     *
     * @param component
     * @returns
     */
    resolve<T extends A_Component>(
    /**
     * Provide a component constructor to resolve its instance from the scope
     */
    component: A_TYPES__Component_Constructor<T>): T | undefined;
    resolve<T extends A_TYPES__Component_Constructor[]>(
    /**
     * Provide an array of component constructors to resolve their instances from the scope
     */
    components: [...T]): Array<InstanceType<T[number]>> | undefined;
    resolve<T extends A_Fragment>(
    /**
     * Provide a fragment constructor to resolve its instance from the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): T | undefined;
    resolve<T extends A_TYPES__Fragment_Constructor[]>(
    /**
     * Provide an array of fragment constructors to resolve their instances from the scope
     */
    fragments: [...T]): Array<InstanceType<T[number]>> | undefined;
    resolve<T extends A_Entity>(
    /**
     * Provide an entity constructor to resolve its instance or an array of instances from the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): T | undefined;
    resolve<T extends A_Entity>(
    /**
     * Provide an entity constructor to resolve its instance or an array of instances from the scope
     */
    entity: A_TYPES__Entity_Constructor<T>, 
    /**
     * Provide optional instructions to find a specific entity or a set of entities
     */
    instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): Array<T>;
    resolve<T extends A_Scope>(
    /**
     * Uses only in case of resolving a single entity
     *
     * Provide an entity constructor to resolve its instance from the scope
     */
    scope: A_TYPES__Scope_Constructor<T>): T | undefined;
    resolve<T extends A_Error>(
    /**
     * Uses only in case of resolving a single entity
     *
     * Provide an entity constructor to resolve its instance from the scope
     */
    scope: A_TYPES__Error_Constructor<T>): T | undefined;
    resolve<T extends A_TYPES__ScopeResolvableComponents>(constructorName: string): T | undefined;
    resolve<T extends A_TYPES__ScopeResolvableComponents>(
    /**
     * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
     */
    param1: A_TYPES__InjectableConstructors): T | Array<T> | undefined;
    resolve<T extends A_TYPES__ScopeLinkedConstructors>(
    /**
     * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
     */
    param1: InstanceType<T>): T | Array<T> | undefined;
    /**
     * This method is used internally to resolve a component, fragment or entity by its constructor name
     *
     * [!] Note that this method checks for the component, fragment or entity in the current scope and all parent scopes
     *
     * @param name  - name of the component, fragment or entity to resolve (constructor name for components and fragments, static entity property for entities, static code property for commands)
     * @returns
     */
    private resolveByName;
    /**
     * This method is used internally to resolve a single component, fragment or entity from the scope
     *
     * @param component
     * @param instructions
     * @returns
     */
    private resolveOnce;
    private resolveIssuer;
    /**
     * This method is used internally to resolve a single entity from the scope based on the provided instructions
     *
     * [!] Note that this method can return either a single entity or an array of entities depending on the instructions provided
     *
     * @param entity
     * @param instructions
     * @returns
     */
    private resolveEntity;
    /**
     * This method is used internally to resolve a single error from the scope
     *
     * @param error
     * @returns
     */
    private resolveError;
    /**
     * This method is used internally to resolve a single fragment from the scope
     *
     * @param fragment
     * @returns
     */
    private resolveFragment;
    /**
     *  This method is used internally to resolve a single scope from the current scope
     *
     * @param scope
     * @returns
     */
    private resolveScope;
    /**
     * This method is used internally to resolve a single component from the scope
     *
     * @param component
     * @returns
     */
    private resolveComponent;
    /**
     * This method is used to register the component in the scope
     *
     * @param fragment
     */
    register<T extends A_Component>(
    /**
     * Provide a component constructor to register it in the scope
     */
    component: A_TYPES__Component_Constructor<T>): void;
    register<T extends A_Component>(
    /**
     * Provide a command instance to register it in the scope
     */
    component: T): void;
    register<T extends A_Error>(
    /**
     * Provide an error constructor to register it in the scope
     */
    error: A_TYPES__Error_Constructor<T>): void;
    register<T extends A_Error>(
    /**
     * Provide an error instance to register it in the scope
     */
    error: T): void;
    register<T extends A_Fragment>(
    /**
     * Provide a command instance to register it in the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): void;
    register<T extends A_Fragment>(
    /**
     * Provide a fragment instance to register it in the scope
     */
    fragment: T): void;
    register<T extends A_Entity>(
    /**
     * Provide an entity constructor to register it in the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): void;
    register<T extends A_Entity>(
    /**
     * Provide an entity instance to register it in the scope
     */
    entity: T): void;
    /**
     * This method is used to deregister the component from the scope
     *
     * @param fragment
     */
    deregister<T extends A_Component>(
    /**
     * Provide a component constructor to deregister it in the scope
     */
    component: A_TYPES__Component_Constructor<T>): void;
    deregister(
    /**
     * Provide a command instance to deregister it in the scope
     */
    component: A_Component): void;
    deregister<T extends A_Error>(
    /**
     * Provide an error constructor to deregister it in the scope
     */
    error: A_TYPES__Error_Constructor<T>): void;
    deregister(
    /**
     * Provide an error instance to deregister it in the scope
     */
    error: A_Error): void;
    deregister<T extends A_Fragment>(
    /**
     * Provide a command instance to deregister it in the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): void;
    deregister(
    /**
     * Provide a fragment instance to deregister it in the scope
     */
    fragment: A_Fragment): void;
    deregister<T extends A_Entity>(
    /**
     * Provide an entity constructor to deregister it in the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): void;
    deregister(
    /**
     * Provide an entity instance to deregister it in the scope
     */
    entity: A_Entity): void;
    /**
     * This method is useful when you want to serialize the scope to JSON
     *
     * [!] Note this is not a deep serialization, only the fragments are serialized
     * [!] Fragments are a storage for information which is relevant to the scope
     *
     * @returns
     */
    toJSON(): Record<string, any>;
    /**
     * Type guard to check if the constructor is of type A_Component and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedComponent(ctor: unknown): ctor is _ComponentType[number];
    /**
     * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedEntity(ctor: unknown): ctor is A_TYPES__Entity_Constructor<_EntityType[number]>;
    /**
     * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedFragment(ctor: unknown): ctor is A_TYPES__Fragment_Constructor<_FragmentType[number]>;
    /**
     * Type guard to check if the constructor is of type A_Error and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedError(ctor: unknown): ctor is A_TYPES__Error_Constructor<_ErrorType[number]>;
    /**
     * This method is used to check if the scope is inherited from another scope
     *
     * @param scope
     * @returns
     */
    isInheritedFrom(scope: A_Scope): boolean;
    /**
     * Helper method to check circular inheritance
     * Should return a full sequence of inheritance for logging purposes
     *
     * @param scope
     * @returns
     */
    checkCircularInheritance(scope: A_Scope): Array<string> | false;
    /**
     * Helper method to print the inheritance chain of the scope
     */
    printInheritanceChain(): void;
}

/**
 * A-Component is a primary "extendable" object in the system
 * A unique combination of Components creates completely new functionality
 *
 * The most important thing is that A-Component is STATELESS, it means that it doesn't store any state in itself
 *
 *
 * [!] Every A-Component is a singleton, so if you need to create multiple instances of the same logic - use A-Container
 * [!] So one scope can have only one instance of the same A-Component
 * [!] Every A-Component can be extended by features and extensions
 * [!] ONLY A-Component can have A-Feature extensions
 *
 */
declare class A_Component {
    /**
     * Calls the feature with the given name in the given scope
     *
     * [!] Note: This method creates a new instance of the feature every time it is called
     *
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
    /**
     * Name of the feature to call
     */
    feature: string, 
    /**
     * Scope in which the feature will be executed
     */
    scope?: A_Scope): Promise<void>;
}

/**
 * Scope constructor type
 * Uses the generic type T to specify the type of the Scope
 */
type A_TYPES__Scope_Constructor<T = A_Scope> = new (...args: any[]) => T;
/**
 * Scope initialization type
 */
type A_TYPES__Scope_Init<_MetaItems extends Record<string, any> = any, _ComponentType extends A_TYPES__Component_Constructor[] = A_TYPES__Component_Constructor[], _ErrorType extends A_TYPES__Error_Constructor[] = A_TYPES__Error_Constructor[], _EntityType extends A_TYPES__Entity_Constructor[] = A_TYPES__Entity_Constructor[], _FragmentType extends A_Fragment[] = A_Fragment[]> = {
    /**
     * Scope Name
     */
    name: string;
    /**
     * A list of Context Fragments available in the Scope
     */
    fragments: [..._FragmentType];
    /**
     * A set of Components available in the Scope
     */
    components: [..._ComponentType];
    /**
     * A set of Errors available in the Scope
     */
    errors: [..._ErrorType];
    /**
     * A set of Entities available in the Scope
     *
     */
    entities: [
        ..._EntityType,
        ...InstanceType<_EntityType[number]>[]
    ];
    meta: Partial<_MetaItems>;
};
/**
 * Scope configuration type
 */
type A_TYPES__ScopeConfig = {
    /**
     * Allows to define a parent to take dependencies from in case of the current scope does not have the required component
     */
    parent: A_Scope;
};
/**
 * Scope serialized type
 */
type A_TYPES__Scope_Serialized = {};
/**
 *
 */
type A_TYPES__ScopeLinkedConstructors = A_TYPES__Container_Constructor | A_TYPES__Feature_Constructor;
/**
 * A list of components that can have a scope associated with them
 */
type A_TYPES__ScopeLinkedComponents = A_Container | A_Feature;
/**
 * A list of components that can be resolved by a scope
 */
type A_TYPES__ScopeResolvableComponents = A_Component | A_Fragment | A_Entity | A_Error | A_Scope;
/**
 * A list of components that are dependent on a scope and do not have their own scope
 */
type A_TYPES_ScopeDependentComponents = A_Component | A_Entity | A_Fragment | A_Error;
/**
 * A list of components that are independent of a scope. They don't need a scope to be resolved
 * Those components haven't scope dependent features.
 */
type A_TYPES_ScopeIndependentComponents = A_Error | A_Scope | A_Caller;

/**
 * Components that can have Meta associated with them
 */
type A_TYPES__MetaLinkedComponents = A_Container | A_Component | A_Entity;
/**
 * Constructors of components that can have Meta associated with them
 */
type A_TYPES__MetaLinkedComponentConstructors = A_TYPES__Container_Constructor | A_TYPES__Component_Constructor | A_TYPES__Entity_Constructor;

declare class A_ComponentMeta extends A_Meta<A_TYPES__ComponentMeta> {
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler: string): A_TYPES__A_InjectDecorator_Meta;
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature: string): A_TYPES__ComponentMetaExtension[];
    /**
     * Returns all features defined in the Component
     *
     * @returns
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta>;
    /**
     * Returns a set of instructions to run proper methods in Component during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: any): A_TYPES__ConceptAbstractionMeta[];
}

declare class A_ContainerMeta extends A_Meta<A_TYPES__ContainerMeta> {
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler: string): A_TYPES__A_InjectDecorator_Meta;
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta>;
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction: A_TYPES__ConceptAbstractions): A_TYPES__ConceptAbstractionMeta[];
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature: string): A_TYPES__ContainerMetaExtension[];
}

declare class A_EntityMeta extends A_Meta<A_TYPES__EntityMeta> {
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features(): Array<A_TYPES__FeatureDefineDecoratorMeta>;
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler: string): A_TYPES__A_InjectDecorator_Meta;
}

type A_TYPES__ContextEnvironment = 'server' | 'browser' | 'mobile' | 'desktop' | 'embedded' | 'unknown';
type A_TYPES__FeatureExtendableMeta = A_ContainerMeta | A_ComponentMeta | A_EntityMeta;

declare class A_Context {
    /**
     * Default name of the application from environment variable A_CONCEPT_NAME
     *
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept(): string;
    /**
     * Root scope of the application from environment variable A_CONCEPT_ROOT_SCOPE
     *
     * [!] If environment variable is not set, it will default to 'root'
     */
    static get root(): A_Scope;
    /**
     * Environment the application is running in.
     * Can be either 'server' or 'browser'.
     * [!] Determined by checking if 'window' object is available.
     */
    static get environment(): A_TYPES__ContextEnvironment;
    /**
     * Singleton instance of the Context
     */
    private static _instance;
    /**
     * Root Scope of the Concept and Environment
     *
     * Root scope is the top-level scope that all other scopes inherit from.
     * It stores global configurations and settings and ALL SHAREABLE RESOURCES.
     *
     * [!] Root scope is created automatically when the Context is initialized.
     * [!] Root scope name can be configured using environment variable A_CONCEPT_ROOT_SCOPE
     */
    private _root;
    /**
     * A registry that keeps track of scopes for all components (Containers, Features, Commands)
     * Which can issue a scope allocation.
     */
    protected _registry: WeakMap<A_TYPES__ScopeLinkedComponents, A_Scope>;
    /**
     * This is a registry that stores an issuer of each scope allocation.
     * It helps to track which component (Container, Feature, Command) allocated a specific scope.
     */
    protected _scopeIssuers: WeakMap<A_Scope, A_TYPES__ScopeLinkedComponents>;
    /**
     * Stores a context associated with a specific component that depends on a scope.
     * uses for quick retrieval of the scope for the component.
     */
    protected _scopeStorage: WeakMap<A_TYPES_ScopeDependentComponents, A_Scope>;
    /**
     * Stores meta information for different component types by their constructors.
     * Meta provides to store extra information about the class behavior and configuration.
     */
    protected _metaStorage: Map<A_TYPES__MetaLinkedComponentConstructors, A_Meta>;
    /**
     * Private constructor to enforce singleton pattern.
     *
     * [!] This class should not be instantiated directly. Use A_Context.getInstance() instead.
     */
    private constructor();
    /**
     * Get the instance of the Namespace Provider.
     *
     * If the instance does not exist, it will be created.
     *
     * @returns
     */
    static getInstance(): A_Context;
    /**
     * Register method allows to register a component with a specific scope in the context.
     *
     * @param component - Component to register with a specific scope. Can be either A_Container, A_Feature.
     * @param scope - Scope to associate the component with.
     * @returns
     */
    static register(
    /**
     * Provide the scope that will be associated with the component.
     */
    scope: A_Scope, 
    /**
     * Provide a component that needs to be registered with a specific scope.
     */
    component: A_TYPES_ScopeDependentComponents): A_Scope;
    /**
     * Deregister method allows to deregister a component from the context.
     *
     * @param component - Component to deregister from the context.
     */
    static deregister(
    /**
     * Provide a component that needs to be deregistered from the context.
     */
    component: A_TYPES_ScopeDependentComponents): void;
    /**
     * Allocate method instantiates a new scope for the given component and registers it in the context.
     * It bounds the component (Container, Feature) to a new scope that can be configured and used independently.
     *
     *
     * @param component - Component to allocate the scope for. Can be either A_Container, A_Feature.
     * @param importing  - Configuration of the scope that will be created for the component.
     */
    static allocate(
    /**
     * Provide a component that needs a scope allocation.
     */
    component: A_TYPES__ScopeLinkedComponents): A_Scope;
    static allocate(
    /**
     * Provide a component that needs a scope allocation.
     */
    component: A_TYPES__ScopeLinkedComponents, 
    /**
     * Provide the scope that will be used as a base for the new scope.
     */
    importing: A_Scope): A_Scope;
    static allocate(
    /**
     * Provide a component that needs a scope allocation.
     */
    component: A_TYPES__ScopeLinkedComponents, 
    /**
     * Provide configuration for the scope that will be created for the component.
     */
    config: Partial<A_TYPES__Scope_Init & A_TYPES__ScopeConfig>): A_Scope;
    /**
     * Deallocate method removes the scope allocation for the given component from the context.
     *
     * @param component
     * @returns
     */
    static deallocate(
    /**
     * A Scope that needs to be deallocated.
     */
    scope: A_Scope): any;
    static deallocate(
    /**
     * Provide a component that needs to have its scope deallocated.
     */
    component: A_TYPES__ScopeLinkedComponents): any;
    /**
      * Get or Create Meta for the specific class or instance.
      * This method will return the existing meta if it exists, or create a new one if it doesn't.
      *
      * Meta object contains custom metadata based on the class type.
      *
      * @param container
      */
    static meta(
    /**
     * Get meta for the specific container class by constructor.
     */
    container: A_TYPES__Container_Constructor): A_ContainerMeta;
    static meta(
    /**
     * Get meta for the specific container instance.
     */
    container: A_Container): A_ContainerMeta;
    static meta(
    /**
     * Get meta for the specific entity class by constructor.
     */
    entity: A_TYPES__Entity_Constructor): A_EntityMeta;
    static meta(
    /**
     * Get meta for the specific entity instance.
     */
    entity: A_Entity): A_EntityMeta;
    static meta(
    /**
     * Get meta for the specific component class by constructor.
     */
    component: A_TYPES__Component_Constructor): A_ComponentMeta;
    static meta(
    /**
     * Get meta for the specific component instance.
     */
    component: A_Component): A_ComponentMeta;
    static meta(
    /**
     * Get meta for the specific component by its name.
     */
    component: string): A_ComponentMeta;
    static meta(
    /**
     * Get meta for the specific injectable target (class or instance).
     */
    target: A_TYPES__InjectableTargets): A_ComponentMeta;
    static meta<T extends Record<string, any>>(
    /**
     * Get meta for the specific class or instance
     */
    constructor: new (...args: any[]) => any): A_Meta<T>;
    /**
     *
     * This method allows to get the issuer of a specific scope.
     *
     * @param scope - Scope to get the issuer for.
     * @returns - Component that issued the scope.
     */
    static issuer(
    /**
     * Provide the scope to get its issuer.
     */
    scope: A_Scope): A_TYPES__ScopeLinkedComponents | undefined;
    /**
     * Get the scope of the specific class or instance.
     *
     * Every execution in Concept has its own scope.
     *
     * This method will return the scope of the specific class or instance.
     *
     * @param entity
     */
    static scope<T extends A_Entity>(
    /**
     * Provide an entity to get its scope.
     */
    entity: T): A_Scope;
    static scope<T extends A_Component>(
    /**
     * Provide a component to get its scope.
     */
    component: T): A_Scope;
    static scope<T extends A_Container>(
    /**
     * Provide a container to get its scope.
     */
    container: T): A_Scope;
    static scope<T extends A_Feature>(
    /**
     * Provide a feature to get its scope.
     */
    feature: T): A_Scope;
    static scope<T extends A_Fragment>(
    /**
     * Provide a fragment to get its scope.
     */
    fragment: T): A_Scope;
    /**
     * Returns a template of the feature that can be then used to create a new A-Feature Instance
     *
     * [!] Note: Steps/Stages included are fully dependent on the scope provided since it dictates which components are active and can provide extensions for the feature.
     *
     * @param name
     */
    static featureTemplate(
    /**
     * Provide the name of the feature to get the template for. Regular expressions are also supported to match multiple features.
     */
    name: string | RegExp, 
    /**
     * Provide the component to get the feature template from.
     */
    component: A_TYPES__FeatureAvailableComponents, 
    /**
     * Provide the scope that dictates which components are active and can provide extensions for the feature.
     */
    scope?: A_Scope): Array<A_TYPES__A_StageStep>;
    /**
     * Returns all extensions for the specific feature in the specific component within the provided scope.
     * Scope dictates which components are active and can provide extensions for the feature.
     *
     * [!] This method only returns extensions, not the base feature definition.
     *
     * @param scope
     * @returns
     */
    static featureExtensions(
    /**
     * Provide the name of the feature to get the template for. Regular expressions are also supported to match multiple features.
     */
    name: string | RegExp, 
    /**
     * Provide the component to get the feature template from.
     */
    component: A_TYPES__FeatureAvailableComponents, 
    /**
     * Provide the scope that dictates which components are active and can provide extensions for the feature.
     */
    scope: A_Scope): Array<A_TYPES__A_StageStep>;
    /**
     * method helps to filter steps in a way that only the most derived classes are kept.
     *
     * @param scope
     * @param items
     * @returns
     */
    private filterToMostDerived;
    /**
     * This method returns the feature template definition without any extensions.
     * It can be used to retrieve the base template for a feature before any modifications are applied.
     *
     * [!] This method does not consider extensions from other components.
     *
     * @param feature
     * @param component
     * @returns
     */
    static featureDefinition(
    /**
     * Name of the feature to get the template for.
     * Regular expressions are also supported to match multiple features.
     */
    feature: string | RegExp, 
    /**
     * Component to get the feature template from.
     */
    component: A_TYPES__FeatureAvailableComponents): Array<A_TYPES__A_StageStep>;
    /**
     * Returns a definition of the abstraction that can be then used to create a new A-Feature Instance
     *
     * [!] Note: Steps/Stages included are fully dependent on the scope provided since it dictates which components are active and can provide extensions for the abstraction.
     *
     * @param abstraction
     */
    static abstractionTemplate(
    /**
     * Provide the abstraction stage to get the definition for.
     */
    abstraction: A_TYPES__ConceptAbstractions, 
    /**
     * Provide the component to get the abstraction definition from.
     */
    component: A_TYPES__FeatureAvailableComponents): Array<A_TYPES__A_StageStep>;
    static abstractionExtensions(
    /**
     * Provide the abstraction name to get the definition for.
     */
    abstraction: A_TYPES__ConceptAbstractions, 
    /**
     * Provide the component to get the abstraction definition from.
     */
    component: A_TYPES__FeatureAvailableComponents): Array<A_TYPES__A_StageStep>;
    /**
     * Resets the Context to its initial state.
     */
    static reset(): void;
    /**
     * Type guard to check if the param is allowed for scope allocation.
     *
     * @param param
     * @returns
     */
    static isAllowedForScopeAllocation(param: any): param is A_TYPES__ScopeLinkedComponents;
    /**
     * Type guard to check if the param is allowed to be registered in the context.
     *
     * @param param
     * @returns
     */
    static isAllowedToBeRegistered(param: any): param is A_TYPES_ScopeDependentComponents;
    /**
     * Type guard to check if the param is allowed for meta storage.
     *
     * @param param
     * @returns
     */
    static isAllowedForMeta(param: any): param is A_TYPES__MetaLinkedComponents;
    /**
     * Type guard to check if the param is allowed for meta storage by constructor.
     *
     * @param param
     * @returns
     */
    static isAllowedForMetaConstructor(param: any): param is A_TYPES__MetaLinkedComponentConstructors;
}

declare class A_ConceptMeta extends A_Meta<any> {
    private containers;
    constructor(containers: Array<A_Container>);
}

declare class A_AbstractionError extends A_Error {
    /**
     * This error code indicates that there was an issue extending the abstraction execution
     */
    static readonly AbstractionExtensionError = "Unable to extend abstraction execution";
}

declare class A_CallerError extends A_Error {
    /**
     * This error code indicates that there was an issue initializing the A-Caller
     */
    static readonly CallerInitializationError = "Unable to initialize A-Caller";
}

declare class ASEID_Error extends A_Error {
    static readonly ASEIDInitializationError = "ASEID Initialization Error";
    static readonly ASEIDValidationError = "ASEID Validation Error";
}

declare class A_ScopeError extends A_Error {
    static readonly InitializationError = "A-Scope Initialization Error";
    static readonly ConstructorError = "Unable to construct A-Scope instance";
    static readonly ResolutionError = "A-Scope Resolution Error";
    static readonly RegistrationError = "A-Scope Registration Error";
    static readonly CircularInheritanceError = "A-Scope Circular Inheritance Error";
    static readonly DeregistrationError = "A-Scope Deregistration Error";
}

/**
 * A-Dependency require decorator return type
 */
type A_TYPES__A_Dependency_RequireDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * A-Dependency load decorator return type
 */
type A_TYPES__A_Dependency_LoadDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
/**
 * A-Dependency default decorator return type
 */
type A_TYPES__A_Dependency_DefaultDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;

/**
 * Should indicate which Default is required
 */
declare function A_Dependency_Default(
/**
 * Constructor Parameters that will be used to create the default instance
 */
...args: any[]): A_TYPES__A_Dependency_DefaultDecoratorReturn;

/**
 * Should indicate which Load is required
 */
declare function A_Dependency_Load(
/**
 * Path to load the dependency from
 */
path: string): A_TYPES__A_Dependency_LoadDecoratorReturn;

/**
 * Should indicate which dependency is required
 */
declare function A_Dependency_Require(): A_TYPES__A_Dependency_RequireDecoratorReturn;

declare class A_Dependency {
    /**
     * Allows to indicate which Injected parameter is required
     *
     * [!] If parameter marked as required is not provided, an error will be thrown
     *
     * @returns
     */
    static get Required(): typeof A_Dependency_Require;
    /**
     * Allows to indicate which dependency should be loaded from a specific path
     *
     * @returns
     */
    static get Loaded(): typeof A_Dependency_Load;
    /**
     * Allows to indicate which dependency default parameters should be used
     *
     * @returns
     */
    static get Default(): typeof A_Dependency_Default;
}

declare class A_DependencyError extends A_Error {
    static readonly InvalidDependencyTarget = "Invalid Dependency Target";
    static readonly InvalidLoadTarget = "Invalid Load Target";
    static readonly InvalidLoadPath = "Invalid Load Path";
    static readonly InvalidDefaultTarget = "Invalid Default Target";
}

/**
 * A-Inject decorator
 *
 * This Decorator allows to inject dependencies into the module like
 * - Namespaces
 * - Other Concepts
 * - or maybe Components
 *
 * @param params - see overloads
 * @returns - decorator function
 */
declare function A_Inject<T extends A_Scope>(
/***
 * Provide the Scope constructor that will be associated with the injection.
 *
 * [!] It returns an instance of the Scope where the Entity/Component/Container is defined.
 */
scope: A_TYPES__Scope_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Error>(
/***
 * Provide the Error constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Error what is executed.
 */
error: A_TYPES__Error_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Feature>(
/**
 * Provide the Feature constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Feature what is executed.
 */
feature: A_TYPES__Feature_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Component>(
/**
 * Provide the Component constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Component from current Scope or from Parent Scopes.
 */
component: A_TYPES__Component_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject(
/**
 * Provide the A_Caller constructor to inject the Caller instance
 *
 * [!] It returns initiator of the call, e.g. Container/Component/Command who called Feature
 */
caller: typeof A_Caller): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Fragment>(
/**
 * Provide the Fragment constructor to inject the Fragment instance
 *
 * [!] It returns the Fragment instance from current Scope or from Parent Scopes.
 */
fragment: A_TYPES__Fragment_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Entity>(
/**
 * Provide the Entity constructor to inject the Entity instance
 *
 * [!] Note: It returns the Entity instance from current Scope or from Parent Scopes.
 * [!] Note: If instance has more than one Entity of the same type It returns FIRST found Entity
 * [!] Note: Use 'config' to specify to inject specific one or even Array of Entities
 */
entity: A_TYPES__Entity_Constructor<T>, 
/**
 * Provide additional instructions on how to perform the injection
 *
 * [!] Default Pagination is 1 if it's necessary to get multiple Entities please customize it in the instructions
 */
config?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): A_TYPES__A_InjectDecoratorReturn<T>;
declare function A_Inject<T extends A_Component>(
/**
 * Provide the name of Component constructor to inject the Component instance
 *
 * [!] You can use both customized one or original depending on your overriding strategy
 */
ctor: string): A_TYPES__A_InjectDecoratorReturn;

declare class A_CommonHelper {
    /**
     * A simple promise that resolves immediately.
     * Can be used in async functions to create a resolved promise.
     */
    static resolve(): Promise<void>;
    /**
     * Check if a class is inherited from another class
     *
     * @param childClass
     * @param parentClass
     * @returns
     */
    static isInheritedFrom(childClass: any, parentClass: any): boolean;
    /**
     *  Omit properties from an object or array with nested objects
     *
     * @param input
     * @param paths
     * @returns
     */
    static omitProperties<T, S extends string>(input: T, paths: string[]): Omit<T, S>;
    static isObject(item: unknown): item is Record<string, any>;
    static deepMerge<T = any>(target: any, source: any, visited?: Map<any, any>): T;
    static deepClone<T>(target: T): T;
    static deepCloneAndMerge<T>(target: A_TYPES__DeepPartial<T>, source: T): T;
    /**
     * Get a readable name for a component (string, class, function, React element, instance, etc.)
     *
     * Covers:
     * - string tags ("div")
     * - symbols (Symbol.for('xxx'))
     * - functions and classes (with name or displayName)
     * - React elements (object with `type`)
     * - component instances (constructor.name)
     * - objects with custom toString returning meaningful info
     *
     * Falls back to sensible defaults ("Unknown" / "Anonymous").
     */
    static getComponentName(component: any): string;
}

/**
 * A_FormatterHelper
 *
 * Helper class for formatting strings into different cases.
 */
declare class A_FormatterHelper {
    /**
     * Convert string to UPPER_SNAKE_CASE
     *
     * @param str
     * @returns
     */
    static toUpperSnakeCase(str: string): string;
    /**
     * Convert string to camelCase
     *
     * @param str
     * @returns
     */
    static toCamelCase(str: string): string;
    /**
     * Convert string to PascalCase
     *
     * @param str
     * @returns
     */
    static toPascalCase(str: string): string;
    /**
     * Convert string to kebab-case
     *
     * @param str
     * @returns
     */
    static toKebabCase(str: string): string;
}

type A_ID_TYPES__TimeId_Parts = {
    timestamp: Date;
    random: string;
};
declare class A_IdentityHelper {
    /**
   * Generates a short, time-based unique ID.
   * Encodes current time (ms since epoch) and random bits in base36.
   * Example: "mb4f1g-7f9a1c"
   */
    static generateTimeId(parts?: A_ID_TYPES__TimeId_Parts): string;
    /**
     * Parses a short ID back into its parts.
     * Returns an object with the original timestamp (as Date) and random string.
     */
    static parseTimeId(id: string): A_ID_TYPES__TimeId_Parts;
    /**
     *  Format a number with leading zeros to a fixed length
     *
     * @param number
     * @param maxZeros
     * @returns
     */
    static formatWithLeadingZeros(number: any, maxZeros?: number): string;
    /**
     * Remove leading zeros from a formatted number
     */
    static removeLeadingZeros(formattedNumber: any): string;
}

declare class A_StepManagerError extends A_Error {
    static readonly CircularDependencyError = "A-StepManager Circular Dependency Error";
}

declare class A_TypeGuards {
    /**
     * Check if value is a string
     *
     * @param value
     * @returns
     */
    static isString(value: any): value is string;
    /**
     * Check if value is a number
     *
     * @param value
     * @returns
     */
    static isNumber(value: any): value is number;
    /**
     * Check if value is a boolean
     *
     * @param value
     * @returns
     */
    static isBoolean(value: any): value is boolean;
    /**
     * Check if value is an array
     *
     * @param value
     * @returns
     */
    static isArray(value: any): value is Array<any>;
    /**
     * Check if value is an object
     *
     * @param value
     * @returns
     */
    static isObject<T extends Object = Object>(value: any): value is T;
    /**
     * Check if value is a function
     *
     * @param value
     * @returns
     */
    static isFunction(value: any): value is Function;
    static isUndefined(value: any): value is undefined;
    static isRegExp(value: any): value is RegExp;
    /**
     * Type guard to check if the constructor is of type A_Container
     *
     * @param ctor
     * @returns
     */
    static isContainerConstructor(ctor: any): ctor is A_TYPES__Container_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Component
     *
     * @param ctor
     * @returns
     */
    static isComponentConstructor(ctor: any): ctor is A_TYPES__Component_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Fragment
     *
     * @param ctor
     * @returns
     */
    static isFragmentConstructor(ctor: any): ctor is A_TYPES__Fragment_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Entity
     *
     * @param ctor
     * @returns
     */
    static isEntityConstructor(ctor: any): ctor is A_TYPES__Entity_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isScopeConstructor(ctor: any): ctor is A_TYPES__Scope_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isErrorConstructor(ctor: any): ctor is A_TYPES__Error_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Feature
     *
     * @param ctor
     * @returns
     */
    static isFeatureConstructor(ctor: any): ctor is A_TYPES__Feature_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Caller
     *
     * @param ctor
     * @returns
     */
    static isCallerConstructor(ctor: any): ctor is A_TYPES__Caller_Constructor;
    /**
     * Type guard to check if the instance is of type A_Container
     *
     * @param instance
     * @returns
     */
    static isContainerInstance(instance: any): instance is A_Container;
    /**
     * Type guard to check if the instance is of type A_Component
     *
     * @param instance
     * @returns
     */
    static isComponentInstance(instance: any): instance is A_Component;
    /**
     * Type guard to check if the instance is of type A_Feature
     *
     * @param instance
     * @returns
     */
    static isFeatureInstance(instance: any): instance is A_Feature;
    /**
     * Type guard to check if the instance is of type A_Fragment
     *
     * @param instance
     * @returns
     */
    static isFragmentInstance(instance: any): instance is A_Fragment;
    /**
     * Type guard to check if the instance is of type A_Entity
     *
     * @param instance
     * @returns
     */
    static isEntityInstance(instance: any): instance is A_Entity;
    /**
     * Type guard to check if the instance is of type A_Scope
     *
     * @param instance
     * @returns
     */
    static isScopeInstance(instance: any): instance is A_Scope;
    /**
     * Type guard to check if the instance is of type A_Error
     *
     * @param instance
     * @returns
     */
    static isErrorInstance(instance: any): instance is A_Error;
    /**
     * Type guard to check if the instance is of type A_ComponentMeta
     *
     * @param instance
     * @returns
     */
    static isComponentMetaInstance(instance: any): instance is A_ComponentMeta;
    /**
     * Type guard to check if the instance is of type A_ContainerMeta
     *
     * @param instance
     * @returns
     */
    static isContainerMetaInstance(instance: any): instance is A_ContainerMeta;
    /**
     * Type guard to check if the instance is of type A_EntityMeta
     *
     * @param instance
     * @returns
     */
    static isEntityMetaInstance(instance: any): instance is A_EntityMeta;
    static isConstructorAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedConstructors;
    static isInstanceAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedComponents;
    static isConstructorAvailableForAbstraction(target: any): target is A_TYPES__AbstractionAvailableComponents;
    static isTargetAvailableForInjection(target: any): target is A_TYPES__InjectableTargets;
    static isAllowedForFeatureCall(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureDefinition(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureExtension(param: any): param is A_TYPES__FeatureExtendDecoratorTarget;
    static isAllowedForAbstractionDefinition(param: any): param is A_TYPES__AbstractionAvailableComponents;
    static isAllowedForDependencyDefaultCreation(param: any): param is A_TYPES__Entity_Constructor | A_TYPES__Component_Constructor;
    /**
     * Allows to check if the provided param is of constructor type.
     *
     * @param param
     * @returns
     */
    static isErrorConstructorType<T extends A_TYPES__Error_Init>(param: any): param is T;
    static isErrorSerializedType<T extends A_TYPES__Error_Serialized>(param: any): param is T;
}

export { ASEID, ASEID_Error, A_Abstraction, A_AbstractionError, A_Abstraction_Extend, A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_Caller, A_CallerError, A_CommonHelper, A_Component, A_ComponentMeta, A_Concept, A_ConceptMeta, A_Container, A_ContainerMeta, A_Context, A_Dependency, A_DependencyError, A_Dependency_Default, A_Dependency_Load, A_Dependency_Require, A_Entity, A_Error, A_Feature, A_FeatureError, A_Feature_Define, A_Feature_Extend, A_FormatterHelper, A_Fragment, type A_ID_TYPES__TimeId_Parts, A_IdentityHelper, A_Inject, A_Meta, A_Scope, A_ScopeError, A_Stage, A_StageError, A_StepManagerError, A_StepsManager, type A_TYPES_ScopeDependentComponents, type A_TYPES_ScopeIndependentComponents, type A_TYPES_StageExecutionBehavior, type A_TYPES__ASEID_Constructor, type A_TYPES__ASEID_ConstructorConfig, type A_TYPES__ASEID_JSON, type A_TYPES__A_Dependency_DefaultDecoratorReturn, type A_TYPES__A_Dependency_LoadDecoratorReturn, type A_TYPES__A_Dependency_RequireDecoratorReturn, type A_TYPES__A_InjectDecoratorDescriptor, type A_TYPES__A_InjectDecoratorReturn, type A_TYPES__A_InjectDecorator_EntityInjectionInstructions, type A_TYPES__A_InjectDecorator_EntityInjectionPagination, type A_TYPES__A_InjectDecorator_EntityInjectionQuery, type A_TYPES__A_InjectDecorator_Meta, type A_TYPES__A_StageStep, type A_TYPES__A_StageStepProcessingExtraParams, A_TYPES__A_Stage_Status, type A_TYPES__AbstractionAvailableComponents, type A_TYPES__AbstractionDecoratorConfig, type A_TYPES__AbstractionDecoratorDescriptor, type A_TYPES__Abstraction_Constructor, type A_TYPES__Abstraction_Init, type A_TYPES__Abstraction_Serialized, type A_TYPES__CallerComponent, type A_TYPES__Caller_Constructor, type A_TYPES__Caller_Init, type A_TYPES__Caller_Serialized, type A_TYPES__ComponentMeta, type A_TYPES__ComponentMetaExtension, type A_TYPES__Component_Constructor, type A_TYPES__Component_Init, type A_TYPES__Component_Serialized, type A_TYPES__ConceptAbstraction, type A_TYPES__ConceptAbstractionMeta, type A_TYPES__ConceptENVVariables, type A_TYPES__Concept_Constructor, type A_TYPES__Concept_Init, type A_TYPES__Concept_Serialized, type A_TYPES__ContainerMeta, type A_TYPES__ContainerMetaExtension, type A_TYPES__Container_Constructor, type A_TYPES__Container_Init, type A_TYPES__Container_Serialized, type A_TYPES__ContextEnvironment, type A_TYPES__DeepPartial, type A_TYPES__Dictionary, type A_TYPES__EntityMeta, type A_TYPES__Entity_Constructor, type A_TYPES__Entity_Init, type A_TYPES__Entity_Serialized, type A_TYPES__Error_Constructor, type A_TYPES__Error_Init, type A_TYPES__Error_Serialized, type A_TYPES__ExtractNested, type A_TYPES__ExtractProperties, type A_TYPES__FeatureAvailableComponents, type A_TYPES__FeatureAvailableConstructors, type A_TYPES__FeatureDefineDecoratorConfig, type A_TYPES__FeatureDefineDecoratorDescriptor, type A_TYPES__FeatureDefineDecoratorMeta, type A_TYPES__FeatureDefineDecoratorTarget, type A_TYPES__FeatureDefineDecoratorTemplateItem, type A_TYPES__FeatureError_Init, type A_TYPES__FeatureExtendDecoratorConfig, type A_TYPES__FeatureExtendDecoratorDescriptor, type A_TYPES__FeatureExtendDecoratorMeta, type A_TYPES__FeatureExtendDecoratorScopeConfig, type A_TYPES__FeatureExtendDecoratorScopeItem, type A_TYPES__FeatureExtendDecoratorTarget, type A_TYPES__FeatureExtendableMeta, A_TYPES__FeatureState, type A_TYPES__Feature_Constructor, type A_TYPES__Feature_Init, type A_TYPES__Feature_InitWithComponent, type A_TYPES__Feature_InitWithTemplate, type A_TYPES__Feature_Serialized, type A_TYPES__Fragment_Constructor, type A_TYPES__Fragment_Init, type A_TYPES__Fragment_Serialized, type A_TYPES__IEntity, type A_TYPES__InjectableConstructors, type A_TYPES__InjectableTargets, type A_TYPES__MetaLinkedComponentConstructors, type A_TYPES__MetaLinkedComponents, type A_TYPES__NonObjectPaths, type A_TYPES__ObjectKeyEnum, type A_TYPES__Paths, type A_TYPES__PathsToObject, type A_TYPES__Required, type A_TYPES__ScopeConfig, type A_TYPES__ScopeLinkedComponents, type A_TYPES__ScopeLinkedConstructors, type A_TYPES__ScopeResolvableComponents, type A_TYPES__Scope_Constructor, type A_TYPES__Scope_Init, type A_TYPES__Scope_Serialized, type A_TYPES__Stage_Serialized, type A_TYPES__UnionToIntersection, A_TypeGuards };
