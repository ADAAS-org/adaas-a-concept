import { A as A_Scope, a as A_TYPES__ContextEnvironment, b as A_TYPES__ScopeLinkedComponents, c as A_TYPES_ScopeDependentComponents, d as A_TYPES__MetaLinkedComponentConstructors, e as A_Meta, f as A_TYPES__Scope_Init, g as A_TYPES__ScopeConfig, h as A_ContainerMeta, i as A_TYPES__Container_Constructor, j as A_Container, k as A_EntityMeta, l as A_TYPES__Entity_Constructor, m as A_Entity, n as A_ComponentMeta, o as A_TYPES__Component_Constructor, p as A_Component, q as A_TYPES__Fragment_Constructor, r as A_Fragment, s as A_TYPES__MetaLinkedComponents, t as A_TYPES__Ctor, u as A_Feature, v as A_TYPES__FeatureAvailableComponents, w as A_TYPES__A_StageStep, x as A_TYPES__ConceptAbstractions, y as A_Error, z as A_Caller, B as A_TYPES__A_DependencyResolutionStrategy, C as A_TYPES__A_InjectDecoratorReturn, D as A_TYPES__Error_Constructor, E as A_TYPES__Feature_Constructor, F as A_TYPES__Scope_Constructor, G as A_TYPES__A_DependencyInjectable, H as A_Dependency, I as A_TYPES__DeepPartial, J as A_TYPES__ScopeLinkedConstructors, K as A_TYPES__AbstractionAvailableComponents, L as A_TYPES__InjectableTargets, M as A_TYPES__FeatureExtendDecoratorTarget, N as A_TYPES__Error_Init, O as A_TYPES__Error_Serialized } from './A-Context.types-BtR_HJ0j.js';
export { S as ASEID, Q as A_Abstraction, R as A_Abstraction_Extend, P as A_Concept, _ as A_Dependency_Default, Z as A_Dependency_Load, Y as A_Dependency_Require, T as A_FeatureError, U as A_Feature_Define, V as A_Feature_Extend, W as A_Stage, X as A_StageError, $ as A_StepsManager, a_ as A_TYPES_ScopeIndependentComponents, aW as A_TYPES_StageExecutionBehavior, aB as A_TYPES__ASEID_Constructor, aC as A_TYPES__ASEID_ConstructorConfig, aD as A_TYPES__ASEID_JSON, b2 as A_TYPES__A_DependencyConstructor, b3 as A_TYPES__A_DependencyResolutionType, bd as A_TYPES__A_Dependency_AllDecoratorReturn, ba as A_TYPES__A_Dependency_DefaultDecoratorReturn, b7 as A_TYPES__A_Dependency_EntityInjectionPagination, b6 as A_TYPES__A_Dependency_EntityInjectionQuery, b5 as A_TYPES__A_Dependency_EntityResolutionConfig, bc as A_TYPES__A_Dependency_FlatDecoratorReturn, b9 as A_TYPES__A_Dependency_LoadDecoratorReturn, bb as A_TYPES__A_Dependency_ParentDecoratorReturn, b8 as A_TYPES__A_Dependency_RequireDecoratorReturn, b4 as A_TYPES__A_Dependency_Serialized, be as A_TYPES__A_InjectDecoratorDescriptor, bf as A_TYPES__A_InjectDecorator_Meta, aY as A_TYPES__A_StageStepProcessingExtraParams, aV as A_TYPES__A_Stage_Status, aA as A_TYPES__AbstractionDecoratorConfig, az as A_TYPES__AbstractionDecoratorDescriptor, aw as A_TYPES__Abstraction_Constructor, ax as A_TYPES__Abstraction_Init, ay as A_TYPES__Abstraction_Serialized, an as A_TYPES__ComponentMeta, ao as A_TYPES__ComponentMetaExtension, ap as A_TYPES__ComponentMetaKey, al as A_TYPES__Component_Init, am as A_TYPES__Component_Serialized, ae as A_TYPES__ConceptAbstraction, ad as A_TYPES__ConceptAbstractionMeta, af as A_TYPES__ConceptMetaKey, aa as A_TYPES__Concept_Constructor, ab as A_TYPES__Concept_Init, ac as A_TYPES__Concept_Serialized, ai as A_TYPES__ContainerMeta, aj as A_TYPES__ContainerMetaExtension, ak as A_TYPES__ContainerMetaKey, ag as A_TYPES__Container_Init, ah as A_TYPES__Container_Serialized, a1 as A_TYPES__Dictionary, av as A_TYPES__EntityFeatures, at as A_TYPES__EntityMeta, au as A_TYPES__EntityMetaKey, ar as A_TYPES__Entity_Init, as as A_TYPES__Entity_Serialized, a7 as A_TYPES__ExtractNested, a8 as A_TYPES__ExtractProperties, aK as A_TYPES__FeatureAvailableConstructors, aM as A_TYPES__FeatureDefineDecoratorConfig, aL as A_TYPES__FeatureDefineDecoratorDescriptor, aP as A_TYPES__FeatureDefineDecoratorMeta, aO as A_TYPES__FeatureDefineDecoratorTarget, aN as A_TYPES__FeatureDefineDecoratorTemplateItem, aJ as A_TYPES__FeatureError_Init, aR as A_TYPES__FeatureExtendDecoratorConfig, aQ as A_TYPES__FeatureExtendDecoratorDescriptor, aU as A_TYPES__FeatureExtendDecoratorMeta, aS as A_TYPES__FeatureExtendDecoratorScopeConfig, aT as A_TYPES__FeatureExtendDecoratorScopeItem, a9 as A_TYPES__FeatureExtendableMeta, aI as A_TYPES__FeatureState, aE as A_TYPES__Feature_Init, aF as A_TYPES__Feature_InitWithComponent, aG as A_TYPES__Feature_InitWithTemplate, aH as A_TYPES__Feature_Serialized, b0 as A_TYPES__Fragment_Init, b1 as A_TYPES__Fragment_Serialized, aq as A_TYPES__IEntity, a$ as A_TYPES__Meta_Constructor, a2 as A_TYPES__NonObjectPaths, a0 as A_TYPES__ObjectKeyEnum, a3 as A_TYPES__Paths, a5 as A_TYPES__PathsToObject, a6 as A_TYPES__Required, aZ as A_TYPES__Scope_Serialized, aX as A_TYPES__Stage_Serialized, a4 as A_TYPES__UnionToIntersection } from './A-Context.types-BtR_HJ0j.js';

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
     * Runtime environment of the application e.g. browser, node
     */
    readonly A_CONCEPT_RUNTIME_ENVIRONMENT: "A_CONCEPT_RUNTIME_ENVIRONMENT";
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
declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_NAME", "A_CONCEPT_ROOT_SCOPE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_RUNTIME_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "A_ERROR_DEFAULT_DESCRIPTION"];

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
     * [!] Determined by environment variable A_CONCEPT_RUNTIME_ENVIRONMENT that comes from the build tool or is set manually in the environment.
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
    protected _globals: Map<string, any>;
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
    static meta<T extends A_ContainerMeta>(
    /**
     * Get meta for the specific container class by constructor.
     */
    container: A_TYPES__Container_Constructor): T;
    static meta<T extends A_ContainerMeta>(
    /**
     * Get meta for the specific container instance.
     */
    container: A_Container): T;
    static meta<T extends A_EntityMeta>(
    /**
     * Get meta for the specific entity class by constructor.
     */
    entity: A_TYPES__Entity_Constructor): T;
    static meta<T extends A_EntityMeta>(
    /**
     * Get meta for the specific entity instance.
     */
    entity: A_Entity): T;
    static meta<T extends A_ComponentMeta>(
    /**
     * Get meta for the specific component class by constructor.
     */
    component: A_TYPES__Component_Constructor): T;
    static meta<T extends A_ComponentMeta>(
    /**
     * Get meta for the specific component instance.
     */
    component: A_Component): T;
    static meta<T extends A_Meta>(
    /**
     * Get meta for the specific component class by constructor.
     */
    fragment: A_TYPES__Fragment_Constructor): T;
    static meta<T extends A_Meta>(
    /**
     * Get meta for the specific component instance.
     */
    fragment: A_Fragment): T;
    static meta<T extends A_ComponentMeta>(
    /**
     * Get meta for the specific component by its name.
     */
    component: string): T;
    static meta(
    /**
     * Get meta for the specific meta linked component (class or instance).
     */
    target: A_TYPES__MetaLinkedComponentConstructors | A_TYPES__MetaLinkedComponents): A_ComponentMeta;
    static meta<T extends A_Meta>(
    /**
     * Get meta for the specific class or instance
     */
    constructor: A_TYPES__Ctor<any>): T;
    static meta<T extends Record<string, any>>(
    /**
     * Get meta for the specific class or instance
     */
    constructor: A_TYPES__Ctor<any>): A_Meta<T>;
    /**
     * Allows to set meta for the specific class or instance.
     *
     * @param param1
     * @param meta
     */
    static setMeta<T extends A_ContainerMeta, S extends A_Container>(param1: S, meta: T): any;
    static setMeta<T extends A_EntityMeta, S extends A_Entity>(param1: S, meta: T): any;
    static setMeta<T extends A_ComponentMeta, S extends A_Component>(param1: S, meta: T): any;
    static setMeta<T extends A_Meta>(param1: new (...args: any[]) => any, meta: T): any;
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

