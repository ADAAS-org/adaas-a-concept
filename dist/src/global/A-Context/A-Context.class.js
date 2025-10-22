"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Context = void 0;
const A_Component_class_1 = require("../A-Component/A-Component.class");
const A_Container_class_1 = require("../A-Container/A-Container.class");
const A_Scope_class_1 = require("../A-Scope/A-Scope.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Component_meta_1 = require("../A-Component/A-Component.meta");
const A_Container_meta_1 = require("../A-Container/A-Container.meta");
const A_Entity_class_1 = require("../A-Entity/A-Entity.class");
const A_Entity_meta_1 = require("../A-Entity/A-Entity.meta");
const env_constants_1 = require("../../constants/env.constants");
const A_Entity_constants_1 = require("../A-Entity/A-Entity.constants");
const A_Container_constants_1 = require("../A-Container/A-Container.constants");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Context_error_1 = require("./A-Context.error");
const A_Formatter_helper_1 = require("../../helpers/A_Formatter.helper");
class A_Context {
    // ====================================================================================================
    // ================================ STATIC PROPERTIES =================================================
    // ====================================================================================================
    /**
     * Default name of the application from environment variable A_CONCEPT_NAME
     *
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get concept() {
        return process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] || 'a-concept';
    }
    /**
     * Root scope of the application from environment variable A_CONCEPT_ROOT_SCOPE
     *
     * [!] If environment variable is not set, it will default to 'root'
     */
    static get root() {
        return this.getInstance()._root;
    }
    /**
     * Environment the application is running in.
     * Can be either 'server' or 'browser'.
     * [!] Determined by checking if 'window' object is available.
     */
    static get environment() {
        let testEnvironment = 'browser';
        try {
            testEnvironment = window.location ? 'browser' : 'server';
        }
        catch (error) {
            testEnvironment = 'server';
        }
        return testEnvironment;
    }
    /**
     * Private constructor to enforce singleton pattern.
     *
     * [!] This class should not be instantiated directly. Use A_Context.getInstance() instead.
     */
    constructor() {
        /**
         * A registry that keeps track of scopes for all components (Containers, Features, Commands)
         * Which can issue a scope allocation.
         */
        this._registry = new WeakMap();
        /**
         * This is a registry that stores an issuer of each scope allocation.
         * It helps to track which component (Container, Feature, Command) allocated a specific scope.
         */
        this._scopeIssuers = new WeakMap();
        /**
         * Stores a context associated with a specific component that depends on a scope.
         * uses for quick retrieval of the scope for the component.
         */
        this._scopeStorage = new WeakMap();
        /**
         * Stores meta information for different component types by their constructors.
         * Meta provides to store extra information about the class behavior and configuration.
         */
        this._metaStorage = new Map();
        let name = 'root';
        if (A_Context.environment === 'server')
            name = process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';
        if (A_Context.environment === 'browser')
            name = window[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';
        this._root = new A_Scope_class_1.A_Scope({ name });
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
    scope, 
    /**
     * Provide a component that needs to be registered with a specific scope.
     */
    component) {
        var _a;
        // uses only for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        const instance = this.getInstance();
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidRegisterParameterError, `Unable to register component. Component cannot be null or undefined.`);
        if (!scope)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidRegisterParameterError, `Unable to register component. Scope cannot be null or undefined.`);
        if (!this.isAllowedToBeRegistered(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.NotAllowedForScopeAllocationError, `Component ${componentName} is not allowed for scope allocation.`);
        instance._scopeStorage.set(component, scope);
        return scope;
    }
    static allocate(component, importing) {
        var _a;
        // uses only for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        // ---------------------------------------------------------------------
        // ----------------------Input Validation-------------------------------
        // ---------------------------------------------------------------------
        // 1) check if component is valid
        if (!this.isAllowedForScopeAllocation(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.NotAllowedForScopeAllocationError, `Component of type ${componentName} is not allowed for scope allocation. Only A_Container, A_Feature are allowed.`);
        const instance = this.getInstance();
        // 2) check if component already has a scope allocated
        if (instance._registry.has(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.ComponentAlreadyHasScopeAllocatedError, `Component ${componentName} already has a scope allocated.`);
        // 3) Create a new scope for the component
        const newScope = A_TypeGuards_helper_1.A_TypeGuards.isScopeInstance(importing)
            ? importing
            : new A_Scope_class_1.A_Scope(importing || {
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
    static meta(param1) {
        var _a;
        // Get the component name for error messages
        const componentName = ((_a = param1 === null || param1 === void 0 ? void 0 : param1.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(param1);
        // Get the instance of the context
        const instance = this.getInstance();
        if (!param1)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Parameter cannot be null or undefined.`);
        // Check if the parameter is allowed for meta storage
        if (!(this.isAllowedForMeta(param1)
            || this.isAllowedForMetaConstructor(param1)
            || A_TypeGuards_helper_1.A_TypeGuards.isString(param1)
            || A_TypeGuards_helper_1.A_TypeGuards.isFunction(param1)))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component of type ${componentName} is not allowed for meta storage. Only A_Container, A_Component and A_Entity are allowed.`);
        let property;
        let metaType;
        switch (true) {
            // 1) If param1 is instance of A_Container
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(param1): {
                property = param1.constructor;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            // 2) If param1 is class of A_Container
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerConstructor(param1): {
                property = param1;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            // 3) If param1 is instance of A_Component
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentInstance(param1): {
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 4) If param1 is class of A_Component
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(param1): {
                property = param1;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 5) If param1 is instance of A_Entity
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityInstance(param1): {
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 6) If param1 is class of A_Entity
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(param1): {
                property = param1;
                metaType = A_Entity_meta_1.A_EntityMeta;
                break;
            }
            // 7) If param1 is string then we need to find the component by its name
            case typeof param1 === 'string': {
                const found = Array.from(instance._metaStorage)
                    .find(([c]) => c.name === param1
                    || c.name === A_Formatter_helper_1.A_FormatterHelper.toKebabCase(param1)
                    || c.name === A_Formatter_helper_1.A_FormatterHelper.toPascalCase(param1));
                if (!(found && found.length))
                    throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component with name ${param1} not found in the meta storage.`);
                property = found[0];
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 8) If param1 is any other class or function
            default: {
                property = param1;
                metaType = A_Meta_class_1.A_Meta;
                break;
            }
        }
        // Check if the meta already exists for the property, if not create a new one
        if (!instance._metaStorage.has(property)) {
            const inheritMeta = instance._metaStorage.get(Object.getPrototypeOf(property)) || new metaType();
            instance._metaStorage.set(property, new metaType().from(inheritMeta));
        }
        // Return the meta for the property
        return instance._metaStorage.get(property);
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
    scope) {
        const instance = this.getInstance();
        if (!scope)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidComponentParameterError, `Invalid parameter provided to get scope issuer. Parameter cannot be null or undefined.`);
        if (!instance._scopeIssuers.has(scope))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.ScopeNotFoundError, `Invalid parameter provided to get scope issuer. Provided scope does not have an issuer registered.`);
        return instance._scopeIssuers.get(scope);
    }
    static scope(param1) {
        var _a;
        // for error messages
        const name = ((_a = param1 === null || param1 === void 0 ? void 0 : param1.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(param1);
        // Get the instance of the context
        const instance = this.getInstance();
        // Input validation
        if (!param1)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Parameter cannot be null or undefined.`);
        // Check if the parameter is allowed for scope allocation
        if (!this.isAllowedForScopeAllocation(param1)
            && !this.isAllowedToBeRegistered(param1))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed for scope allocation.`);
        switch (true) {
            case this.isAllowedForScopeAllocation(param1):
                // Check if the parameter has a scope allocated
                if (!instance._registry.has(param1))
                    throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.ScopeNotFoundError, `Invalid parameter provided to get scope. Component of type ${name} does not have a scope allocated. Make sure to allocate a scope using A_Context.allocate() method before trying to get the scope.`);
                // If the parameter is allowed for scope allocation, return the scope
                return instance._registry.get(param1);
            case this.isAllowedToBeRegistered(param1):
                // Check if the parameter has a scope registered
                if (!instance._scopeStorage.has(param1))
                    throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.ScopeNotFoundError, `Invalid parameter provided to get scope. Component of type ${name} does not have a scope registered. Make sure to register the component using A_Context.register() method before trying to get the scope.`);
                // If the parameter is allowed to be registered, return the scope from the storage
                return instance._scopeStorage.get(param1);
            default:
                throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed to be registered.`);
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
    name, 
    /**
     * Provide the component to get the feature template from.
     */
    component, 
    /**
     * Provide the scope that dictates which components are active and can provide extensions for the feature.
     */
    scope = this.scope(component)) {
        var _a;
        // name for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        // Input validation
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!name)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureDefinition(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
        const steps = [
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
    name, 
    /**
     * Provide the component to get the feature template from.
     */
    component, 
    /**
     * Provide the scope that dictates which components are active and can provide extensions for the feature.
     */
    scope) {
        var _a;
        const instance = this.getInstance();
        // name for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        // Input validation
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!name)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureDefinition(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
        const callName = `${component.constructor.name}.${name}`;
        const steps = [];
        // We need to get all components that has extensions for the feature in component
        for (const [cmp, meta] of instance._metaStorage) {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(cmp) && (A_TypeGuards_helper_1.A_TypeGuards.isComponentMetaInstance(meta)
                || A_TypeGuards_helper_1.A_TypeGuards.isContainerMetaInstance(meta))) {
                // Get all extensions for the feature
                meta
                    .extensions(callName)
                    .forEach((declaration) => {
                    steps.push(Object.assign({ component: cmp }, declaration));
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
    feature, 
    /**
     * Component to get the feature template from.
     */
    component) {
        var _a, _b;
        let metaKey;
        if (!feature)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        switch (true) {
            case component instanceof A_Entity_class_1.A_Entity:
                metaKey = A_Entity_constants_1.A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_constants_1.A_TYPES__ContainerMetaKey.FEATURES;
                break;
            case component instanceof A_Component_class_1.A_Component:
                metaKey = A_Component_constants_1.A_TYPES__ComponentMetaKey.FEATURES;
                break;
            default:
                throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidFeatureTemplateParameterError, `A-Feature cannot be defined on the ${component} level`);
        }
        const featureDefinition = (_b = (_a = this.meta(component)) === null || _a === void 0 ? void 0 : _a.get(metaKey)) === null || _b === void 0 ? void 0 : _b.get(feature);
        return [
            ...((featureDefinition === null || featureDefinition === void 0 ? void 0 : featureDefinition.template) || [])
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
    abstraction, 
    /**
     * Provide the component to get the abstraction definition from.
     */
    component) {
        var _a;
        // name for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        // Input validation
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!abstraction)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionTemplateParameterError, `Unable to get feature template. Abstraction stage cannot be null or undefined.`);
        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForAbstractionDefinition(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
        const steps = [
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
    abstraction, 
    /**
     * Provide the component to get the abstraction definition from.
     */
    component) {
        var _a;
        const instance = this.getInstance();
        // name for error messages
        const componentName = ((_a = component === null || component === void 0 ? void 0 : component.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(component);
        // Input validation
        if (!component)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionExtensionParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
        if (!abstraction)
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionExtensionParameterError, `Unable to get feature template. Abstraction stage cannot be null or undefined.`);
        // Check if the parameter is allowed for feature definition
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForAbstractionDefinition(component))
            throw new A_Context_error_1.A_ContextError(A_Context_error_1.A_ContextError.InvalidAbstractionExtensionParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
        const steps = [];
        const scope = this.scope(component);
        // We need to get all components that has extensions for the feature in component
        for (const [cmp, meta] of instance._metaStorage) {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(cmp) && (A_TypeGuards_helper_1.A_TypeGuards.isComponentMetaInstance(meta)
                || A_TypeGuards_helper_1.A_TypeGuards.isContainerMetaInstance(meta))) {
                // Get all extensions for the feature
                meta
                    .abstractions(abstraction)
                    .forEach((declaration) => {
                    steps.push(Object.assign({ component: cmp }, declaration));
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
            name = process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';
        if (A_Context.environment === 'browser')
            name = window[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || 'root';
        instance._root = new A_Scope_class_1.A_Scope({ name });
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
    static isAllowedForScopeAllocation(param) {
        return A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isFeatureInstance(param);
    }
    /**
     * Type guard to check if the param is allowed to be registered in the context.
     *
     * @param param
     * @returns
     */
    static isAllowedToBeRegistered(param) {
        return A_TypeGuards_helper_1.A_TypeGuards.isEntityInstance(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isFragmentInstance(param);
    }
    /**
     * Type guard to check if the param is allowed for meta storage.
     *
     * @param param
     * @returns
     */
    static isAllowedForMeta(param) {
        return A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isEntityInstance(param);
    }
    /**
     * Type guard to check if the param is allowed for meta storage by constructor.
     *
     * @param param
     * @returns
     */
    static isAllowedForMetaConstructor(param) {
        return A_TypeGuards_helper_1.A_TypeGuards.isContainerConstructor(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(param)
            || A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(param);
    }
}
exports.A_Context = A_Context;
//# sourceMappingURL=A-Context.class.js.map