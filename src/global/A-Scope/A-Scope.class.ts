import {
    A_CommonHelper,
    A_Error,
    ASEID
} from "@adaas/a-utils";
import {
    A_TYPES__AllowedCommandsConstructor,
    A_TYPES__AllowedComponentsConstructor,
    A_TYPES__AllowedEntitiesConstructor,
    A_TYPES__AllowedFragmentsConstructor,
    A_TYPES__AllowedScopesConstructor,
    A_TYPES__ScopeConfig,
    A_TYPES__ScopeConstructor
} from './A-Scope.types'
import {
    A_TYPES__A_InjectDecorator_EntityInjectionInstructions,
    A_TYPES__A_InjectDecorator_EntityInjectionQuery,
} from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator.types";
import { A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Command } from "../A-Command/A-Command.class";




export class A_Scope<
    _ComponentType extends A_TYPES__AllowedComponentsConstructor[] = A_TYPES__AllowedComponentsConstructor[],
    _CommandType extends A_TYPES__AllowedCommandsConstructor[] = A_TYPES__AllowedCommandsConstructor[],
    _EntityType extends A_Entity[] = A_Entity[],
    _FragmentType extends A_Fragment[] = A_Fragment[],
> {

    /**
     * Scope Name uses for identification and logging purposes
     */
    readonly name: string = '';
    /**
     * Parent scope reference, used for inheritance of components, fragments, entities and commands
     */
    protected _parent?: A_Scope;

    // ===========================================================================
    // --------------------ALLowed Constructors--------------------------------
    // ===========================================================================
    /**
     * A set of allowed components, A set of constructors that are allowed in the scope
     *      
     */
    protected _allowedComponents = new Set<_ComponentType[number]>();
    /**
     * A set of allowed entities, A set of constructors that are allowed in the scope
     */
    protected _allowedEntities = new Set<A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>>();
    /**
     * A set of allowed fragments, A set of constructors that are allowed in the scope
     */
    protected _allowedFragments = new Set<A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>>();
    /**
     * A set of allowed commands, A set of constructors that are allowed in the scope
     */
    protected _allowedCommands = new Set<_CommandType[number]>();


    // ===========================================================================
    // --------------------Internal Storage--------------------------------
    // ===========================================================================
    /**
     * Internal storage for the components, fragments, entities and commands
     */
    protected _components: Map<_ComponentType[number], InstanceType<_ComponentType[number]>> = new Map();
    /**
     * Storage for the fragments, should be weak as fragments are singletons per scope
     */
    protected _fragments: Map<A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>, _FragmentType[number]> = new Map();
    /**
     * Storage for the entities, should be strong as entities are unique per aseid
     */
    protected _entities: Map<string, _EntityType[number]> = new Map();
    /**
     * Storage for the commands, should be strong as commands are unique per code
     */
    protected _commands: Map<string, InstanceType<_CommandType[number]>> = new Map();



    // ===========================================================================
    // --------------------Readonly Allowed Properties----------------------------
    // ===========================================================================
    /**
     * Returns a list of Constructors for A-Components that are available in the scope
     */
    get allowedComponents() { return this._allowedComponents }
    /**
     * Returns a list of Constructors for A-Commands that are available in the scope
     */
    get allowedCommands() { return this._allowedCommands }
    /**
     * Returns a list of Constructors for A-Fragments that are available in the scope
     */
    get allowedFragments() { return this._allowedFragments }
    /**
     * Returns a list of Constructors for A-Entities that are available in the scope
     */
    get allowedEntities() { return this._allowedEntities }

    /**
     * Returns an Array of entities registered in the scope
     * 
     * [!] One entity per aseid
     */
    get entities(): Array<_EntityType[number]> { return Array.from(this._entities.values()) }
    /**
     * Returns an Array of fragments registered in the scope
     * 
     * [!] One fragment per scope
     */
    get fragments(): Array<_FragmentType[number]> { return Array.from(this._fragments.values()) }
    /**
     * Returns an Array of components registered in the scope
     * 
     * [!] One component instance per scope
     */
    get components(): Array<InstanceType<_ComponentType[number]>> { return Array.from(this._components.values()) }
    /**
     * Returns an Array of commands registered in the scope
     * 
     * [!] One command per command aseid
     * [!!] There may be any number of instances of the same command code, but with different aseids. 
     */
    get commands(): Array<InstanceType<_CommandType[number]>> { return Array.from(this._commands.values()) }


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
    constructor(
        params: Partial<A_TYPES__ScopeConstructor<_ComponentType, _CommandType, _EntityType, _FragmentType>>,
        config: Partial<A_TYPES__ScopeConfig> = {}
    ) {
        this.name = params.name || this.constructor.name

        this.initComponents(params.components);
        this.initCommands(params.commands);
        this.initFragments(params.fragments);
        this.initEntities(params.entities);

        if (config.parent) {
            this._parent = config.parent;
        }
    }

    //==========================================================================
    // --------------------Scope Initialization Methods---------------------------
    //==========================================================================

    /**
     * This method is used to initialize the components in the scope
     * To save memory components are initialized only when they are requested
     * 
     * This method only registers the component in the scope in case they are not registered yet
     * 
     * @param _components 
     */
    protected initComponents(_components?: _ComponentType) { _components?.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the entities in the scope
     * 
     * This method only registers the entities in the scope in case they are not registered yet
     * 
     * @param _entities 
     */
    protected initEntities(_entities?: _EntityType) { _entities?.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the fragments in the scope
     * 
     * This method only registers the fragments in the scope in case they are not registered yet
     * 
     * @param _fragments 
     */
    protected initFragments(_fragments?: _FragmentType) { _fragments?.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the commands in the scope
     * 
     * This method only registers the commands in the scope in case they are not registered yet
     * 
     * @param _commands 
     */
    protected initCommands(_commands?: _CommandType) { _commands?.forEach(this.register.bind(this)); }


    /**
     * This method is used to get or set the parent scope
     * 
     * [!] Note that setting the parent scope will override the existing parent scope
     * 
     * @param setValue 
     * @returns 
     */
    parent(setValue?: A_Scope): A_Scope | undefined {
        if (setValue) {
            return this.inherit(setValue);
        }

        return this._parent;
    }



    /**
     * This method is used to inherit from a parent scope
     * 
     * [!] This method checks for circular inheritance and throws an error if detected
     * 
     * @param parent 
     * @returns 
     */
    inherit(parent: A_Scope): A_Scope {
        // Prevent circular inheritance
        const circularCheck = this.checkCircularInheritance(parent);

        if (circularCheck)
            throw new A_Error(`Circular inheritance detected: ${[...circularCheck, parent.name].join(' -> ')}`);


        this._parent = parent;
        return this;
    }


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
        component: A_TYPES__AllowedComponentsConstructor<T>
    ): boolean
    has<T extends A_Entity>(
        /**
         * Provide an entity constructor to check if it's available in the scope
         * 
         * [!] Note that entities are unique per aseid, so this method checks if there's at least one entity of the provided type in the scope
         */
        entity: A_TYPES__AllowedEntitiesConstructor<T>
    ): boolean
    has<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to check if it's available in the scope
         */
        fragment: A_TYPES__AllowedFragmentsConstructor<T>
    ): boolean
    has<T extends A_Fragment>(
        /**
         * Provide a command constructor to check if it's available in the scope
         */
        command: A_TYPES__AllowedCommandsConstructor<T>
    ): boolean
    has(
        /**
         * Provide a string to check if a component, entity or fragment with the provided name is available in the scope
         */
        constructor: string
    ): boolean
    has(
        ctor: unknown
    ): boolean {

        let found = false;

        switch (true) {
            // 1) Check by string name.  
            case typeof ctor === 'string': {
                // 1.1 Check if it's a component name
                const possibleComponent = Array.from(this.allowedComponents).find(c => c.name === ctor);
                if (possibleComponent) found = true;

                // 1.2 Check if it's a fragment name
                const possibleFragment = Array.from(this.allowedFragments).find(f => f.name === ctor);
                if (possibleFragment) found = true;

                // 1.3 Check if it's a command code or name
                const possibleCommand = Array.from(this.allowedCommands).find(c => c.name === ctor);
                if (possibleCommand) found = true;

                // 1.4 Check if it's an entity name or entity static entity property
                const possibleEntity = Array.from(this.allowedEntities).find(e => e.name === ctor);
                if (possibleEntity) found = true;

                // 1.5 If not found in current scope, check parent scope
                if (!!this._parent)
                    return this._parent.has(ctor);

                return false;
            }
            // 2) Check if it's a Component
            case this.isComponentConstructor(ctor): {
                found = this.isAllowedComponent(ctor);

                break;
            }
            // 3) Check if it's an Entity
            case this.isEntityConstructor(ctor): {
                found = this.isAllowedEntity(ctor);

                break;
            }
            // 4) Check if it's a Fragment
            case this.isFragmentConstructor(ctor): {
                found = this.isAllowedFragment(ctor);

                break;
            }
            // 5) Check if it's a Command
            case this.isCommandConstructor(ctor): {
                found = this.isAllowedCommand(ctor);

                break;
            }
        }

        if (!found && !!this._parent)
            return this._parent.has(ctor as any);


        return found;
    }


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
    merge(anotherScope: A_Scope): A_Scope {
        const merged = new A_Scope(
            {
                name: `${this.name} + ${anotherScope.name}`,

                components: [...this.allowedComponents, ...anotherScope.allowedComponents],
                commands: [...this.allowedCommands, ...anotherScope.allowedCommands],

                fragments: [...this.fragments, ...anotherScope.fragments],
                entities: [...this.entities, ...anotherScope.entities],
            },
            {
                parent: this._parent || anotherScope._parent
            }
        );

        return merged;
    }


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
        name: string
    ): A_TYPES__AllowedCommandsConstructor<T>
    resolveConstructor<T extends A_Entity>(
        /**
         * Provide the entity name or static entity property to retrieve its constructor
         */
        name: string
    ): A_TYPES__AllowedEntitiesConstructor<T>
    resolveConstructor<T extends A_Component>(
        /**
         * Provide the component name in PascalCase to retrieve its constructor
         */
        name: string
    ): A_TYPES__AllowedComponentsConstructor<T>
    resolveConstructor<T extends A_Fragment>(
        /**
         * Provide the fragment name in PascalCase to retrieve its constructor
         */
        name: string
    ): A_TYPES__AllowedFragmentsConstructor<T>
    resolveConstructor<T extends A_Command | A_Entity | A_Component | A_Fragment>(name: string): A_TYPES__AllowedCommandsConstructor<T> | A_TYPES__AllowedEntitiesConstructor<T> | A_TYPES__AllowedComponentsConstructor<T> | A_TYPES__AllowedFragmentsConstructor<T> {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(
            c => c.name === name
                || c.name === A_CommonHelper.toPascalCase(name)
        );
        if (component) return component as A_TYPES__AllowedComponentsConstructor<T>;

        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(
            e => e.name === name
                || e.name === A_CommonHelper.toPascalCase(name)
                || (e as any).entity === name
                || (e as any).entity === A_CommonHelper.toKebabCase(name)
        );
        if (entity) return entity as A_TYPES__AllowedEntitiesConstructor<T>;

        // 3) Check commands
        const command = Array.from(this.allowedCommands).find(c => (c as any).code === name
            || (c as any).name === A_CommonHelper.toPascalCase(name)
            || (c as any).code === A_CommonHelper.toKebabCase(name)
        );
        if (command) return command as A_TYPES__AllowedCommandsConstructor<T>;

        // 4) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_CommonHelper.toPascalCase(name)
        );
        if (fragment) return fragment as A_TYPES__AllowedFragmentsConstructor<T>;

        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveConstructor(name) as any;
        }

        throw new Error(`Component or Entity with name ${name} not found in the scope ${this.name}`);
    }



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
        component: A_TYPES__AllowedComponentsConstructor<T>
    ): T
    resolve<T extends A_TYPES__AllowedComponentsConstructor[]>(
        /**
         * Provide an array of component constructors to resolve their instances from the scope
         */
        components: [...T]
    ): Array<InstanceType<T[number]>>
    resolve<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__AllowedFragmentsConstructor<T>
    ): T
    resolve<T extends A_TYPES__AllowedFragmentsConstructor[]>(
        /**
         * Provide an array of fragment constructors to resolve their instances from the scope
         */
        fragments: [...T]
    ): Array<InstanceType<T[number]>>
    resolve<T extends A_Command>(
        /**
         * Provide a command constructor to resolve its instance from the scope
         */
        command: A_TYPES__AllowedCommandsConstructor<T>
    ): T
    resolve<T extends A_TYPES__AllowedCommandsConstructor[]>(
        /**
         * Provide an array of command constructors to resolve their instances from the scope
         */
        commands: [...T]
    ): Array<InstanceType<T[number]>>
    resolve<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__AllowedEntitiesConstructor<T>
    ): T | undefined
    resolve<T extends A_Scope>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        scope: new (...args: any[]) => T
    ): T
    resolve<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__AllowedEntitiesConstructor<T>,
        /**
         * Provide optional instructions to find a specific entity or a set of entities
         */
        instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>
    ): Array<T>
    // base definition
    resolve<T extends A_Component | A_Fragment | A_Entity | A_Command>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: unknown,
        param2?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): T | Array<T> {
        switch (true) {
            case Array.isArray(param1): {
                return param1.map(c => this.resolveOnce(c, param2)).filter(Boolean) as Array<T>;
            }

            case typeof param1 === 'function': {
                return this.resolveOnce(param1, param2);
            }


            case typeof param1 === 'string': {
                return this.resolveByName(param1) as T;
            }

            default: {
                throw new A_Error(`Invalid parameter provided to resolve method: ${param1} in scope ${this.name}`);
            }
        }
    }




    // ==================================================================================================
    // --------------------------------------------------------------------------------------------------
    // -------------------------------------INTERNAL RESOLVERS-------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // ==================================================================================================
    private resolveByName(name: string): _EntityType[number] | InstanceType<_ComponentType[number]> | _FragmentType[number] | InstanceType<_CommandType[number]> {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(
            c => c.name === name
                || c.name === A_CommonHelper.toPascalCase(name)
        );
        if (component) return this.resolveOnce(component) as InstanceType<_ComponentType[number]>;

        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(
            e => e.name === name
                || e.name === A_CommonHelper.toPascalCase(name)
                || (e as any).entity === name
                || (e as any).entity === A_CommonHelper.toKebabCase(name)
        );
        if (entity) return this.resolveOnce(entity) as _EntityType[number];

        // 3) Check commands
        const command = Array.from(this.allowedCommands).find(c => (c as any).code === name
            || (c as any).name === A_CommonHelper.toPascalCase(name)
            || (c as any).code === A_CommonHelper.toKebabCase(name)
        );
        if (command) return this.resolveOnce(command) as InstanceType<_CommandType[number]>;

        // 4) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_CommonHelper.toPascalCase(name)
        );
        if (fragment) return this.resolveOnce(fragment) as _FragmentType[number];

        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveByName(name) as any;
        }

        throw new Error(`Component or Entity with name ${name} not found in the scope ${this.name}`);
    }

    /**
     * This method is used internally to resolve a single component, fragment or entity from the scope
     * 
     * @param component 
     * @param instructions 
     * @returns 
     */
    private resolveOnce<T extends A_Component | A_Fragment | A_Entity | A_Command | A_Scope>(
        component: unknown,
        instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): T | Array<T> {

        if (this.isScopeConstructor(component))
            component

        if (typeof component == 'function' && (component as any).name === 'A_Scope')
            component

        switch (true) {
            case this.isEntityConstructor(component): {
                return this.resolveEntity(component, instructions) as T | Array<T>;
            }
            case this.isFragmentConstructor(component): {
                return this.resolveFragment(component) as T;
            }
            case this.isCommandConstructor(component): {
                return this.resolveCommand(component) as T;
            }
            case this.isScopeConstructor(component): {
                return this.resolveScope(component) as T;
            }
            case this.isComponentConstructor(component): {
                return this.resolveComponent(component) as T;
            }
            default:
                throw new Error(`Injected Component ${component} not found in the scope`);
        }
    }

    /**
     * This method is used internally to resolve a single entity from the scope based on the provided instructions
     * 
     * [!] Note that this method can return either a single entity or an array of entities depending on the instructions provided
     * 
     * @param entity 
     * @param instructions 
     * @returns 
     */
    private resolveEntity<T extends A_Entity>(
        entity: A_TYPES__AllowedEntitiesConstructor<T>,
        instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>
    ): T | Array<T> | undefined {

        const query = instructions?.query || {} as Partial<A_TYPES__A_InjectDecorator_EntityInjectionQuery<T>>;
        const count = instructions?.pagination?.count || 1;

        switch (true) {
            /**
             * 1) In case when no instructions provided, return the first found entity of the provided type
             * 
             * [!] Note that it returns ONLY ONE entity
             * [!!] In case when no entity found in the current scope, it tries to resolve it from the parent scope (if exists)
             */
            case !instructions: {
                const found = this.entities.find(e => e instanceof entity);

                switch (true) {
                    case !!found:
                        return found as T;

                    case !found && !!this._parent:
                        return this._parent.resolveEntity(entity, instructions);

                    default:
                        throw new Error(`Entity ${entity.name} not found in the scope ${this.name}`);
                }
            }
            /**
             * 2) In case when aseid is provided in the query, we can directly get the entity from the map
             * 
             * [!] Note that it returns ONLY ONE entity
             */
            case !!query.aseid
                && typeof query.aseid === 'string'
                && this._entities.has(query.aseid): {
                    return this._entities.get(query.aseid) as T;
                }
            /**
             * 3) In case when aseid is provided as ASEID instance, we can directly get the entity from the map
             * 
             * [!] Note that it returns ONLY ONE entity
             */
            case !!query.aseid
                && typeof query.aseid === 'object'
                && query.aseid instanceof ASEID
                && this._entities.has(query.aseid.toString()): {
                    return this._entities.get(query.aseid.toString()) as T;
                }
            /**
             * 4) In case when id is provided in the query, we have to find the entity by the id
             * 
             * [!]  Note that it returns ONLY ONE entity
             */
            case !!query.id: {

                const found = this.entities
                    .filter(e => e instanceof entity)
                    .find(e => String(e.id) === String(query.id));

                return found as T;
            }
            /**
             * 5) In case when there's a query object, we have to filter the entities by the query
             * 
             * [!] Note that it can return either a single entity or an array of entities depending on the count instruction
             * [!!] In case when no entity found in the current scope, it tries to resolve it from the parent scope (if exists)
             */
            default: {

                const found = this.entities
                    .filter(e => e instanceof entity)
                    .filter(e => {
                        return Object
                            .entries(query)
                            .every(([key, value]) => {
                                if (key in e) {
                                    return (e as any)[key] === value;
                                }
                                return false;
                            });
                    });

                if (found.length === 0 && !!this._parent)
                    return this._parent.resolveEntity(entity, instructions);

                if (count === 1)
                    return found[0] as T;

                return found as T[];
            }
        }
    }

    /**
     * This method is used internally to resolve a single fragment from the scope
     * 
     * @param fragment 
     * @returns 
     */
    private resolveFragment<T extends A_Fragment>(fragment: A_TYPES__AllowedFragmentsConstructor<T>): _FragmentType[number] {
        const fragmentInstancePresented = this._fragments.get(fragment);

        switch (true) {
            case fragmentInstancePresented && this._fragments.has(fragment):
                return fragmentInstancePresented;

            case !fragmentInstancePresented && !!this._parent:
                return this._parent.resolveFragment(fragment);

            default:
                throw new Error(`Fragment ${fragment.name} not found in the scope ${this.name}`);
        }
    }
    /**
     *  This method is used internally to resolve a single scope from the current scope
     * 
     * @param scope 
     * @returns 
     */
    private resolveScope(scope: A_TYPES__AllowedScopesConstructor): A_Scope {
        return this;
    }
    /**
     * This method is used internally to resolve a single component from the scope
     * 
     * @param component 
     * @returns 
     */
    private resolveComponent<T extends A_Component>(component: A_TYPES__AllowedComponentsConstructor<T>): InstanceType<_ComponentType[number]> {

        //  The idea here that in case when Scope has no exact component we have to resolve it from the _parent
        //  BUT: if it's not presented in _parent  we have to check for inheritance
        //  That means that we should ensure that there's no components that are children of the required component
        switch (true) {
            // 1) In case when the component is available and exists in the scope
            case this.allowedComponents.has(component) && this._components.has(component): {
                return this._components.get(component)!;
            }

            // 2) In case the component available but does NOT exist in the scope
            case this.allowedComponents.has(component) && !this._components.has(component): {
                const componentMeta = A_Context.meta(component)

                const argsMeta = componentMeta.get(A_TYPES__ComponentMetaKey.INJECTIONS);

                const resolvedArgs = (argsMeta?.get('constructor') || [])
                    .map(arg => {
                        if ('instructions' in arg) {
                            const { target, instructions } = arg
                            return this.resolve(
                                target,
                                instructions
                            );
                        }
                        // TODO: Fix types mismatch here
                        return this.resolve<T>(arg.target as any);
                    });

                const newComponent = new component(...resolvedArgs)

                this.register(newComponent);

                return this._components.get(component)!;
            }

            // 3) In case when there's a component that is inherited from the required component
            case !this.allowedComponents.has(component) && Array.from(this.allowedComponents).some(el => A_CommonHelper.isInheritedFrom(el, component)): {
                const found = Array.from(this.allowedComponents).find(el => A_CommonHelper.isInheritedFrom(el, component))!;

                return this.resolveComponent(found);
            }

            // 4) In case when the component is not available in the scope but the _parent is available
            case !!this._parent: {
                return this._parent.resolveComponent(component) as InstanceType<_ComponentType[number]>;
            }

            default:
                throw new Error(`Component ${component.name} not found in the scope ${this.name}`);
        }
    }
    /**
     * Should be similar to resolveEntity but for commands
     * 
     * @param command 
     */
    private resolveCommand(command: _CommandType[number]): InstanceType<_CommandType[number]> {

        const found = this.commands.find(e => e instanceof command);

        switch (true) {
            case !!found:
                return found

            case !found && !!this._parent:
                return this._parent.resolveCommand(command) as InstanceType<_CommandType[number]>;

            default:
                throw new Error(`Command ${command.name} not found in the scope ${this.name}`);
        }
    }



    /**
     * This method is used to register the component in the scope
     * 
     * @param fragment 
     */
    register<T extends A_Component>(
        /**
         * Provide a component constructor to register it in the scope
         */
        component: A_TYPES__AllowedComponentsConstructor<T>
    ): void
    register<T extends A_Entity>(
        /**
         * Provide an entity constructor to register it in the scope
         */
        entity: A_TYPES__AllowedEntitiesConstructor<T>
    ): void
    register<T extends A_Command>(
        /**
         * Provide a command constructor to register it in the scope
         */
        command: A_TYPES__AllowedCommandsConstructor<T>
    ): void
    register<T extends A_Fragment>(
        /**
         * Provide a command instance to register it in the scope
         */
        fragment: A_TYPES__AllowedFragmentsConstructor<T>
    ): void
    register(
        /**
         * Provide an entity instance to register it in the scope
         */
        entity: A_Entity
    ): void
    register(
        /**
         * Provide a command instance to register it in the scope
         */
        component: A_Component
    ): void
    register(
        /**
         * Provide a command instance to register it in the scope
         */
        command: A_Command
    ): void
    register(
        /**
         * Provide a fragment instance to register it in the scope
         */
        fragment: A_Fragment
    ): void
    register(
        param1: unknown
    ): void {
        switch (true) {
            // ------------------------------------------
            // ------------ Instances ----------------
            // ------------------------------------------
            // 1) In case when it's a A-Component instance
            case param1 instanceof A_Component: {

                if (!this.allowedComponents.has(param1.constructor as _ComponentType[number]))
                    this.allowedComponents.add(param1.constructor as _ComponentType[number]);

                this._components.set(
                    param1.constructor as _ComponentType[number],
                    param1 as InstanceType<_ComponentType[number]>
                );

                A_Context.register(this, param1);

                break;
            }
            // 2) In case when it's a A-Command instance
            case param1 instanceof A_Command: {

                if (!this.allowedCommands.has(param1.constructor as _CommandType[number]))
                    this.allowedCommands.add(param1.constructor as _CommandType[number]);

                this._commands.set((param1 as any).constructor.code, param1 as InstanceType<_CommandType[number]>);

                A_Context.register(this, param1);
                break;
            }
            // 3) In case when it's a A-Entity instance
            case param1 instanceof A_Entity && !this._entities.has(param1.aseid.toString()): {

                if (!this.allowedEntities.has(param1.constructor as A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>))
                    this.allowedEntities.add(param1.constructor as A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>);

                this._entities.set(param1.aseid.toString(), param1);
                A_Context.register(this, param1);
                break;
            }
            // 4) In case when it's a A-Fragment instance
            case param1 instanceof A_Fragment: {

                if (!this.allowedFragments.has(param1.constructor as A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>))
                    this.allowedFragments.add(param1.constructor as A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>);

                this._fragments.set(
                    param1.constructor as A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>,
                    param1 as _FragmentType[number]
                );

                A_Context.register(this, param1);

                break;
            }
            // ------------------------------------------
            // ------------ Constructors ----------------
            // ------------------------------------------
            // 5) In case when it's a A-Component constructor
            case this.isComponentConstructor(param1): {
                if (!this.allowedComponents.has(param1))
                    this.allowedComponents.add(param1 as _ComponentType[number]);
                break;
            }
            // 6) In case when it's a A-Command constructor
            case this.isCommandConstructor(param1): {
                if (!this.allowedCommands.has(param1))
                    this.allowedCommands.add(param1 as _CommandType[number]);
                break;
            }
            // 7) In case when it's a A-Fragment constructor
            case this.isFragmentConstructor(param1): {
                if (!this.allowedFragments.has(param1))
                    this.allowedFragments.add(param1 as A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]>);
                break;
            }
            // 8) In case when it's a A-Entity constructor
            case this.isEntityConstructor(param1): {
                if (!this.allowedEntities.has(param1))
                    this.allowedEntities.add(param1 as A_TYPES__AllowedEntitiesConstructor<_EntityType[number]>);
                break;
            }

            default:
                if (param1 instanceof A_Entity)
                    throw new Error(`Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`);
                else if (param1 instanceof A_Fragment)
                    throw new Error(`Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`);
                else
                    throw new Error(`Cannot register ${param1} in the scope ${this.name}`);
        }
    }




    /**
     * This method is useful when you want to serialize the scope to JSON
     * 
     * [!] Note this is not a deep serialization, only the fragments are serialized
     * [!] Fragments are a storage for information which is relevant to the scope
     * 
     * @returns 
     */
    toJSON(): Record<string, any> {
        return this.fragments
            .reduce((acc, fragment) => {

                const serialized = fragment.toJSON()

                return {
                    ...acc,
                    [serialized.name]: serialized
                }
            }, {});
    }



    //==========================================================================
    // --------------------Scope Type Check Helpers---------------------------
    //==========================================================================
    /**
     * Type guard to check if the constructor is of type A_Component
     * 
     * @param ctor 
     * @returns 
     */
    protected isComponentConstructor(ctor: unknown): ctor is A_TYPES__AllowedComponentsConstructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Component);
    }
    /**
     * Type guard to check if the constructor is of type A_Command
     * 
     * @param ctor 
     * @returns 
     */
    protected isCommandConstructor(ctor: unknown): ctor is A_TYPES__AllowedCommandsConstructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Command);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment
     * 
     * @param ctor 
     * @returns 
     */
    protected isFragmentConstructor(ctor: any): ctor is A_TYPES__AllowedFragmentsConstructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Fragment);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity
     * 
     * @param ctor 
     * @returns 
     */
    protected isEntityConstructor(ctor: unknown): ctor is A_TYPES__AllowedEntitiesConstructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Entity);
    }
    /**
     * Type guard to check if the constructor is of type A_Scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isScopeConstructor(ctor: unknown): ctor is A_TYPES__AllowedScopesConstructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Scope);
    }
    // -------------------------------------------------------------------------------
    // --------------------Scope Allowed Type Check Helpers---------------------------
    // -------------------------------------------------------------------------------
    /**
     * Type guard to check if the constructor is of type A_Component and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedComponent(ctor: unknown): ctor is _ComponentType[number] {
        return this.isComponentConstructor(ctor) && this.allowedComponents.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Command and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedCommand(ctor: unknown): ctor is _CommandType[number] {
        return this.isCommandConstructor(ctor) && this.allowedCommands.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedEntity(ctor: unknown): ctor is A_TYPES__AllowedEntitiesConstructor<_EntityType[number]> {
        return this.isEntityConstructor(ctor) && this.allowedEntities.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedFragment(ctor: unknown): ctor is A_TYPES__AllowedFragmentsConstructor<_FragmentType[number]> {
        return this.isFragmentConstructor(ctor) && this.allowedFragments.has(ctor);
    }




    // ==========================================================================
    // --------------------DEBUG & Helpers Methods--------------------------------
    // ===========================================================================
    /**
     * This method is used to check if the scope is inherited from another scope
     * 
     * @param scope 
     * @returns 
     */
    isInheritedFrom(scope: A_Scope): boolean {
        let current: A_Scope | undefined = this;

        while (current) {
            if (current === scope) {
                return true;
            }
            current = current._parent;
        }

        return false;
    }

    /**
     * Helper method to check circular inheritance
     * Should return a full sequence of inheritance for logging purposes
     * 
     * @param scope 
     * @returns 
     */
    checkCircularInheritance(scope: A_Scope): Array<string> | false {
        const inheritanceChain: Array<string> = [];
        let current: A_Scope | undefined = this._parent;

        while (current) {
            inheritanceChain.push(current.name);
            if (current === scope) {
                return inheritanceChain;
            }
            current = current._parent;
        }

        return false;
    }

    /**
     * Helper method to print the inheritance chain of the scope
     */
    printInheritanceChain(): void {
        const chain: Array<string> = [];
        let current: A_Scope | undefined = this;

        while (current) {
            chain.push(current.name);
            current = current._parent;
        }

        console.log(chain.join(' -> '));
    }
}

