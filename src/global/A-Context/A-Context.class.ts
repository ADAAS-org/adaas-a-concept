import {
    A_TYPES__Scope_Init,
    A_TYPES__ScopeConfig,
    A_TYPES__ScopeLinkedComponents,
    A_TYPES_ScopeDependentComponents
} from "../A-Scope/A-Scope.types";
import {
    A_TYPES__MetaLinkedComponentConstructors,
    A_TYPES__MetaLinkedComponents
} from "../A-Meta/A-Meta.types";
import {
    A_TYPES__FeatureAvailableComponents,
    A_TYPES__FeatureDefineDecoratorMeta
} from "../A-Feature/A-Feature.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_ComponentMeta } from "../A-Component/A-Component.meta";
import { A_ContainerMeta } from "../A-Container/A-Container.meta";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_EntityMeta } from "../A-Entity/A-Entity.meta";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_TYPES__EntityMetaKey } from "../A-Entity/A-Entity.constants";
import { A_TYPES__ContainerMetaKey } from "../A-Container/A-Container.constants";
import { A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.constants";
import { A_TYPES__ContextEnvironment } from "./A-Context.types";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_ContextError } from "./A-Context.error";
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_FormatterHelper } from "@adaas/a-concept/helpers/A_Formatter.helper";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__InjectableTargets } from "../A-Inject/A-Inject.types";
import { A_TYPES__ConceptAbstraction } from "../A-Concept/A-Concept.types";
import { A_TYPES__ConceptAbstractions } from "../A-Concept/A-Concept.constants";



export class A_Context {
    // ====================================================================================================
    // ================================ STATIC PROPERTIES =================================================
    // ====================================================================================================
    /**
     * Default name of the application from environment variable A_CONCEPT_NAME
     * 
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept() {
        return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] || 'a-concept';
    }
    /**
     * Root scope of the application from environment variable A_CONCEPT_ROOT_SCOPE
     * 
     * [!] If environment variable is not set, it will default to 'root'
     */
    static get root(): A_Scope {
        return this.getInstance()._root;
    }
    /**
     * Environment the application is running in.
     * Can be either 'server' or 'browser'.
     * [!] Determined by checking if 'window' object is available.
     */
    static get environment(): A_TYPES__ContextEnvironment {
        let testEnvironment: A_TYPES__ContextEnvironment = 'browser';

        try {
            testEnvironment = window.location ? 'browser' : 'server';
        } catch (error) {
            testEnvironment = 'server';
        }

        return testEnvironment;
    }

    /**
     * Singleton instance of the Context
     */
    private static _instance: A_Context;
    // ====================================================================================================
    // ================================ INTERNAL REGISTRY =================================================
    // ====================================================================================================
    /**
     * Root Scope of the Concept and Environment
     *
     * Root scope is the top-level scope that all other scopes inherit from.
     * It stores global configurations and settings and ALL SHAREABLE RESOURCES.
     * 
     * [!] Root scope is created automatically when the Context is initialized.
     * [!] Root scope name can be configured using environment variable A_CONCEPT_ROOT_SCOPE
     */
    private _root!: A_Scope
    /**
     * A registry that keeps track of scopes for all components (Containers, Features, Commands) 
     * Which can issue a scope allocation.
     */
    protected _registry: WeakMap<A_TYPES__ScopeLinkedComponents, A_Scope> = new WeakMap();
    /**
     * This is a registry that stores an issuer of each scope allocation.
     * It helps to track which component (Container, Feature, Command) allocated a specific scope.
     */
    protected _scopeIssuers: WeakMap<A_Scope, A_TYPES__ScopeLinkedComponents> = new WeakMap();
    /**
     * Stores a context associated with a specific component that depends on a scope.
     * uses for quick retrieval of the scope for the component.
     */
    protected _scopeStorage: WeakMap<A_TYPES_ScopeDependentComponents, A_Scope> = new WeakMap();
    /**
     * Stores meta information for different component types by their constructors.
     * Meta provides to store extra information about the class behavior and configuration.
     */
    protected _metaStorage: Map<A_TYPES__MetaLinkedComponentConstructors, A_Meta> = new Map();



