import { A_TYPES__ScopeConfig, A_TYPES__Scope_Init, A_TYPES__ScopeLinkedComponents, A_TYPES__ScopeResolvableComponents, A_TYPES__ScopeLinkedConstructors } from './A-Scope.types';
import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions, A_TYPES__InjectableConstructors } from "../A-Inject/A-Inject.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Error } from "../A-Error/A_Error.class";
import { A_TYPES__Entity_Constructor } from '../A-Entity/A-Entity.types';
import { A_TYPES__Component_Constructor } from '../A-Component/A-Component.types';
import { A_TYPES__Fragment_Constructor } from '../A-Fragment/A-Fragment.types';
import { A_TYPES__Error_Constructor } from '../A-Error/A_Error.types';
export declare class A_Scope<_ComponentType extends A_TYPES__Component_Constructor[] = A_TYPES__Component_Constructor[], _ErrorType extends A_TYPES__Error_Constructor[] = A_TYPES__Error_Constructor[], _EntityType extends A_TYPES__Entity_Constructor[] = A_TYPES__Entity_Constructor[], _FragmentType extends A_Fragment[] = A_Fragment[]> {
    /**
     * Scope Name uses for identification and logging purposes
     */
    protected _name: string;
    /**
     * Parent scope reference, used for inheritance of components, fragments, entities and commands
     */
    protected _parent?: A_Scope;
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
    params: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>, 
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
    protected getInitializer(param1?: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>, param2?: Partial<A_TYPES__ScopeConfig>): (param1: any, param2: any) => void | (() => void);
    protected defaultInitialized(params?: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>, config?: Partial<A_TYPES__ScopeConfig>): void;
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
    component: A_TYPES__Component_Constructor<T>): T;
    resolve<T extends A_TYPES__Component_Constructor[]>(
    /**
     * Provide an array of component constructors to resolve their instances from the scope
     */
    components: [...T]): Array<InstanceType<T[number]>>;
    resolve<T extends A_Fragment>(
    /**
     * Provide a fragment constructor to resolve its instance from the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): T;
    resolve<T extends A_TYPES__Fragment_Constructor[]>(
    /**
     * Provide an array of fragment constructors to resolve their instances from the scope
     */
    fragments: [...T]): Array<InstanceType<T[number]>>;
    resolve<T extends A_Entity>(
    /**
     * Provide an entity constructor to resolve its instance or an array of instances from the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): T | undefined;
    resolve<T extends A_Scope>(
    /**
     * Uses only in case of resolving a single entity
     *
     * Provide an entity constructor to resolve its instance from the scope
     */
    scope: new (...args: any[]) => T): T;
    resolve<T extends A_Entity>(
    /**
     * Provide an entity constructor to resolve its instance or an array of instances from the scope
     */
    entity: A_TYPES__Entity_Constructor<T>, 
    /**
     * Provide optional instructions to find a specific entity or a set of entities
     */
    instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): Array<T>;
    resolve<T extends A_TYPES__ScopeResolvableComponents>(constructorName: string): T;
    resolve<T extends A_TYPES__ScopeResolvableComponents>(
    /**
     * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
     */
    param1: A_TYPES__InjectableConstructors): T | Array<T>;
    resolve<T extends A_TYPES__ScopeLinkedConstructors>(
    /**
     * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
     */
    param1: InstanceType<T>): T | Array<T>;
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
    register(
    /**
     * Provide a command instance to register it in the scope
     */
    component: A_Component): void;
    register<T extends A_Error>(
    /**
     * Provide an error constructor to register it in the scope
     */
    error: A_TYPES__Error_Constructor<T>): void;
    register(
    /**
     * Provide an error instance to register it in the scope
     */
    error: A_Error): void;
    register<T extends A_Fragment>(
    /**
     * Provide a command instance to register it in the scope
     */
    fragment: A_TYPES__Fragment_Constructor<T>): void;
    register(
    /**
     * Provide a fragment instance to register it in the scope
     */
    fragment: A_Fragment): void;
    register<T extends A_Entity>(
    /**
     * Provide an entity constructor to register it in the scope
     */
    entity: A_TYPES__Entity_Constructor<T>): void;
    register(
    /**
     * Provide an entity instance to register it in the scope
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
