import {
    A_TYPES__ScopeConfig,
    A_TYPES__Scope_Init,
    A_TYPES__ScopeLinkedComponents,
    A_TYPES__ScopeResolvableComponents,
    A_TYPES__Scope_Constructor,
    A_TYPES__ScopeLinkedConstructors
} from './A-Scope.types'
import {
    A_TYPES__A_InjectDecorator_EntityInjectionInstructions,
    A_TYPES__A_InjectDecorator_EntityInjectionQuery,
    A_TYPES__InjectableConstructors,
    A_TYPES__InjectableTargets,
} from "@adaas/a-concept/global/A-Inject/A-Inject.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_Error } from "../A-Error/A_Error.class";
import { A_FormatterHelper } from '@adaas/a-concept/helpers/A_Formatter.helper';
import { ASEID } from '../ASEID/ASEID.class';
import { A_CommonHelper } from '@adaas/a-concept/helpers/A_Common.helper';
import { A_TYPES__Entity_Constructor } from '../A-Entity/A-Entity.types';
import { A_ScopeError } from './A-Scope.error';
import { A_TYPES__Component_Constructor } from '../A-Component/A-Component.types';
import { A_TYPES__Fragment_Constructor } from '../A-Fragment/A-Fragment.types';
import { A_TYPES__Error_Constructor } from '../A-Error/A_Error.types';
import { A_TYPES__ComponentMetaKey } from '../A-Component/A-Component.constants';