    /**
     * Private constructor to enforce singleton pattern.
     * 
     * [!] This class should not be instantiated directly. Use A_Context.getInstance() instead.
     */
    private constructor() {
        let name = 'root';

        if (A_Context.environment === 'server')
            name = process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';

        if (A_Context.environment === 'browser')
            name = (window as any)[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';

        this._root = new A_Scope({ name });
    }



    /**
     * Get the instance of the Namespace Provider.
     * 
     * If the instance does not exist, it will be created.
     * 
     * @returns 
     */
    static getInstance() {
        if (!A_Context._instance) {
            A_Context._instance = new A_Context();
        }

        return A_Context._instance;
    }



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
        component: A_TYPES_ScopeDependentComponents,

    ): A_Scope {
        // uses only for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        const instance = this.getInstance();

        if (!component) throw new A_ContextError(
            A_ContextError.InvalidRegisterParameterError,
            `Unable to register component. Component cannot be null or undefined.`);
        if (!scope) throw new A_ContextError(
            A_ContextError.InvalidRegisterParameterError,
            `Unable to register component. Scope cannot be null or undefined.`);
        if (!this.isAllowedToBeRegistered(component)) throw new A_ContextError(
            A_ContextError.NotAllowedForScopeAllocationError,
            `Component ${componentName} is not allowed for scope allocation.`);

        instance._scopeStorage.set(component, scope);

        return scope;
    }


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
        component: A_TYPES__ScopeLinkedComponents,
    ): A_Scope
    static allocate(
        /**
         * Provide a component that needs a scope allocation.
         */
        component: A_TYPES__ScopeLinkedComponents,
        /**
         * Provide the scope that will be used as a base for the new scope.
         */
        importing: A_Scope
    ): A_Scope
    static allocate(
        /**
         * Provide a component that needs a scope allocation.
         */
        component: A_TYPES__ScopeLinkedComponents,
        /**
         * Provide configuration for the scope that will be created for the component.
         */
        config: Partial<A_TYPES__Scope_Init & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        component: A_TYPES__ScopeLinkedComponents,
        importing?: Partial<A_TYPES__Scope_Init & A_TYPES__ScopeConfig> | A_Scope
    ): A_Scope {
        // uses only for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        // ---------------------------------------------------------------------
        // ----------------------Input Validation-------------------------------
        // ---------------------------------------------------------------------
        // 1) check if component is valid
        if (!this.isAllowedForScopeAllocation(component))
            throw new A_ContextError(A_ContextError.NotAllowedForScopeAllocationError, `Component of type ${componentName} is not allowed for scope allocation. Only A_Container, A_Feature are allowed.`);
        const instance = this.getInstance();

        // 2) check if component already has a scope allocated
        if (instance._registry.has(component))
            throw new A_ContextError(A_ContextError.ComponentAlreadyHasScopeAllocatedError, `Component ${componentName} already has a scope allocated.`);


        // 3) Create a new scope for the component
        const newScope = A_TypeGuards.isScopeInstance(importing)
            ? importing
            : new A_Scope(importing || {
                name: componentName + '-scope'
            }, importing);

        // 4) Make sure that the new scope inherits from the root scope
        if (!newScope.isInheritedFrom(A_Context.root))
            newScope.inherit(A_Context.root);

        // 5) Register the component in the appropriate storage
        instance._registry.set(component, newScope);
        // Also register the issuer of the scope for faster tracking
        instance._scopeIssuers.set(newScope, component);

        // 6) Return the newly created scope
        return newScope;
    }



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
        container: A_TYPES__Container_Constructor,
    ): A_ContainerMeta
    static meta(
        /**
         * Get meta for the specific container instance.
         */
        container: A_Container,
    ): A_ContainerMeta
    static meta(
        /**
         * Get meta for the specific entity class by constructor.
         */
        entity: A_TYPES__Entity_Constructor,
    ): A_EntityMeta
    static meta(
        /**
         * Get meta for the specific entity instance.
         */
        entity: A_Entity,
    ): A_EntityMeta
    static meta(
        /**
         * Get meta for the specific component class by constructor.
         */
        component: A_TYPES__Component_Constructor,
    ): A_ComponentMeta
    static meta(
        /**
         * Get meta for the specific component instance.
         */
        component: A_Component,
    ): A_ComponentMeta
    static meta(
        /**
         * Get meta for the specific component by its name.
         */
        component: string,
    ): A_ComponentMeta
    static meta(
        /**
         * Get meta for the specific injectable target (class or instance).
         */
        target: A_TYPES__InjectableTargets,
    ): A_ComponentMeta
    static meta<T extends Record<string, any>>(
        /**
         * Get meta for the specific class or instance
         */
        constructor: new (...args: any[]) => any
    ): A_Meta<T>

    static meta<T extends Record<string, any>>(
        param1: A_TYPES__MetaLinkedComponentConstructors
            | A_TYPES__MetaLinkedComponents
            | string
    ): A_Meta<T> {

        // Get the component name for error messages
        const componentName = (param1 as any)?.constructor?.name || String(param1);
        // Get the instance of the context
        const instance = this.getInstance();

        if (!param1) throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Parameter cannot be null or undefined.`);

        // Check if the parameter is allowed for meta storage
        if (!(
            this.isAllowedForMeta(param1)
            || this.isAllowedForMetaConstructor(param1)
            || A_TypeGuards.isString(param1)
            || A_TypeGuards.isFunction(param1
            ))
        ) throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component of type ${componentName} is not allowed for meta storage. Only A_Container, A_Component and A_Entity are allowed.`);

        let property: A_TYPES__MetaLinkedComponentConstructors;
        let metaType: typeof A_Meta<T> | typeof A_ContainerMeta | typeof A_ComponentMeta | typeof A_EntityMeta

        switch (true) {
            // 1) If param1 is instance of A_Container
            case A_TypeGuards.isContainerInstance(param1): {
                property = param1.constructor as A_TYPES__Container_Constructor;
                metaType = A_ContainerMeta;

                break;
            }
            // 2) If param1 is class of A_Container
            case A_TypeGuards.isContainerConstructor(param1): {
                property = param1 as typeof A_Container;
                metaType = A_ContainerMeta;

                break;
            }
            // 3) If param1 is instance of A_Component
            case A_TypeGuards.isComponentInstance(param1): {
                property = param1.constructor as A_TYPES__Component_Constructor;
                metaType = A_ComponentMeta;

                break;
            }
            // 4) If param1 is class of A_Component
            case A_TypeGuards.isComponentConstructor(param1): {
                property = param1 as typeof A_Component;
                metaType = A_ComponentMeta;

                break;
            }
            // 5) If param1 is instance of A_Entity
            case A_TypeGuards.isEntityInstance(param1): {
                property = param1.constructor as A_TYPES__Entity_Constructor;
                metaType = A_ComponentMeta;

                break;
            }
            // 6) If param1 is class of A_Entity
            case A_TypeGuards.isEntityConstructor(param1): {
                property = param1;
                metaType = A_EntityMeta;

                break;
            }
            // 7) If param1 is string then we need to find the component by its name
            case typeof param1 === 'string': {
                const found = Array.from(instance._metaStorage)
                    .find(([c]) => c.name === param1
                        || c.name === A_FormatterHelper.toKebabCase(param1)
                        || c.name === A_FormatterHelper.toPascalCase(param1)
                    )!;
                if (!(found && found.length))
                    throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component with name ${param1} not found in the meta storage.`);

                property = found[0];
                metaType = A_ComponentMeta;

                break;
            }
            // 8) If param1 is any other class or function
            default: {
                property = param1;
                metaType = A_Meta;

                break;
            }
        }

        // Check if the meta already exists for the property, if not create a new one
        if (!instance._metaStorage.has(property)) {
            const inheritMeta = instance._metaStorage.get(Object.getPrototypeOf(property)) || new metaType();
            instance._metaStorage.set(property, new metaType().from(inheritMeta as any));
        }

        // Return the meta for the property
        return instance._metaStorage.get(property)!;
    }


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
        scope: A_Scope
    ): A_TYPES__ScopeLinkedComponents {

        const instance = this.getInstance();

        if (!scope) throw new A_ContextError(
            A_ContextError.InvalidComponentParameterError,
            `Invalid parameter provided to get scope issuer. Parameter cannot be null or undefined.`
        );

        if (!instance._scopeIssuers.has(scope)) throw new A_ContextError(
            A_ContextError.ScopeNotFoundError,
            `Invalid parameter provided to get scope issuer. Provided scope does not have an issuer registered.`
        );

        return instance._scopeIssuers.get(scope)!;
    }



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
        entity: T
    ): A_Scope
    static scope<T extends A_Component>(
        /**
         * Provide a component to get its scope.
         */
        component: T
    ): A_Scope
    static scope<T extends A_Container>(
        /**
         * Provide a container to get its scope.
         */
        container: T
    ): A_Scope
    static scope<T extends A_Feature>(
        /**
         * Provide a feature to get its scope.
         */
        feature: T
    ): A_Scope
    static scope<T extends A_Fragment>(
        /**
         * Provide a fragment to get its scope.
         */
        fragment: T
    ): A_Scope
    static scope<T extends A_TYPES__ScopeLinkedComponents | A_TYPES_ScopeDependentComponents>(
        param1: T
    ): A_Scope {

        // for error messages
        const name = (param1 as any)?.constructor?.name || String(param1);

        // Get the instance of the context
        const instance = this.getInstance();

        // Input validation
        if (!param1) throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Parameter cannot be null or undefined.`);

        // Check if the parameter is allowed for scope allocation
        if (!this.isAllowedForScopeAllocation(param1)
            && !this.isAllowedToBeRegistered(param1)
        )
            throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed for scope allocation.`);

        switch (true) {
            case this.isAllowedForScopeAllocation(param1):

                // Check if the parameter has a scope allocated
                if (!instance._registry.has(param1))
                    throw new A_ContextError(
                        A_ContextError.ScopeNotFoundError,
                        `Invalid parameter provided to get scope. Component of type ${name} does not have a scope allocated. Make sure to allocate a scope using A_Context.allocate() method before trying to get the scope.`
                    );

                // If the parameter is allowed for scope allocation, return the scope
                return instance._registry.get(param1)!;

            case this.isAllowedToBeRegistered(param1):

                // Check if the parameter has a scope registered
                if (!instance._scopeStorage.has(param1))
                    throw new A_ContextError(
                        A_ContextError.ScopeNotFoundError,
                        `Invalid parameter provided to get scope. Component of type ${name} does not have a scope registered. Make sure to register the component using A_Context.register() method before trying to get the scope.`
                    );

                // If the parameter is allowed to be registered, return the scope from the storage
                return instance._scopeStorage.get(param1)!;
            default:
                throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed to be registered.`);
        }
    }


    // ==========================================================================================================
    // ================================== FEATURE MANAGEMENT ====================================================
    // ==========================================================================================================
    // ----------------------------------------------------------------------------------------------------------
    // -----------------------------------Primary Methods -------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------
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
        scope: A_Scope = this.scope(component)
    ): Array<A_TYPES__A_StageStep> {
        // name for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        // Input validation
        if (!component) throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!name) throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);

        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards.isAllowedForFeatureDefinition(component))
            throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);

        const steps: A_TYPES__A_StageStep[] = [
            // 1) Get the base feature definition from the component
            ...this.featureDefinition(name, component),
            // 2) Get all extensions for the feature from other components in the scope
            ...this.featureExtensions(name, component, scope)
        ];

        return steps;
    }
    // ----------------------------------------------------------------------------------------------------------
    // -----------------------------------Helper Methods --------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------
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
        scope: A_Scope
    ): Array<A_TYPES__A_StageStep> {

        const instance = this.getInstance();
        // name for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        // Input validation
        if (!component) throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!name) throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);

        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards.isAllowedForFeatureDefinition(component))
            throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);

        const callName = `${component.constructor.name}.${name}`;

        const steps: A_TYPES__A_StageStep[] = [];

        // We need to get all components that has extensions for the feature in component
        for (const [cmp, meta] of instance._metaStorage) {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(cmp) && (
                A_TypeGuards.isComponentMetaInstance(meta)
                || A_TypeGuards.isContainerMetaInstance(meta)
            )) {
                // Get all extensions for the feature
                meta
                    .extensions(callName)
                    .forEach((declaration) => {
                        steps.push({
                            component: cmp,
                            ...declaration
                        });
                    });
            }
        }

        return steps;
    }
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
        component: A_TYPES__FeatureAvailableComponents,
    ): Array<A_TYPES__A_StageStep> {
        let metaKey;

        if (!feature)
            throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
        if (!component)
            throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);


        switch (true) {
            case component instanceof A_Entity:
                metaKey = A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.FEATURES
                break;
            case component instanceof A_Component:
                metaKey = A_TYPES__ComponentMetaKey.FEATURES
                break;

            default:
                throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `A-Feature cannot be defined on the ${component} level`);
        }

        const featureDefinition: A_TYPES__FeatureDefineDecoratorMeta | undefined = this.meta(component)
            ?.get(metaKey)
            ?.get(feature);

        return [
            ...(featureDefinition?.template || [])
        ];
    }

    // ==========================================================================================================
    // ================================== ABSTRACTION MANAGEMENT =================================================
    // ==========================================================================================================
    // ----------------------------------------------------------------------------------------------------------
    // -----------------------------------Primary Methods -------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------
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
        component: A_TYPES__FeatureAvailableComponents,
    ): Array<A_TYPES__A_StageStep> {
        // name for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        // Input validation
        if (!component) throw new A_ContextError(
            A_ContextError.InvalidAbstractionTemplateParameterError,
            `Unable to get feature template. Component cannot be null or undefined.`);

        if (!abstraction) throw new A_ContextError(
            A_ContextError.InvalidAbstractionTemplateParameterError,
            `Unable to get feature template. Abstraction stage cannot be null or undefined.`);

        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards.isAllowedForAbstractionDefinition(component))
            throw new A_ContextError(A_ContextError.InvalidAbstractionTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);

        const steps: A_TYPES__A_StageStep[] = [
            // 1) Get the base abstraction definition from the component
            // [!] No abstraction Definitions -> They are limited to Concept Abstractions ONLY
            // ...this.abstractionDefinition(abstraction, component),

            // 2) Get all extensions for the abstraction from other components in the scope
            ...this.abstractionExtensions(abstraction, component)
        ];

        return steps;
    }

    // ----------------------------------------------------------------------------------------------------------
    // -----------------------------------Helper Methods --------------------------------------------------------
    // ----------------------------------------------------------------------------------------------------------

    static abstractionExtensions(
        /**
         * Provide the abstraction name to get the definition for.
         */
        abstraction: A_TYPES__ConceptAbstractions,
        /**
         * Provide the component to get the abstraction definition from.
         */
        component: A_TYPES__FeatureAvailableComponents,
    ): Array<A_TYPES__A_StageStep> {
        const instance = this.getInstance();
        // name for error messages
        const componentName = (component as any)?.constructor?.name || String(component);

        // Input validation
        if (!component) throw new A_ContextError(
            A_ContextError.InvalidAbstractionExtensionParameterError,
            `Unable to get feature template. Component cannot be null or undefined.`
        );
        if (!abstraction) throw new A_ContextError(
            A_ContextError.InvalidAbstractionExtensionParameterError,
            `Unable to get feature template. Abstraction stage cannot be null or undefined.`
        );
        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards.isAllowedForAbstractionDefinition(component))
            throw new A_ContextError
                (A_ContextError.InvalidAbstractionExtensionParameterError,
                    `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`
                );

        const steps: A_TYPES__A_StageStep[] = [];

        const scope = this.scope(component);

        // We need to get all components that has extensions for the feature in component
        for (const [cmp, meta] of instance._metaStorage) {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(cmp) && (
                A_TypeGuards.isComponentMetaInstance(meta)
                || A_TypeGuards.isContainerMetaInstance(meta)
            )) {
                // Get all extensions for the feature
                meta
                    .abstractions(abstraction)
                    .forEach((declaration) => {
                        steps.push({
                            component: cmp,
                            ...declaration
                        });
                    });
            }
        }

        return steps;
    }



    /**
     * Resets the Context to its initial state.
     */
    static reset() {
        const instance = A_Context.getInstance();

        instance._registry = new WeakMap();

        let name = 'root';

        if (A_Context.environment === 'server')
            name = process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';

        if (A_Context.environment === 'browser')
            name = (window as any)[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';

        instance._root = new A_Scope({ name });
    }




    // ====================================================================================================================
    // ====================================== HELPERS & GUARDS ============================================================
    // ====================================================================================================================
    /**
     * Type guard to check if the param is allowed for scope allocation.
     * 
     * @param param 
     * @returns 
     */
    static isAllowedForScopeAllocation(param: any): param is A_TYPES__ScopeLinkedComponents {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isFeatureInstance(param);
    }
    /**
     * Type guard to check if the param is allowed to be registered in the context.
     * 
     * @param param 
     * @returns 
     */
    static isAllowedToBeRegistered(param: any): param is A_TYPES_ScopeDependentComponents {
        return A_TypeGuards.isEntityInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isFragmentInstance(param);
    }

    /**
     * Type guard to check if the param is allowed for meta storage.
     * 
     * @param param 
     * @returns 
     */
    static isAllowedForMeta(param: any): param is A_TYPES__MetaLinkedComponents {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }
    /**
     * Type guard to check if the param is allowed for meta storage by constructor.
     * 
     * @param param 
     * @returns 
     */
    static isAllowedForMetaConstructor(param: any): param is A_TYPES__MetaLinkedComponentConstructors {
        return A_TypeGuards.isContainerConstructor(param)
            || A_TypeGuards.isComponentConstructor(param)
            || A_TypeGuards.isEntityConstructor(param);
    }



}