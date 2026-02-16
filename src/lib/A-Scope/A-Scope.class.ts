import {
    A_TYPES__ScopeConfig,
    A_TYPES__Scope_Init,
    A_TYPES__ScopeLinkedComponents,
    A_TYPES__Scope_Constructor,
    A_TYPES__ScopeLinkedConstructors
} from './A-Scope.types'
import {
    A_Fragment,
    A_TYPES__Fragment_Constructor
} from "@adaas/a-concept/a-fragment";
import { A_Context } from "@adaas/a-concept/a-context";
import {
    A_Component,
    A_TYPES__Component_Constructor,
    A_TYPES__ComponentMetaKey
} from "@adaas/a-concept/a-component";
import {
    A_Entity,
    A_TYPES__Entity_Constructor
} from "@adaas/a-concept/a-entity";
import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_FormatterHelper} from "@adaas/a-concept/helpers/A_Formatter.helper";
import { A_CommonHelper} from "@adaas/a-concept/helpers/A_Common.helper";
import {
    A_Error,
    A_TYPES__Error_Constructor
} from "@adaas/a-concept/a-error";
import { A_ScopeError } from '@adaas/a-concept/a-scope';
import { A_Meta } from '@adaas/a-concept/a-meta';
import {
    A_Dependency,
    A_TYPES__A_DependencyInjectable
} from '@adaas/a-concept/a-dependency';
import { A_TYPES__Ctor } from '@adaas/a-concept/types';
import { ASEID } from '@adaas/a-concept/aseid';




export class A_Scope<
    _MetaItems extends Record<string, any> = any,
    _ComponentType extends A_TYPES__Component_Constructor[] = A_TYPES__Component_Constructor[],
    _ErrorType extends A_TYPES__Error_Constructor[] = A_TYPES__Error_Constructor[],
    _EntityType extends A_TYPES__Entity_Constructor[] = A_TYPES__Entity_Constructor[],
    _FragmentType extends A_Fragment[] = A_Fragment[],
