import { A_TYPES__AllowedCommandsConstructor, A_TYPES__AllowedComponentsConstructor, A_TYPES__AllowedEntitiesConstructor, A_TYPES__AllowedFragmentsConstructor, A_TYPES__AllowedScopesConstructor, A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from './A-Scope.types';
import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Command } from "../A-Command/A-Command.class";
export declare class A_Scope<_ComponentType extends A_TYPES__AllowedComponentsConstructor[] = A_TYPES__AllowedComponentsConstructor[], _CommandType extends A_TYPES__AllowedCommandsConstructor[] = A_TYPES__AllowedCommandsConstructor[], _EntityType extends A_Entity[] = A_Entity[], _FragmentType extends A_Fragment[] = A_Fragment[]> {
    /**
     * Scope Name uses for identification and logging purposes
     */
    readonly name: string;
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
     * A set of allowed entities, A set of constructors that are allowed in the scope
     */
    protected _allowedEntities: Set<A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>>;
    /**
     * A set of allowed fragments, A set of constructors that are allowed in the scope
     */
    protected _allowedFragments: Set<A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>>;
    /**
     * A set of allowed commands, A set of constructors that are allowed in the scope
     */
    protected _allowedCommands: Set<_CommandType[number]>;
    /**
     * Internal storage for the components, fragments, entities and commands
     */
    protected _components: Map<_ComponentType[number], InstanceType<_ComponentType[number]>>;
    /**
     * Storage for the fragments, should be weak as fragments are singletons per scope
     */
    protected _fragments: Map<A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>, _FragmentType[number]>;
    /**
     * Storage for the entities, should be strong as entities are unique per aseid
     */
    protected _entities: Map<string, _EntityType[number]>;
    /**
     * Storage for the commands, should be strong as commands are unique per code
     */
    protected _commands: Map<string, InstanceType<_CommandType[number]>>;
    /**
     * Returns a list of Constructors for A-Components that are available in the scope
     */
    get allowedComponents(): Set<_ComponentType[number]>;
    /**
     * Returns a list of Constructors for A-Commands that are available in the scope
     */
    get allowedCommands(): Set<_CommandType[number]>;
    /**
     * Returns a list of Constructors for A-Fragments that are available in the scope
     */
    get allowedFragments(): Set<A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>>;
    /**
     * Returns a list of Constructors for A-Entities that are available in the scope
     */
    get allowedEntities(): Set<A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>>;
    /**
     * Returns an Array of entities registered in the scope
     *
     * [!] One entity per aseid
     */
    get entities(): Array<_EntityType[number]>;
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
     * Returns an Array of commands registered in the scope
     *
     * [!] One command per command aseid
     * [!!] There may be any number of instances of the same command code, but with different aseids.
     */
    get commands(): Array<InstanceType<_CommandType[number]>>;
    /**
     * A_Scope refers to the visibility and accessibility of :
     * - variables,
     * - Components,
     * - Context Fragments
     * - Commands
     * - Entities
     * - and objects in different parts of your code.
     * Scope determines where a particular piece of data (like a variable or function)
     * can be accessed, modified, or referenced, and it plays a crucial role in avoiding naming collisions and ensuring data integrity.
     *
     * [!] The scope behavior is similar to tree structure where each scope can have a parent scope and inherit its components, fragments, entities and commands
     *
     * @param params
     * @param config
     */
    constructor(params: Partial<A_TYPES__ScopeConstructor<_ComponentType, _CommandType, _EntityType, _FragmentType>>, config?: Partial<A_TYPES__ScopeConfig>);
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
     * This method is used to initialize the entities in the scope
     *
     * This method only registers the entities in the scope in case they are not registered yet
     *
     * @param _entities
     */
    protected initEntities(_entities?: _EntityType): void;
    /**
     * This method is used to initialize the fragments in the scope
     *
     * This method only registers the fragments in the scope in case they are not registered yet
     *
     * @param _fragments
     */
    protected initFragments(_fragments?: _FragmentType): void;
    /**
     * This method is used to initialize the commands in the scope
     *
     * This method only registers the commands in the scope in case they are not registered yet
     *
     * @param _commands
     */
    protected initCommands(_commands?: _CommandType): void;
    /**
     * This method is used to get or set the parent scope
     *
     * [!] Note that setting the parent scope will override the existing parent scope
     *
     * @param setValue
     * @returns
     */
    parent(setValue?: A_Scope): A_Scope | undefined;
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
    component: A_TYPES__AllowedComponentsConstructor<T>): boolean;
    has<T extends A_Entity>(
    /**
     * Provide an entity constructor to check if it's available in the scope
     *
     * [!] Note that entities are unique per aseid, so this method checks if there's at least one entity of the provided type in the scope
     */
    entity: A_TYPES__AllowedEntitiesConstructor<T>): boolean;
    has<T extends A_Fragment>(
    /**
     * Provide a fragment constructor to check if it's available in the scope
     */
    fragment: A_TYPES__AllowedFragmentsConstructor<T>): boolean;
    has<T extends A_Fragment>(
    /**
     * Provide a command constructor to check if it's available in the scope
     */
    command: A_TYPES__AllowedCommandsConstructor<T>): boolean;
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
     * - In case of search for A_Command please ensure that provided string corresponds to the static code property of the class. [!] By default it's the kebab-case of the class name
     * - In case of search for A_Component please ensure that provided string corresponds to the class name in PascalCase
     *
     * @param name
     * @returns
     */
    resolveConstructor<T extends A_Command>(
    /**
     * Provide the command name or code to retrieve its constructor
     */
    name: string): A_TYPES__AllowedCommandsConstructor<T>;
    resolveConstructor<T extends A_Entity>(
    /**
     * Provide the entity name or static entity property to retrieve its constructor
     */
    name: string): A_TYPES__AllowedEntitiesConstructor<T>;
    resolveConstructor<T extends A_Component>(
    /**
     * Provide the component name in PascalCase to retrieve its constructor
     */
    name: string): A_TYPES__AllowedComponentsConstructor<T>;
    resolveConstructor<T extends A_Fragment>(
    /**
     * Provide the fragment name in PascalCase to retrieve its constructor
     */
    name: string): A_TYPES__AllowedFragmentsConstructor<T>;
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
    component: A_TYPES__AllowedComponentsConstructor<T>): T;
    resolve<T extends A_TYPES__AllowedComponentsConstructor[]>(
    /**
     * Provide an array of component constructors to resolve their instances from the scope
     */
    components: [...T]): Array<InstanceType<T[number]>>;
    resolve<T extends A_Fragment>(
    /**
     * Provide a fragment constructor to resolve its instance from the scope
     */
    fragment: A_TYPES__AllowedFragmentsConstructor<T>): T;
    resolve<T extends A_TYPES__AllowedFragmentsConstructor[]>(
    /**
     * Provide an array of fragment constructors to resolve their instances from the scope
     */
    fragments: [...T]): Array<InstanceType<T[number]>>;
    resolve<T extends A_Command>(
    /**
     * Provide a command constructor to resolve its instance from the scope
     */
    command: A_TYPES__AllowedCommandsConstructor<T>): T;
    resolve<T extends A_TYPES__AllowedCommandsConstructor[]>(
    /**
     * Provide an array of command constructors to resolve their instances from the scope
     */
    commands: [...T]): Array<InstanceType<T[number]>>;
    resolve<T extends A_Entity>(
    /**
     * Provide an entity constructor to resolve its instance or an array of instances from the scope
     */
    entity: A_TYPES__AllowedEntitiesConstructor<T>): T | undefined;
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
    entity: A_TYPES__AllowedEntitiesConstructor<T>, 
    /**
     * Provide optional instructions to find a specific entity or a set of entities
     */
    instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): Array<T>;
    private resolveByName;
    /**
     * This method is used internally to resolve a single component, fragment or entity from the scope
     *
     * @param component
     * @param instructions
     * @returns
     */
    private resolveOnce;
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
     * Should be similar to resolveEntity but for commands
     *
     * @param command
     */
    private resolveCommand;
    /**
     * This method is used to register the component in the scope
     *
     * @param fragment
     */
    register<T extends A_Component>(
    /**
     * Provide a component constructor to register it in the scope
     */
    component: A_TYPES__AllowedComponentsConstructor<T>): void;
    register<T extends A_Entity>(
    /**
     * Provide an entity constructor to register it in the scope
     */
    entity: A_TYPES__AllowedEntitiesConstructor<T>): void;
    register<T extends A_Command>(
    /**
     * Provide a command constructor to register it in the scope
     */
    command: A_TYPES__AllowedCommandsConstructor<T>): void;
    register<T extends A_Fragment>(
    /**
     * Provide a command instance to register it in the scope
     */
    fragment: A_TYPES__AllowedFragmentsConstructor<T>): void;
    register(
    /**
     * Provide an entity instance to register it in the scope
     */
    entity: A_Entity): void;
    register(
    /**
     * Provide a command instance to register it in the scope
     */
    component: A_Component): void;
    register(
    /**
     * Provide a command instance to register it in the scope
     */
    command: A_Command): void;
    register(
    /**
     * Provide a fragment instance to register it in the scope
     */
    fragment: A_Fragment): void;
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
     * Type guard to check if the constructor is of type A_Component
     *
     * @param ctor
     * @returns
     */
    protected isComponentConstructor(ctor: unknown): ctor is A_TYPES__AllowedComponentsConstructor;
    /**
     * Type guard to check if the constructor is of type A_Command
     *
     * @param ctor
     * @returns
     */
    protected isCommandConstructor(ctor: unknown): ctor is A_TYPES__AllowedCommandsConstructor;
    /**
     * Type guard to check if the constructor is of type A_Fragment
     *
     * @param ctor
     * @returns
     */
    protected isFragmentConstructor(ctor: any): ctor is A_TYPES__AllowedFragmentsConstructor;
    /**
     * Type guard to check if the constructor is of type A_Entity
     *
     * @param ctor
     * @returns
     */
    protected isEntityConstructor(ctor: unknown): ctor is A_TYPES__AllowedEntitiesConstructor;
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    protected isScopeConstructor(ctor: unknown): ctor is A_TYPES__AllowedScopesConstructor;
    /**
     * Type guard to check if the constructor is of type A_Component and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedComponent(ctor: unknown): ctor is _ComponentType[number];
    /**
     * Type guard to check if the constructor is of type A_Command and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedCommand(ctor: unknown): ctor is _CommandType[number];
    /**
     * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedEntity(ctor: unknown): ctor is A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>;
    /**
     * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
     *
     * @param ctor
     * @returns
     */
    protected isAllowedFragment(ctor: unknown): ctor is A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>;
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