declare class A_ContextError extends A_Error {
    static NotAllowedForScopeAllocationError: string;
    static ComponentAlreadyHasScopeAllocatedError: string;
    static InvalidMetaParameterError: string;
    static InvalidScopeParameterError: string;
    static ScopeNotFoundError: string;
    static InvalidFeatureParameterError: string;
    static InvalidFeatureDefinitionParameterError: string;
    static InvalidFeatureTemplateParameterError: string;
    static InvalidFeatureExtensionParameterError: string;
    static InvalidAbstractionParameterError: string;
    static InvalidAbstractionDefinitionParameterError: string;
    static InvalidAbstractionTemplateParameterError: string;
    static InvalidAbstractionExtensionParameterError: string;
    static InvalidInjectionParameterError: string;
    static InvalidExtensionParameterError: string;
    static InvalidRegisterParameterError: string;
    static InvalidComponentParameterError: string;
    static ComponentNotRegisteredError: string;
    static InvalidDeregisterParameterError: string;
}

declare class A_ConceptMeta extends A_Meta<any> {
    private containers;
    constructor(containers: Array<A_Container>);
}

declare class A_EntityError extends A_Error {
    /**
     * Error code for validation errors.
     */
    static readonly ValidationError = "A-Entity Validation Error";
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

type A_TYPES__CallerComponent = A_Container | A_Component | A_Entity;
/**
 * Caller constructor type
 * Uses the generic type T to specify the type of the caller component
 */
type A_TYPES__Caller_Constructor<T = A_Caller> = A_TYPES__Ctor<T>;
/**
 * Caller initialization type
 */
type A_TYPES__Caller_Init = {};
/**
 * Caller serialized type
 */
type A_TYPES__Caller_Serialized = {};

declare const A_CONSTANTS__ERROR_CODES: {
    readonly UNEXPECTED_ERROR: "A-Error Unexpected Error";
    readonly VALIDATION_ERROR: "A-Error Validation Error";
};
declare const A_CONSTANTS__ERROR_DESCRIPTION = "If you see this error please let us know.";

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
    static readonly CircularImportError = "A-Scope Circular Import Error";
    static readonly DeregistrationError = "A-Scope Deregistration Error";
}