> {

    /**
     * Scope Name uses for identification and logging purposes
     */
    protected _name!: string;
    /**
     * Parent scope reference, used for inheritance of components, fragments, entities and commands
     */
    protected _parent?: A_Scope;
    /**
     * Internal meta storage using A_Meta for type-safe key-value operations.
     * This stores all the scope's runtime data that can be accessed and modified
     * throughout the execution pipeline or within running containers.
     */
    protected _meta: A_Meta<_MetaItems> = new A_Meta<_MetaItems>();

    // ===========================================================================
    // --------------------ALLowed Constructors--------------------------------
    // ===========================================================================
    /**
     * A set of allowed components, A set of constructors that are allowed in the scope
     *      
     */
    protected _allowedComponents = new Set<_ComponentType[number]>();
    /**
     * A set of allowed errors, A set of constructors that are allowed in the scope
     */
    protected _allowedErrors = new Set<_ErrorType[number]>();
    /**
     * A set of allowed entities, A set of constructors that are allowed in the scope
     */
    protected _allowedEntities = new Set<_EntityType[number]>();
    /**
     * A set of allowed fragments, A set of constructors that are allowed in the scope
     */
    protected _allowedFragments = new Set<A_TYPES__Fragment_Constructor<_FragmentType[number]>>();



    // ===========================================================================
    // --------------------Internal Storage--------------------------------
    // ===========================================================================
    /**
     * Storage for the components, should be strong as components are unique per scope
     */
    protected _components: Map<_ComponentType[number], InstanceType<_ComponentType[number]>> = new Map();
    /**
     * Storage for the errors, should be strong as errors are unique per code
     */
    protected _errors: Map<string, InstanceType<_ErrorType[number]>> = new Map();
    /**
     * Storage for the entities, should be strong as entities are unique per aseid
     */
    protected _entities: Map<string, InstanceType<_EntityType[number]>> = new Map();
    /**
     * Storage for the fragments, should be weak as fragments are singletons per scope
     */
    protected _fragments: Map<A_TYPES__Fragment_Constructor<_FragmentType[number]>, _FragmentType[number]> = new Map();
    /**
     * Storage for imported scopes 
     */
    protected _imports: Set<A_Scope> = new Set();



    // ===========================================================================
    // --------------------Readonly Allowed Properties----------------------------
    // ===========================================================================
    /**
     * Returns the name of the scope
     */
    get name() { return this._name }
    /**
     * Returns the meta object of the scope
     */
    get meta() { return this._meta }
    /**
     * Returns a list of Constructors for A-Components that are available in the scope
     */
    get allowedComponents() { return this._allowedComponents }
    /**
     * Returns a list of Constructors for A-Entities that are available in the scope
     */
    get allowedEntities() { return this._allowedEntities }
    /**
     * Returns a list of Constructors for A-Fragments that are available in the scope
     */
    get allowedFragments() { return this._allowedFragments }
    /**
     * Returns a list of Constructors for A-Errors that are available in the scope
     */
    get allowedErrors() { return this._allowedErrors }
    // ===========================================================================
    // --------------------Readonly Registered Properties--------------------------
    // ===========================================================================
    /**
     * Returns an Array of entities registered in the scope
     * 
     * [!] One entity per aseid
     */
    get entities(): Array<InstanceType<_EntityType[number]>> { return Array.from(this._entities.values()) }
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
     * Returns an Array of errors registered in the scope
     * 
     * [!] One error per code
     */
    get errors(): Array<InstanceType<_ErrorType[number]>> { return Array.from(this._errors.values()) }
    /**
     * Returns an Array of imported scopes
     * [!] Imported scopes are scopes that have been imported into the current scope using the import() method
     */
    get imports(): Array<A_Scope> { return Array.from(this._imports.values()) }

    /**
     * Returns the parent scope of the current scope
     * 
     * @param setValue 
     * @returns 
     */
    get parent(): A_Scope | undefined {
        return this._parent;
    }
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
    constructor()
    constructor(
        /**
         * A set of constructors that are allowed in the scope
         */
        params: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>,
        /**
         * Configuration options for the scope
         */
        config?: Partial<A_TYPES__ScopeConfig>
    )
    constructor(
        param1?: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>,
        param2?: Partial<A_TYPES__ScopeConfig>
    ) {
        const initializer = this.getInitializer(param1);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1, param2);
    }

    /**
     * Generator to iterate through all parent scopes
     */
    *parents(): Generator<A_Scope> {
        let currentParent = this._parent;
        while (currentParent) {
            yield currentParent;
            currentParent = currentParent._parent;
        }
    }

    /**
     * This method is used to retrieve a parent scope at a specific level
     * 
     * [!] Note that if the level is out of bounds, undefined is returned
     * [!!] Uses negative values for levels (e.g. -1 for immediate parent, -2 for grandparent, etc.)
     * 
     * @param level 
     * @returns 
     */
    parentOffset<T extends A_Scope>(
        /**
         * Level of the parent scope to retrieve
         * 
         * Examples:
         * - level 0 - this scope
         * - level -1 - parent
         * - level -2 - grandparent
         */
        layerOffset: number
    ): T | undefined {
        let parentScope: A_Scope | undefined = this;

        while (layerOffset <= -1 && parentScope) {
            parentScope = parentScope.parent;
            layerOffset++;
        }

        return parentScope as T
    }


    /**
     * Determines which initializer method to use based on the type of the first parameter.
     * 
     * @param param1 
     * @returns
     */
    protected getInitializer(
        param1?: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>>,
        param2?: Partial<A_TYPES__ScopeConfig>
    ): (param1: any, param2: any) => void | (() => void) {
        switch (true) {
            case !param1 && !param2: ;
                return this.defaultInitialized;

            case !!param1:
                return this.defaultInitialized;
            default:
                throw new A_ScopeError(A_ScopeError.ConstructorError, 'Invalid parameters provided to A_Scope constructor');
        }
    }



    protected defaultInitialized(
        params: Partial<A_TYPES__Scope_Init<_MetaItems, _ComponentType, _ErrorType, _EntityType, _FragmentType>> = {},
        config: Partial<A_TYPES__ScopeConfig> = {}
    ) {
        this._name = params.name || this.constructor.name

        this.initComponents(params.components);
        this.initErrors(params.errors);
        this.initFragments(params.fragments);
        this.initEntities(params.entities);
        this.initMeta(params.meta);

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
     * This method is used to initialize the errors in the scope
     * 
     * This method only registers the errors in the scope in case they are not registered yet
     * 
     * @param _errors 
     */
    protected initErrors(_errors?: _ErrorType) { _errors?.forEach(this.register.bind(this)); }
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
    ]) { _entities?.forEach(ent => this.register(ent as any)); }
    /**
     * This method is used to initialize the fragments in the scope
     * 
     * This method only registers the fragments in the scope in case they are not registered yet
     * 
     * @param _fragments 
     */
    protected initFragments(_fragments?: _FragmentType) { _fragments?.forEach(this.register.bind(this)); }
    /**
     * This method is used to initialize the meta in the scope
     * 
     * This method only sets the meta values in the scope in case they are not set yet
     * 
     * @param _meta 
     */
    protected initMeta(_meta?: Partial<_MetaItems>) {
        if (_meta) {
            Object.entries(_meta).forEach(([key, value]) => {
                this._meta.set(key as keyof _MetaItems, value as _MetaItems[keyof _MetaItems]);
            });
        }
    }


    // ==========================================================================
    // --------------------Scope Public Methods-----------------------------------
    // ==========================================================================
    /**
     * This method is used to destroy the scope and all its registered components, fragments and entities
     * 
     * [!] This method deregisters all components, fragments and entities from the A-Context
     * [!] This method also clears all internal registries and collections
     */
    destroy() {
        this._components.forEach(component => A_Context.deregister(component));
        this._fragments.forEach(fragment => A_Context.deregister(fragment));
        this._entities.forEach(entity => A_Context.deregister(entity));

        this._components.clear();
        this._errors.clear();
        this._fragments.clear();
        this._entities.clear();
        this._imports.clear();

        if (this.issuer()) {
            A_Context.deallocate(this);
        }
    }


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
    get<K extends keyof _MetaItems>(param: K): _MetaItems[K] | undefined {
        return this._meta.get(param);
    }

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
    set<K extends keyof _MetaItems>(param: K, value: _MetaItems[K]): void {
        this._meta.set(param, value);
    }


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
    issuer<T extends A_TYPES__ScopeLinkedComponents>(): T | undefined {
        return A_Context.issuer(this) as T;
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
        if (!parent)
            throw new A_ScopeError(
                A_ScopeError.InitializationError,
                `Invalid parent scope provided`
            );

        if (parent === this)
            throw new A_ScopeError(
                A_ScopeError.CircularInheritanceError,
                `Unable to inherit scope ${this.name} from itself`
            );

        if (parent === this._parent)
            return this;

        // Prevent circular inheritance
        const circularCheck = this.checkCircularInheritance(parent);

        if (circularCheck)
            throw new A_ScopeError(
                A_ScopeError.CircularInheritanceError,
                `Circular inheritance detected: ${[...circularCheck, parent.name].join(' -> ')}`
            );


        this._parent = parent;
        return this;
    }


    /**
     * This method allows to import other scopes, to make their dependencies available in the current scope
     * 
     * [!] Import doesn't create a parent-child relationship between scopes, it just copies the dependencies from the imported scopes
     * [!] It doesn't change the entities ownership, so entities remain unique to their original scopes
     * 
     * @param scopes 
     * @returns 
     */
    import(...scopes: A_Scope[]): A_Scope {

        scopes.forEach(scope => {
            if (scope === this)
                throw new A_ScopeError(
                    A_ScopeError.CircularImportError,
                    `Unable to import scope ${this.name} into itself`
                );

            if (this._imports.has(scope))
                return;

            this._imports.add(scope);
        });

        return this;
    }

    /**
     * This method allows to deimport other scopes, to remove their dependencies from the current scope
     * 
     * 
     * @param scopes 
     * @returns 
     */
    deimport(...scopes: A_Scope[]): A_Scope {

        scopes.forEach(scope => {
            if (this._imports.has(scope))
                this._imports.delete(scope);
        });
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
        component: A_TYPES__Component_Constructor<T>
    ): boolean
    has<T extends A_Entity>(
        /**
         * Provide an entity constructor to check if it's available in the scope
         * 
         * [!] Note that entities are unique per aseid, so this method checks if there's at least one entity of the provided type in the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): boolean
    has<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to check if it's available in the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): boolean
    has<T extends A_Error>(
        /**
         * Provide an error constructor to check if it's available in the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): boolean
    has(
        /**
         * Provide a string to check if a component, entity or fragment with the provided name is available in the scope
         */
        constructor: string
    ): boolean
    has<T extends A_TYPES__A_DependencyInjectable>(
        ctor: A_TYPES__Ctor<T> | string
    ): boolean
    has<T extends A_TYPES__A_DependencyInjectable>(
        ctor: A_TYPES__Ctor<T> | string
    ): boolean {

        let found = this.hasFlat(ctor as any);

        if (!found && !!this._parent)
            try {
                return this._parent.has(ctor as any);
            } catch (error) {
                return false;
            }

        return found;
    }


    /**
     * This method is used to check if the component is available in the scope
     * 
     * [!] Note that this method checks for the component ONLY in the current scope
     * 
     * @param component 
     * @returns 
     */
    hasFlat<T extends A_Component>(
        /**
         * Provide a component constructor to check if it's available in the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): boolean
    hasFlat<T extends A_Entity>(
        /**
         * Provide an entity constructor to check if it's available in the scope
         * 
         * [!] Note that entities are unique per aseid, so this method checks if there's at least one entity of the provided type in the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): boolean
    hasFlat<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to check if it's available in the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): boolean
    hasFlat<T extends A_Error>(
        /**
         * Provide an error constructor to check if it's available in the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): boolean
    hasFlat(
        /**
         * Provide a string to check if a component, entity or fragment with the provided name is available in the scope
         */
        constructor: string
    ): boolean
    hasFlat(
        ctor: unknown
    ): boolean {

        let found = false;

        switch (true) {
            // 1) Check if it's a Scope. It's always true since it returns itself
            case A_TypeGuards.isScopeConstructor(ctor):
                return true;

            // 2) Check by string name.  
            case A_TypeGuards.isString(ctor): {

                // 2.1 Check if it's a component name
                const possibleComponent = Array.from(this.allowedComponents).find(c => c.name === ctor);
                if (possibleComponent) found = true;

                // 2.2 Check if it's a fragment name
                const possibleFragment = Array.from(this.allowedFragments).find(f => f.name === ctor);
                if (possibleFragment) found = true;

                // 2.3 Check if it's an entity name or entity static entity property
                const possibleEntity = Array.from(this.allowedEntities).find(e => e.name === ctor);
                if (possibleEntity) found = true;

                // 2.4 Check if it's an error name
                const possibleError = Array.from(this.allowedErrors).find(e => e.name === ctor);
                if (possibleError) found = true;

                break;
            }
            // 3) Check if it's a Component
            case A_TypeGuards.isComponentConstructor(ctor): {
                found = this.isAllowedComponent(ctor)
                    || !![...this.allowedComponents]
                        .find(c => A_CommonHelper.isInheritedFrom(c, ctor));

                break;
            }
            // 4) Check if it's an Entity
            case A_TypeGuards.isEntityConstructor(ctor): {
                found = this.isAllowedEntity(ctor)
                    || !![...this.allowedEntities]
                        .find(e => A_CommonHelper.isInheritedFrom(e, ctor));

                break;
            }
            // 5) Check if it's a Fragment
            case A_TypeGuards.isFragmentConstructor(ctor): {
                found = this.isAllowedFragment(ctor)
                    || !![...this.allowedFragments]
                        .find(f => A_CommonHelper.isInheritedFrom(f, ctor));

                break;
            }

            // 6) Check if it's an Error
            case A_TypeGuards.isErrorConstructor(ctor): {
                found = this.isAllowedError(ctor)
                    || !![...this.allowedErrors]
                        .find(e => A_CommonHelper.isInheritedFrom(e, ctor));

                break;
            }

            // 7) Check scope issuer
            case this.issuer()
                && (this.issuer()!.constructor === ctor
                    || A_CommonHelper.isInheritedFrom(this.issuer()!.constructor, ctor
                    )
                ): {
                    found = true;
                    break;
                }
        }

        return found;
    }


    /**
     * Allows to resolve a specific dependency 
     * 
     * @param dependency 
     * @returns 
     */
    resolveDependency<T extends A_TYPES__A_DependencyInjectable>(
        dependency: A_Dependency<T>
    ): T | Array<T> | undefined {

        let result: Array<T> = [];
        let targetScope: A_Scope = this.parentOffset(dependency.parent) || this;

        //  first deal with level conditions and 
        switch (true) {
            // 1) Flat resolution
            case dependency.flat && !dependency.all: {
                const resolved = targetScope.resolveFlatOnce<T>(dependency.target || dependency.name);
                if (resolved)
                    result = [resolved];
                break;
            }
            case dependency.flat && dependency.all: {
                result = targetScope.resolveFlatAll<T>(dependency.target || dependency.name);
                break;
            }
            case !dependency.flat && !dependency.all: {
                const resolved = targetScope.resolveOnce<T>(dependency.target || dependency.name);
                if (resolved)
                    result = [resolved];
                break;
            }
            case !dependency.flat && dependency.all: {
                result = targetScope.resolveAll<T>(dependency.target || dependency.name);
                break;
            }

            default:
                result = [];
        }

        //  2) create if not found and allowed
        if (dependency.create
            && !result.length
            && A_TypeGuards.isAllowedForDependencyDefaultCreation(dependency.target)
        ) {

            const newDependency = new dependency.target(...dependency.args);

            targetScope.register(newDependency);

            result.push(newDependency as T);
        }

        //  3) handle required dependencies
        if (dependency.require && !result.length) {
            throw new A_ScopeError(
                A_ScopeError.ResolutionError,
                `Dependency ${dependency.name} is required but could not be resolved in scope ${targetScope.name}`
            );
        }


        // 4) Apply filters
        if (dependency.query.aseid)
            //  in this case we should return only one dependency by aseid
            result = result.filter(dep => A_TypeGuards.hasASEID(dep) && ASEID.compare(dep.aseid, dependency.query.aseid));

        else if (Object.keys(dependency.query).length > 0)
            result = result
                .filter(dep => {
                    const query = dependency.query;
                    if (!query) return true;

                    return Object.entries(query).every(([key, value]) => {
                        return (dep as any)[key] === value;
                    });
                });


        // 5) apply pagination

        const count = dependency.pagination.count;
        const from = dependency.pagination.from;  // from start or from end



        const startSliceIndex = from === 'end'
            ? (count === -1 ? 0 : Math.max(result.length - count, 0))
            : 0;

        //  end slice should handle -1 for all items
        const endSliceIndex = from === 'end'
            ? result.length
            : (count === -1 ? result.length : Math.min(count, result.length));

        const slice = result.slice(startSliceIndex, endSliceIndex);

        /**
         * Default behavior is to return single instance if count is 1
         * 
         * If Directive All (-1) is provided or count > 1, an array is returned
         * 
         * If no instances found, undefined is returned
         */
        return slice.length === 1
            && count !== -1
            ? slice[0]
            : slice.length
                ? slice
                : undefined;
    }


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
        name: string
    ): A_TYPES__Entity_Constructor<T>
    resolveConstructor<T extends A_Component>(
        /**
         * Provide the component name in PascalCase to retrieve its constructor
         */
        name: string
    ): A_TYPES__Component_Constructor<T>
    resolveConstructor<T extends A_Fragment>(
        /**
         * Provide the fragment name in PascalCase to retrieve its constructor
         */
        name: string
    ): A_TYPES__Fragment_Constructor<T>
    resolveConstructor<T extends A_TYPES__A_DependencyInjectable>(name: string): A_TYPES__Entity_Constructor<T> | A_TYPES__Component_Constructor<T> | A_TYPES__Fragment_Constructor<T> | undefined
    resolveConstructor<T extends A_TYPES__A_DependencyInjectable>(name: string): A_TYPES__Entity_Constructor<T> | A_TYPES__Component_Constructor<T> | A_TYPES__Fragment_Constructor<T> | undefined {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(
            c => c.name === name
                || c.name === A_FormatterHelper.toPascalCase(name)
        );

        if (component) return component as A_TYPES__Component_Constructor<T>;
        else
        // 1.2) Check components prototypes
        {
            const protoComponent = Array.from(this.allowedComponents).find(

                //  it should go rthough prototyopes and check their names to be equal to the provided name
                c => {
                    let current = c;

                    while (current) {
                        if (current.name === name
                            || current.name === A_FormatterHelper.toPascalCase(name)
                        ) {
                            return true;
                        }
                        current = Object.getPrototypeOf(current);
                    }

                    return false;

                }
            );
            if (protoComponent) return protoComponent as A_TYPES__Component_Constructor<T>;
        }

        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(
            e => e.name === name
                || e.name === A_FormatterHelper.toPascalCase(name)
                || (e as any).entity === name
                || (e as any).entity === A_FormatterHelper.toKebabCase(name)
        );
        if (entity) return entity as A_TYPES__Entity_Constructor<T>;
        else
        // 2.2) Check entities prototypes
        {
            const protoEntity = Array.from(this.allowedEntities).find(
                e => A_CommonHelper.isInheritedFrom(e, name as any)
            );
            if (protoEntity) return protoEntity as A_TYPES__Entity_Constructor<T>;
        }

        // 3) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_FormatterHelper.toPascalCase(name)
        );
        if (fragment) return fragment as A_TYPES__Fragment_Constructor<T>;
        else
        // 3.2) Check fragments prototypes
        {
            const protoFragment = Array.from(this.allowedFragments).find(
                f => A_CommonHelper.isInheritedFrom(f, name as any)
            );
            if (protoFragment) return protoFragment as A_TYPES__Fragment_Constructor<T>;
        }

        // If not found in current scope, check imported scopes
        for (const importedScope of this._imports) {
            const importedConstructor = importedScope.resolveConstructor<T>(name);
            if (importedConstructor) {
                return importedConstructor;
            }
        }

        // Then, finally check parent scope
        if (!!this._parent) {
            return this._parent.resolveConstructor(name) as any;
        }

        return undefined;
    }




    /**
     * This method should resolve all instances of the components, or entities within the scope, by provided parent class
     * So in case of providing a base class it should return all instances that extends this base class
     * 
     * [!] Applicable for the current scope ONLY, no parent scopes are checked
     * 
     * @param component 
     */
    resolveAll<T extends A_Component>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): Array<T>
    resolveAll<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): Array<T>
    resolveAll<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): Array<T>
    resolveAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor to resolve its instance(s) from the scope
         */
        constructorName: string
    ): Array<T>
    resolveAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        ctor: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string
    ): Array<T>
    resolveAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string
    ): Array<T> {

        const results: Set<T> = new Set();

        // 1) Resolve all in the current scope
        const currentResults = this.resolveFlatAll<T>(param1 as any);
        currentResults.forEach(result => results.add(result));

        // 2) resolve all in the imported scopes
        this._imports.forEach(importedScope => {

            if (importedScope.has(param1 as any)) {
                const importedResults = importedScope.resolveFlatAll<T>(param1 as any);


                importedResults.forEach(result => results.add(result));
            }
        });

        // 3) Resolve all in the parent scope
        let parentScope = this._parent;

        while (parentScope && parentScope.has(param1 as any)) {

            const parentResults = parentScope.resolveAll<T>(param1 as any);
            parentResults.forEach(result => results.add(result));

            // Move to the next parent scope
            parentScope = parentScope._parent;
        }



        return Array.from(results);
    }




    /**
     * This method should resolve all instances of the components, or entities within the scope, by provided parent class
     * So in case of providing a base class it should return all instances that extends this base class
     * 
     * [!] Applicable for the current scope ONLY, no parent scopes are checked
     * 
     * @param component 
     */
    resolveFlatAll<T extends A_Component>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): Array<T>
    resolveFlatAll<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): Array<T>
    resolveFlatAll<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): Array<T>
    resolveFlatAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor to resolve its instance(s) from the scope
         */
        constructorName: string
    ): Array<T>
    resolveFlatAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        ctor: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string,
    ): Array<T>
    resolveFlatAll<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string,
    ): Array<T> {

        const results: Array<T> = [];

        switch (true) {
            // 1) if a parameter is a component constructor
            case A_TypeGuards.isComponentConstructor(param1): {
                // 1) Check components
                this.allowedComponents.forEach(ctor => {
                    if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
                        const instance = this.resolveOnce<T>(ctor);
                        if (instance) results.push(instance as T);
                    }
                });
                break;
            }
            // 2) if a parameter is a fragment constructor
            case A_TypeGuards.isFragmentConstructor(param1): {
                // 2) Check fragments
                this.allowedFragments.forEach(ctor => {
                    if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
                        const instance = this.resolveOnce<T>(ctor);
                        if (instance) results.push(instance as T);
                    }
                });
                break;
            }

            case A_TypeGuards.isEntityConstructor(param1): {
                // 3) Check entities
                this.entities.forEach(entity => {

                    if (A_CommonHelper.isInheritedFrom(entity.constructor, param1)) {
                        results.push(entity as T);
                    }
                });
                break;
            }

            case A_TypeGuards.isString(param1): {
                // 4) Check by name
                const ctor = this.resolveConstructor(param1);
                if (!A_TypeGuards.isComponentConstructor(ctor)
                    && !A_TypeGuards.isEntityConstructor(ctor)
                    && !A_TypeGuards.isFragmentConstructor(ctor)
                )
                    throw new A_ScopeError(
                        A_ScopeError.ResolutionError,
                        `Unable to resolve all instances for name: ${param1} in scope ${this.name} as no matching component, entity or fragment constructor found`);


                if (ctor) {
                    const instances = this.resolveAll<T>(ctor as any);
                    if (instances)
                        results.push(...instances);
                }
                break;
            }

            default:
                throw new A_ScopeError(
                    A_ScopeError.ResolutionError,
                    `Invalid parameter provided to resolveAll method: ${param1} in scope ${this.name}`);
        }


        return results;
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
    resolve<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: A_TYPES__Ctor<T>
    ): T | undefined
    resolve<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a target dependency to resolve its instance from the scope
         * 
         * [!] In this case its possible to provide a custom resolution strategy via A_Dependency options
         */
        dependency: A_Dependency<T>
    ): T | Array<T> | undefined
    resolve<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: string
    ): T | Array<T> | undefined
    resolve<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__Ctor<T> | A_Dependency<T> | string
    ): T | Array<T> | undefined {

        const dependency = A_TypeGuards.isDependencyInstance(param1) ?
            param1 as A_Dependency<T> :
            new A_Dependency<T>(param1)

        return this.resolveDependency<T>(dependency);
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
    resolveOnce<T extends A_Component>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): T | undefined
    resolveOnce<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): T | undefined
    resolveOnce<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): T | undefined
    resolveOnce<T extends A_Scope>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        scope: A_TYPES__Scope_Constructor<T>
    ): T | undefined
    resolveOnce<T extends A_Error>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): T | undefined
    resolveOnce<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor to resolve its instance(s) from the scope
         */
        constructorName: string
    ): T | undefined
    resolveOnce<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        ctor: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string
    ): T | undefined
    resolveOnce<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string
    ): T | undefined {

        const value = this.resolveFlatOnce(param1);

        // if not found in the current scope, check imported scopes
        if (!value) {
            for (const importedScope of this._imports) {
                if (importedScope.has(param1 as any)) {
                    const importedValue = importedScope.resolveFlatOnce<T>(param1 as any);
                    if (importedValue) {
                        return importedValue;
                    }
                }
            }
        }

        //  The idea here that in case when Scope has no exact component we have to resolve it from the _parent
        //  That means that we should ensure that there's no components that are children of the required component
        if (!value && !!this.parent) {
            return this.parent.resolveOnce<T>(param1);
        }

        return value as T;
    }


    /**
     * This polymorphic method allows to resolve/inject a component, fragment or entity from the scope
     * Depending on the provided parameters it can resolve:
     * - A single component/fragment/entity by its constructor or name
     * - An array of components/fragments/entities by providing an array of constructors
     * - An entity or an array of entities by providing the entity constructor and query instructions
     * 
     * [!] Applicable for the current scope ONLY, no parent scopes are checked
     * 
     * @param component 
     */
    resolveFlat<T extends A_Component>(
        /**
         * Provide a component constructor to resolve its instance from the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): T | undefined
    resolveFlat<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): T | undefined
    resolveFlat<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): T | undefined
    resolveFlat<T extends A_Scope>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        scope: A_TYPES__Scope_Constructor<T>
    ): T | undefined
    resolveFlat<T extends A_Error>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): T | undefined
    resolveFlat<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor to resolve its instance(s) from the scope
         */
        constructorName: string
    ): T | undefined
    resolveFlat<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        ctor: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable>,
    ): T | undefined
    resolveFlat<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string,
    ): T | undefined {
        return this.resolveFlatOnce(param1) as T;
    }


    /**
     * Resolves a component, fragment or entity from the scope without checking parent scopes
     * 
     * @param component 
     * @param instructions 
     */
    resolveFlatOnce<T extends A_TYPES__A_DependencyInjectable>(
        component: A_TYPES__Ctor<A_TYPES__A_DependencyInjectable> | string,
    ): T | undefined {

        let value: T | undefined = undefined;

        const componentName = A_CommonHelper.getComponentName(component);


        if (!component || !this.has(component)) {
            return undefined;
        }

        switch (true) {
            case A_TypeGuards.isString(component): {
                value = this.resolveByName(component) as T;
                break;
            }
            case A_TypeGuards.isConstructorAllowedForScopeAllocation(component): {
                value = this.resolveIssuer(component) as T;
                break;
            }
            case A_TypeGuards.isScopeConstructor(component): {
                value = this.resolveScope(component) as T
                break;
            }
            case A_TypeGuards.isEntityConstructor(component): {
                value = this.resolveEntity(component) as T
                break;
            }
            case A_TypeGuards.isFragmentConstructor(component): {
                value = this.resolveFragment(component) as T;
                break;
            }
            case A_TypeGuards.isComponentConstructor(component): {
                value = this.resolveComponent(component) as T;
                break;
            }
            case A_TypeGuards.isErrorConstructor(component): {
                value = this.resolveError(component) as T;
                break;
            }
            default:
                throw new A_ScopeError(
                    A_ScopeError.ResolutionError,
                    `Injected Component ${componentName} not found in the scope`
                );
        }

        return value
    }



    // ==================================================================================================
    // --------------------------------------------------------------------------------------------------
    // -------------------------------------INTERNAL RESOLVERS-------------------------------------------
    // --------------------------------------------------------------------------------------------------
    // ==================================================================================================
    /**
     * This method is used internally to resolve a component, fragment or entity by its constructor name
     * 
     * [!] Note that this method checks for the component, fragment or entity in the current scope and all parent scopes
     * [!!] Note: No parent scopes are checked
     * 
     * @param name  - name of the component, fragment or entity to resolve (constructor name for components and fragments, static entity property for entities, static code property for commands)
     * @returns 
     */
    private resolveByName(
        /**
         * Provide the name of the component, fragment or entity to resolve
         */
        name: string
    ): _EntityType[number] | InstanceType<_ComponentType[number]> | _FragmentType[number] |
        InstanceType<_ErrorType[number]> | undefined {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(
            c => c.name === name
                || c.name === A_FormatterHelper.toPascalCase(name)
        );
        if (component) return this.resolveOnce(component) as InstanceType<_ComponentType[number]>;

        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(
            e => e.name === name
                || e.name === A_FormatterHelper.toPascalCase(name)
                || (e as any).entity === name
                || (e as any).entity === A_FormatterHelper.toKebabCase(name)
        );
        if (entity) return this.resolveOnce(entity) as InstanceType<_EntityType[number]>;

        // 3) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_FormatterHelper.toPascalCase(name)
        );
        if (fragment) return this.resolveOnce(fragment) as _FragmentType[number];

        // 4) Check errors
        const error = Array.from(this.allowedErrors).find(
            e => e.name === name
                || e.name === A_FormatterHelper.toPascalCase(name)
                || (e as any).code === name
                || (e as any).code === A_FormatterHelper.toKebabCase(name)
        );
        if (error) return this.resolveOnce(error) as InstanceType<_ErrorType[number]>;

        return undefined;
    }


    /**
     * Resolves the issuer of the scope by provided constructor
     * 
     * [!] Note that this method checks ONLY for the direct issuer of the scope
     * [!!] No parent scopes are checked
     * 
     * 
     * @param ctor 
     * @returns 
     */
    private resolveIssuer(
        ctor: A_TYPES__ScopeLinkedConstructors
    ): A_TYPES__ScopeLinkedComponents | undefined {

        const issuer = this.issuer();

        if (issuer
            && (
                issuer.constructor === ctor
                || A_CommonHelper.isInheritedFrom(issuer?.constructor, ctor)
            )) {
            return issuer!;
        }


        return undefined;
    }

    /**
     * This method is used internally to resolve a single entity from the scope based on the provided instructions
     * 
     * [!] Note that this method can return either a single entity or an array of entities depending on the instructions provided
     * [!!] Note: No parent scopes are checked  
     * 
     * @param entity 
     * @param instructions 
     * @returns 
     */
    private resolveEntity<T extends A_Entity>(
        entity: A_TYPES__Entity_Constructor<T>
    ): T | Array<T> | undefined {

        /**
         * 1) In case when no instructions provided, return the first found entity of the provided type
         * 
         * [!] Note that it returns ONLY ONE entity
         * [!!] In case when no entity found in the current scope, it tries to resolve it from the parent scope (if exists)
         */

        return this.entities.find(e => e instanceof entity) as T | undefined;

    }
    /**
     * This method is used internally to resolve a single error from the scope
     * 
     * [!] Note that errors are singleton instances within the scope
     * [!!] No parent scopes are checked
     * 
     * @param error 
     * @returns 
     */
    private resolveError<T extends A_Error>(error: A_TYPES__Error_Constructor<T>): T | undefined {

        return this.errors.find(e => e instanceof error) as T | undefined;
    }
    /**
     * This method is used internally to resolve a single fragment from the scope
     * 
     * [!] Note that this method checks for the fragment in the current scope and all parent scopes
     * 
     * @param fragment 
     * @returns 
     */
    private resolveFragment<T extends A_Fragment>(fragment: A_TYPES__Fragment_Constructor<T>): _FragmentType[number] | undefined {
        const fragmentInstancePresented = this._fragments.get(fragment);

        switch (true) {
            case fragmentInstancePresented && this._fragments.has(fragment):
                return fragmentInstancePresented;

            // 3) In case when there's a component that is inherited from the required component
            case !fragmentInstancePresented && Array.from(this._allowedFragments).some(el => A_CommonHelper.isInheritedFrom(el, fragment)): {
                const found = Array.from(this._allowedFragments).find(el => A_CommonHelper.isInheritedFrom(el, fragment))!;

                return this.resolveFragment(found);
            }

            default:
                return undefined;
        }
    }
    /**
     *  This method is used internally to resolve a single scope from the current scope
     * 
     * @param scope 
     * @returns 
     */
    private resolveScope(scope: A_TYPES__Scope_Constructor): A_Scope {
        return this;
    }

    /**
     * This method is used internally to resolve a single component from the scope
     * 
     * [!!] Note: No parent scopes are checked  
     * 
     * @param component 
     * @returns 
     */
    private resolveComponent<T extends A_Component>(component: A_TYPES__Component_Constructor<T>): InstanceType<_ComponentType[number]> | undefined {


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
                    .map(dependency => this.resolve(dependency));


                const newComponent = new component(...resolvedArgs)

                this.register(newComponent);

                return this._components.get(component)!;
            }

            // 3) In case when there's a component that is inherited from the required component
            case !this.allowedComponents.has(component) && Array.from(this.allowedComponents).some(el => A_CommonHelper.isInheritedFrom(el, component)): {
                const found = Array.from(this.allowedComponents).find(el => A_CommonHelper.isInheritedFrom(el, component))!;

                return this.resolveComponent(found);
            }

            default:
                return undefined;
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
        component: A_TYPES__Component_Constructor<T>
    ): void
    register<T extends A_Component>(
        /**
         * Provide a command instance to register it in the scope
         */
        component: T
    ): void
    register<T extends A_Error>(
        /**
         * Provide an error constructor to register it in the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): void
    register<T extends A_Error>(
        /**
         * Provide an error instance to register it in the scope
         */
        error: T
    ): void
    register<T extends A_Fragment>(
        /**
         * Provide a command instance to register it in the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): void
    register<T extends A_Fragment>(
        /**
         * Provide a fragment instance to register it in the scope
         */
        fragment: T
    ): void
    register<T extends A_Entity>(
        /**
         * Provide an entity constructor to register it in the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): void
    register<T extends A_Entity>(
        /**
         * Provide an entity instance to register it in the scope
         */
        entity: T
    ): void
    register<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide an entity instance to register it in the scope
         */
        entity: T
    ): void
    register<T extends A_TYPES__A_DependencyInjectable>(
        /**
         * Provide an entity instance to register it in the scope
         */
        param1: T
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
            // 3) In case when it's a A-Entity instance
            case A_TypeGuards.isEntityInstance(param1) && !this._entities.has(param1.aseid.toString()): {

                if (!this.allowedEntities.has(param1.constructor as _EntityType[number]))
                    this.allowedEntities.add(param1.constructor as _EntityType[number]);

                this._entities.set(param1.aseid.toString(), param1 as InstanceType<_EntityType[number]>);
                A_Context.register(this, param1);
                break;
            }
            // 4) In case when it's a A-Fragment instance
            case A_TypeGuards.isFragmentInstance(param1): {

                if (!this.allowedFragments.has(param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>))
                    this.allowedFragments.add(param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>);

                this._fragments.set(
                    param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>,
                    param1 as _FragmentType[number]
                );

                A_Context.register(this, param1);

                break;
            }
            // 5) In case when it's a A-Error instance
            case A_TypeGuards.isErrorInstance(param1): {
                if (!this.allowedErrors.has(param1.constructor as _ErrorType[number]))
                    this.allowedErrors.add(param1.constructor as _ErrorType[number]);

                this._errors.set(
                    (param1 as any).code,
                    param1 as InstanceType<_ErrorType[number]>
                );

                A_Context.register(this, (param1 as any));
                break;
            }

            // ------------------------------------------
            // ------------ Constructors ----------------
            // ------------------------------------------
            // 6) In case when it's a A-Component constructor
            case A_TypeGuards.isComponentConstructor(param1): {
                if (!this.allowedComponents.has(param1))
                    this.allowedComponents.add(param1 as _ComponentType[number]);
                break;
            }
            // 8) In case when it's a A-Fragment constructor
            case A_TypeGuards.isFragmentConstructor(param1): {
                if (!this.allowedFragments.has(param1))
                    this.allowedFragments.add(param1 as A_TYPES__Fragment_Constructor<_FragmentType[number]>);
                break;
            }
            // 9) In case when it's a A-Entity constructor
            case A_TypeGuards.isEntityConstructor(param1): {
                if (!this.allowedEntities.has(param1))
                    this.allowedEntities.add(param1 as _EntityType[number]);
                break;
            }
            // 10) In case when it's a A-Error constructor
            case A_TypeGuards.isErrorConstructor(param1): {
                if (!this.allowedErrors.has(param1))
                    this.allowedErrors.add(param1 as _ErrorType[number]);
                break;
            }

            // ------------------------------------------
            // ------------ Invalid Cases ----------------
            // ------------------------------------------

            default:
                if (param1 instanceof A_Entity)
                    throw new A_ScopeError(
                        A_ScopeError.RegistrationError,
                        `Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`
                    );
                else if (param1 instanceof A_Fragment)
                    throw new A_ScopeError(
                        A_ScopeError.RegistrationError,
                        `Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`
                    );
                else {
                    const componentName = A_CommonHelper.getComponentName(param1);

                    throw new A_ScopeError(
                        A_ScopeError.RegistrationError,
                        `Cannot register ${componentName} in the scope ${this.name}`
                    );
                }
        }
    }


    /**
     * This method is used to deregister the component from the scope
     * 
     * @param fragment 
     */
    deregister<T extends A_Component>(
        /**
         * Provide a component constructor to deregister it in the scope
         */
        component: A_TYPES__Component_Constructor<T>
    ): void
    deregister(
        /**
         * Provide a command instance to deregister it in the scope
         */
        component: A_Component
    ): void
    deregister<T extends A_Error>(
        /**
         * Provide an error constructor to deregister it in the scope
         */
        error: A_TYPES__Error_Constructor<T>
    ): void
    deregister(
        /**
         * Provide an error instance to deregister it in the scope
         */
        error: A_Error
    ): void
    deregister<T extends A_Fragment>(
        /**
         * Provide a command instance to deregister it in the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): void
    deregister(
        /**
         * Provide a fragment instance to deregister it in the scope
         */
        fragment: A_Fragment
    ): void
    deregister<T extends A_Entity>(
        /**
         * Provide an entity constructor to deregister it in the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): void
    deregister(
        /**
         * Provide an entity instance to deregister it in the scope
         */
        entity: A_Entity
    ): void

    deregister(
        param1: unknown
    ): void {
        switch (true) {
            // ------------------------------------------
            // ------------ Instances ----------------
            // ------------------------------------------
            // 1) In case when it's a A-Component instance
            case param1 instanceof A_Component: {

                this._components.delete(param1.constructor as _ComponentType[number]);
                A_Context.deregister(param1);

                const ctor = param1.constructor as _ComponentType[number];

                const hasComponent = this._components.has(ctor);
                if (!hasComponent) {
                    this.allowedComponents.delete(ctor);
                }

                break;
            }
            // 3) In case when it's a A-Entity instance
            case A_TypeGuards.isEntityInstance(param1): {

                this._entities.delete(param1.aseid.toString());
                A_Context.deregister(param1);

                const ctor = param1.constructor as _EntityType[number];

                const hasEntity = Array.from(this._entities.values()).some(entity => entity instanceof ctor);
                if (!hasEntity) {
                    this.allowedEntities.delete(ctor);
                }

                break;
            }
            // 4) In case when it's a A-Fragment instance
            case A_TypeGuards.isFragmentInstance(param1): {
                this._fragments.delete(param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>);
                A_Context.deregister(param1);

                const ctor = param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>;

                const hasFragment = Array.from(this._fragments.values()).some(fragment => fragment instanceof ctor);
                if (!hasFragment) {
                    this.allowedFragments.delete(ctor);
                }

                break;
            }
            // 5) In case when it's a A-Error instance
            case A_TypeGuards.isErrorInstance(param1): {

                this._errors.delete((param1 as any).code);
                A_Context.deregister((param1 as any));

                const ctor = (param1 as any).constructor as _ErrorType[number];

                const hasError = Array.from(this._errors.values()).some(error => error instanceof ctor);
                if (!hasError) {
                    this.allowedErrors.delete(ctor);
                }

                break;
            }

            // ------------------------------------------
            // ------------ Constructors ----------------
            // ------------------------------------------
            // 6) In case when it's a A-Component constructor
            case A_TypeGuards.isComponentConstructor(param1): {
                this.allowedComponents.delete(param1 as _ComponentType[number]);
                break;
            }
            // 8) In case when it's a A-Fragment constructor
            case A_TypeGuards.isFragmentConstructor(param1): {
                this.allowedFragments.delete(param1 as A_TYPES__Fragment_Constructor<_FragmentType[number]>);
                // and then deregister all instances of this fragment
                Array.from(this._fragments.entries()).forEach(([ctor, instance]) => {
                    if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
                        this._fragments.delete(ctor);
                        A_Context.deregister(instance);
                    }
                });

                break;
            }
            // 9) In case when it's a A-Entity constructor
            case A_TypeGuards.isEntityConstructor(param1): {
                this.allowedEntities.delete(param1 as _EntityType[number]);
                //  and then deregister all instances of this entity
                Array.from(this._entities.entries()).forEach(([aseid, instance]) => {
                    if (A_CommonHelper.isInheritedFrom(instance.constructor, param1)) {
                        this._entities.delete(aseid);
                        A_Context.deregister(instance);
                    }
                });

                break;
            }
            // 10) In case when it's a A-Error constructor
            case A_TypeGuards.isErrorConstructor(param1): {
                this.allowedErrors.delete(param1 as _ErrorType[number]);
                // and then deregister all instances of this error
                Array.from(this._errors.entries()).forEach(([code, instance]) => {
                    if (A_CommonHelper.isInheritedFrom(instance.constructor, param1)) {
                        this._errors.delete(code);
                        A_Context.deregister(instance);
                    }
                });

                break;
            }

            // ------------------------------------------
            // ------------ Invalid Cases ----------------
            // ------------------------------------------

            default:
                const componentName = A_CommonHelper.getComponentName(param1);

                throw new A_ScopeError(
                    A_ScopeError.DeregistrationError,
                    `Cannot deregister ${componentName} from the scope ${this.name}`
                );
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
     * Type guard to check if the constructor is of type A_Component and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedComponent(ctor: unknown): ctor is _ComponentType[number] {
        return A_TypeGuards.isComponentConstructor(ctor) && this.allowedComponents.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedEntity(ctor: unknown): ctor is A_TYPES__Entity_Constructor<_EntityType[number]> {
        return A_TypeGuards.isEntityConstructor(ctor) && this.allowedEntities.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedFragment(ctor: unknown): ctor is A_TYPES__Fragment_Constructor<_FragmentType[number]> {
        return A_TypeGuards.isFragmentConstructor(ctor) && this.allowedFragments.has(ctor);
    }
    /**
     * Type guard to check if the constructor is of type A_Error and is allowed in the scope
     * 
     * @param ctor 
     * @returns 
     */
    protected isAllowedError(ctor: unknown): ctor is A_TYPES__Error_Constructor<_ErrorType[number]> {
        return A_TypeGuards.isErrorConstructor(ctor) && this.allowedErrors.has(ctor);
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