export class A_Scope<
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




    // ===========================================================================
    // --------------------Readonly Allowed Properties----------------------------
    // ===========================================================================
    /**
     * Returns the name of the scope
     */
    get name() { return this._name }

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
        params: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>,
        /**
         * Configuration options for the scope
         */
        config?: Partial<A_TYPES__ScopeConfig>
    )
    constructor(
        param1?: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>,
        param2?: Partial<A_TYPES__ScopeConfig>
    ) {
        const initializer = this.getInitializer(param1);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, param1, param2);
    }



    /**
     * Determines which initializer method to use based on the type of the first parameter.
     * 
     * @param param1 
     * @returns
     */
    protected getInitializer(
        param1?: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>>,
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
        params: Partial<A_TYPES__Scope_Init<_ComponentType, _ErrorType, _EntityType, _FragmentType>> = {},
        config: Partial<A_TYPES__ScopeConfig> = {}
    ) {
        this._name = params.name || this.constructor.name

        this.initComponents(params.components);
        this.initErrors(params.errors);
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

        if (this.issuer()) {
            A_Context.deallocate(this);
        }
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
        try {
            return A_Context.issuer(this) as T;
        } catch (error) {
            return undefined;
        }
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
    has(
        ctor: unknown
    ): boolean {

        let found = false;

        switch (true) {
            // 1) Check if it's a Scope. It's always true since it returns itself
            case A_TypeGuards.isScopeConstructor(ctor):
                return true;

            // 2) Check by string name.  
            case typeof ctor === 'string': {
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

                // 2.5 If not found in current scope, check parent scope
                if (!!this._parent)
                    return this._parent.has(ctor);

                return false;
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

        // 7) Check parent scope in case not found
        if (!found && !!this._parent)
            try {
                return this._parent.has(ctor as any);
            } catch (error) {
                return false;
            }


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
                fragments: [...this.fragments, ...anotherScope.fragments],
                entities: [
                    ...this.entities, ...anotherScope.entities,
                    ...this.allowedEntities, ...anotherScope.allowedEntities
                ],
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
    resolveConstructor<T extends A_TYPES__ScopeResolvableComponents>(name: string): A_TYPES__Entity_Constructor<T> | A_TYPES__Component_Constructor<T> | A_TYPES__Fragment_Constructor<T> | undefined {
        // 1) Check components
        const component = Array.from(this.allowedComponents).find(
            c => c.name === name
                || c.name === A_FormatterHelper.toPascalCase(name)
        );
        if (component) return component as A_TYPES__Component_Constructor<T>;

        // 2) Check entities
        const entity = Array.from(this.allowedEntities).find(
            e => e.name === name
                || e.name === A_FormatterHelper.toPascalCase(name)
                || (e as any).entity === name
                || (e as any).entity === A_FormatterHelper.toKebabCase(name)
        );
        if (entity) return entity as A_TYPES__Entity_Constructor<T>;

        // 3) Check fragments
        const fragment = Array.from(this.allowedFragments).find(f => f.name === name
            || f.name === A_FormatterHelper.toPascalCase(name)
        );
        if (fragment) return fragment as A_TYPES__Fragment_Constructor<T>;

        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveConstructor(name) as any;
        }

        return undefined;
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
        component: A_TYPES__Component_Constructor<T>
    ): T | undefined
    resolve<T extends A_TYPES__Component_Constructor[]>(
        /**
         * Provide an array of component constructors to resolve their instances from the scope
         */
        components: [...T]
    ): Array<InstanceType<T[number]>> | undefined
    resolve<T extends A_Fragment>(
        /**
         * Provide a fragment constructor to resolve its instance from the scope
         */
        fragment: A_TYPES__Fragment_Constructor<T>
    ): T | undefined
    resolve<T extends A_TYPES__Fragment_Constructor[]>(
        /**
         * Provide an array of fragment constructors to resolve their instances from the scope
         */
        fragments: [...T]
    ): Array<InstanceType<T[number]>> | undefined
    resolve<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>
    ): T | undefined

    resolve<T extends A_Entity>(
        /**
         * Provide an entity constructor to resolve its instance or an array of instances from the scope
         */
        entity: A_TYPES__Entity_Constructor<T>,
        /**
         * Provide optional instructions to find a specific entity or a set of entities
         */
        instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>
    ): Array<T>
    resolve<T extends A_Scope>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        scope: A_TYPES__Scope_Constructor<T>
    ): T | undefined
    resolve<T extends A_Error>(
        /**
         * Uses only in case of resolving a single entity
         * 
         * Provide an entity constructor to resolve its instance from the scope
         */
        scope: A_TYPES__Error_Constructor<T>
    ): T | undefined
    resolve<T extends A_TYPES__ScopeResolvableComponents>(
        constructorName: string
    ): T | undefined
    // base definition
    resolve<T extends A_TYPES__ScopeResolvableComponents>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__InjectableConstructors,

    ): T | Array<T> | undefined
    resolve<T extends A_TYPES__ScopeLinkedConstructors>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: InstanceType<T>,

    ): T | Array<T> | undefined
    resolve<T extends A_TYPES__ScopeResolvableComponents>(
        /**
         * Provide a component, fragment or entity constructor or an array of constructors to resolve its instance(s) from the scope
         */
        param1: A_TYPES__InjectableConstructors | Array<A_TYPES__InjectableConstructors>,
        param2?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): T | Array<T> | undefined {
        switch (true) {
            case A_TypeGuards.isArray(param1): {
                return param1.map(c => {
                    if (A_TypeGuards.isString(c))
                        return this.resolveByName(c);
                    else
                        return this.resolveOnce(c, param2);
                }).filter(Boolean) as Array<T>;
            }

            case A_TypeGuards.isFunction(param1): {
                return this.resolveOnce(param1, param2) as T;
            }

            case A_TypeGuards.isString(param1): {
                return this.resolveByName(param1) as T;
            }

            default: {
                throw new A_ScopeError(
                    A_ScopeError.ResolutionError,
                    `Invalid parameter provided to resolve method: ${param1} in scope ${this.name}`);
            }
        }
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

        // If not found in current scope, check parent scope
        if (!!this._parent) {
            return this._parent.resolveByName(name) as any;
        }

        return undefined;
    }

    /**
     * This method is used internally to resolve a single component, fragment or entity from the scope
     * 
     * @param component 
     * @param instructions 
     * @returns 
     */
    private resolveOnce(
        component: any,
        instructions?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
    ): A_TYPES__ScopeResolvableComponents | A_Scope | A_TYPES__ScopeLinkedComponents | Array<A_TYPES__ScopeResolvableComponents> | undefined {


        const componentName = A_CommonHelper.getComponentName(component);

        if (!component || !this.has(component))
            return undefined;

        switch (true) {
            case A_TypeGuards.isConstructorAllowedForScopeAllocation(component): {
                return this.resolveIssuer(component);
            }
            case A_TypeGuards.isEntityConstructor(component): {
                return this.resolveEntity(component, instructions);
            }
            case A_TypeGuards.isFragmentConstructor(component): {
                return this.resolveFragment(component);
            }
            case A_TypeGuards.isScopeConstructor(component): {
                return this.resolveScope(component);
            }
            case A_TypeGuards.isComponentConstructor(component): {
                return this.resolveComponent(component);
            }
            case A_TypeGuards.isErrorConstructor(component): {
                return this.resolveError(component);
            }
            default:
                throw new A_ScopeError(
                    A_ScopeError.ResolutionError,
                    `Injected Component ${componentName} not found in the scope`
                );
        }
    }

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
        if (!!this._parent) {
            return this._parent.resolveIssuer(ctor);
        }

        return undefined;
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
        entity: A_TYPES__Entity_Constructor<T>,
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
                        return undefined;
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
     * This method is used internally to resolve a single error from the scope
     * 
     * @param error 
     * @returns 
     */
    private resolveError<T extends A_Error>(error: A_TYPES__Error_Constructor<T>): T | undefined {

        const found = this.errors.find(e => e instanceof error);

        switch (true) {
            case !!found:
                return found as T;

            case !found && !!this._parent:
                return this._parent.resolveError(error);

            default:
                return undefined;
        }
    }
    /**
     * This method is used internally to resolve a single fragment from the scope
     * 
     * @param fragment 
     * @returns 
     */
    private resolveFragment<T extends A_Fragment>(fragment: A_TYPES__Fragment_Constructor<T>): _FragmentType[number] | undefined {
        const fragmentInstancePresented = this._fragments.get(fragment);

        switch (true) {
            case fragmentInstancePresented && this._fragments.has(fragment):
                return fragmentInstancePresented;

            case !fragmentInstancePresented && !!this._parent:
                return this._parent.resolveFragment(fragment);

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
     * @param component 
     * @returns 
     */
    private resolveComponent<T extends A_Component>(component: A_TYPES__Component_Constructor<T>): InstanceType<_ComponentType[number]> | undefined {

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
                        // for Error handling purposes
                        const componentName = A_CommonHelper.getComponentName(arg.target)

                        if ('instructions' in arg && !!arg.instructions) {
                            const { target, instructions } = arg
                            const dependency = this.resolve(target as any, instructions);
                            if (!dependency)
                                throw new A_ScopeError(
                                    A_ScopeError.ResolutionError,
                                    `Unable to resolve dependency ${componentName} for component ${component.name} in scope ${this.name}`
                                );

                            return dependency;
                        } else {
                            const { target, require, create, defaultArgs } = arg;

                            let dependency = this.resolve(target as any);

                            if (create && !dependency && A_TypeGuards.isAllowedForDependencyDefaultCreation(target)) {
                                const newDependency = new target(...defaultArgs);

                                this.register(newDependency);
                                return newDependency;
                            }

                            if (require && !dependency) {
                                throw new A_ScopeError(
                                    A_ScopeError.ResolutionError,
                                    `Unable to resolve required dependency ${componentName} for component ${component.name} in scope ${this.name}`
                                );
                            }

                            return dependency;
                        }
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
                throw new A_ScopeError(
                    A_ScopeError.ResolutionError,
                    `Component ${component.name} not found in the scope ${this.name}`
                );
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
                    param1.code,
                    param1 as InstanceType<_ErrorType[number]>
                );

                A_Context.register(this, param1);
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

                break;
            }
            // 3) In case when it's a A-Entity instance
            case A_TypeGuards.isEntityInstance(param1): {

                this._entities.delete(param1.aseid.toString());
                A_Context.deregister(param1);
                break;
            }
            // 4) In case when it's a A-Fragment instance
            case A_TypeGuards.isFragmentInstance(param1): {

                this._fragments.delete(param1.constructor as A_TYPES__Fragment_Constructor<_FragmentType[number]>);
                A_Context.deregister(param1);

                break;
            }
            // 5) In case when it's a A-Error instance
            case A_TypeGuards.isErrorInstance(param1): {

                this._errors.delete(param1.code);
                A_Context.deregister(param1);
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
                break;
            }
            // 9) In case when it's a A-Entity constructor
            case A_TypeGuards.isEntityConstructor(param1): {
                this.allowedEntities.delete(param1 as _EntityType[number]);
                break;
            }
            // 10) In case when it's a A-Error constructor
            case A_TypeGuards.isErrorConstructor(param1): {
                this.allowedErrors.delete(param1 as _ErrorType[number]);
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