/**
 *
 * This decorator should allow to set a default meta type for the class, this helps to avoid
 * the need to create custom meta classes for each class.
 *
 * @returns
 */
declare function A_MetaDecorator<T extends A_Meta>(constructor: A_TYPES__Ctor<T>): <TTarget extends A_TYPES__MetaLinkedComponentConstructors>(target: TTarget) => TTarget;

declare class A_DependencyError extends A_Error {
    static readonly InvalidDependencyTarget = "Invalid Dependency Target";
    static readonly InvalidLoadTarget = "Invalid Load Target";
    static readonly InvalidLoadPath = "Invalid Load Path";
    static readonly InvalidDefaultTarget = "Invalid Default Target";
    static readonly ResolutionParametersError = "Dependency Resolution Parameters Error";
}

declare class A_InjectError extends A_Error {
    static readonly InvalidInjectionTarget = "Invalid target for A-Inject decorator";
    static readonly MissingInjectionTarget = "Missing target for A-Inject decorator";
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
declare function A_Inject<T extends A_Component>(
/**
 * Provide the Component constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Component from current Scope or from Parent Scopes.
 */
component: A_TYPES__Component_Constructor<T>, 
/**
 * Provide additional instructions on how to perform the injection
 *
 * [!] Default Pagination is 1 if it's necessary to get multiple Fragments please customize it in the instructions
 */
config?: Omit<Partial<A_TYPES__A_DependencyResolutionStrategy<T>>, 'query' | 'pagination'>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Fragment>(
/**
 * Provide the Fragment constructor to inject the Fragment instance
 *
 * [!] It returns the Fragment instance from current Scope or from Parent Scopes.
 */
fragment: A_TYPES__Fragment_Constructor<T>, 
/**
 * Provide additional instructions on how to perform the injection
 *
 * [!] Default Pagination is 1 if it's necessary to get multiple Fragments please customize it in the instructions
 */
config?: Omit<Partial<A_TYPES__A_DependencyResolutionStrategy<T>>, 'query' | 'pagination'>): A_TYPES__A_InjectDecoratorReturn;
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
config?: Partial<A_TYPES__A_DependencyResolutionStrategy<T>>): A_TYPES__A_InjectDecoratorReturn<T>;
declare function A_Inject<T extends A_Component>(
/**
 * Provide the name of Component constructor to inject the Component instance
 *
 * [!] You can use both customized one or original depending on your overriding strategy
 */
ctor: string): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Caller>(
/**
 * Provide the A_Caller constructor to inject the Caller instance
 *
 * [!] It returns initiator of the call, e.g. Container/Component/Command who called Feature
 */
caller: A_TYPES__Caller_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Error>(
/***
 * Provide the Error constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Error what is executed.
 */
error: A_TYPES__Error_Constructor<T>, 
/**
 * Provide additional instructions on how to perform the injection
 *
 * [!] Default Pagination is 1 if it's necessary to get multiple Fragments please customize it in the instructions
 */
config?: Omit<Partial<A_TYPES__A_DependencyResolutionStrategy<T>>, 'query' | 'pagination'>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Feature>(
/**
 * Provide the Feature constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Feature what is executed.
 */
feature: A_TYPES__Feature_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_Scope>(
/***
 * Provide the Scope constructor that will be associated with the injection.
 *
 * [!] It returns an instance of the Scope where the Entity/Component/Container is defined.
 */
scope: A_TYPES__Scope_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
declare function A_Inject<T extends A_TYPES__A_DependencyInjectable>(
/***
 * Provide the Scope constructor that will be associated with the injection.
 *
 * [!] It returns an instance of the Scope where the Entity/Component/Container is defined.
 */
dependency: A_Dependency<T>): A_TYPES__A_InjectDecoratorReturn;

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
     * Get all parent classes of a given class
     *
     * @param childClass
     * @returns
     */
    static getParentClasses(childClass: any): any[];
    /**
     * Get the class inheritance chain as an array of class names
     *
     * @param childClass
     * @returns
     */
    static getClassInheritanceChain(childClass: any): any[];
    /**
     * Get the parent class of a given class
     *
     * @param childClass
     * @returns
     */
    static getParentClass(childClass: any): any;
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
    /**
     * Generates a simple hash string from the input string.
     *
     *
     * @param input
     * @returns
     */
    static hashString(input: string): string;
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
     * Type guard to check if the constructor is of type A_Dependency
     *
     * @param ctor
     * @returns
     */
    static isDependencyConstructor<T extends A_TYPES__A_DependencyInjectable>(ctor: any): ctor is A_Dependency<T>;
    /**
     * Type guard to check if the instance is of type A_Dependency
     *
     * @param instance
     * @returns
     */
    static isDependencyInstance<T extends A_TYPES__A_DependencyInjectable>(instance: any): instance is A_Dependency<T>;
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
    static hasASEID(value: any): value is A_Entity | A_Error;
    static isConstructorAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedConstructors;
    static isInstanceAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedComponents;
    static isConstructorAvailableForAbstraction(target: any): target is A_TYPES__AbstractionAvailableComponents;
    static isTargetAvailableForInjection(target: any): target is A_TYPES__InjectableTargets;
    static isAllowedForFeatureCall(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureDefinition(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureExtension(param: any): param is A_TYPES__FeatureExtendDecoratorTarget;
    static isAllowedForAbstractionDefinition(param: any): param is A_TYPES__AbstractionAvailableComponents;
    static isAllowedForDependencyDefaultCreation(param: any): param is A_TYPES__Entity_Constructor | A_TYPES__Fragment_Constructor;
    /**
     * Allows to check if the provided param is of constructor type.
     *
     * @param param
     * @returns
     */
    static isErrorConstructorType<T extends A_TYPES__Error_Init>(param: any): param is T;
    static isErrorSerializedType<T extends A_TYPES__Error_Serialized>(param: any): param is T;
    static isPromiseInstance<T>(value: any): value is Promise<T>;
}

export { ASEID_Error, A_AbstractionError, A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, A_CONSTANTS__ERROR_CODES, A_CONSTANTS__ERROR_DESCRIPTION, A_Caller, A_CallerError, A_CommonHelper, A_Component, A_ComponentMeta, A_ConceptMeta, A_Container, A_ContainerMeta, A_Context, A_ContextError, A_Dependency, A_DependencyError, A_Entity, A_EntityError, A_EntityMeta, A_Error, A_Feature, A_FormatterHelper, A_Fragment, type A_ID_TYPES__TimeId_Parts, A_IdentityHelper, A_Inject, A_InjectError, A_Meta, A_MetaDecorator, A_Scope, A_ScopeError, A_StepManagerError, A_TYPES_ScopeDependentComponents, A_TYPES__A_DependencyInjectable, A_TYPES__A_DependencyResolutionStrategy, A_TYPES__A_InjectDecoratorReturn, A_TYPES__A_StageStep, A_TYPES__AbstractionAvailableComponents, type A_TYPES__CallerComponent, type A_TYPES__Caller_Constructor, type A_TYPES__Caller_Init, type A_TYPES__Caller_Serialized, A_TYPES__Component_Constructor, A_TYPES__ConceptAbstractions, type A_TYPES__ConceptENVVariables, A_TYPES__Container_Constructor, A_TYPES__ContextEnvironment, A_TYPES__Ctor, A_TYPES__DeepPartial, A_TYPES__Entity_Constructor, A_TYPES__Error_Constructor, A_TYPES__Error_Init, A_TYPES__Error_Serialized, A_TYPES__FeatureAvailableComponents, A_TYPES__FeatureExtendDecoratorTarget, A_TYPES__Feature_Constructor, A_TYPES__Fragment_Constructor, A_TYPES__InjectableTargets, A_TYPES__MetaLinkedComponentConstructors, A_TYPES__MetaLinkedComponents, A_TYPES__ScopeConfig, A_TYPES__ScopeLinkedComponents, A_TYPES__ScopeLinkedConstructors, A_TYPES__Scope_Constructor, A_TYPES__Scope_Init, A_TypeGuards };
