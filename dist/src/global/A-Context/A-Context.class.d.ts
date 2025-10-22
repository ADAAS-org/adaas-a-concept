import { A_TYPES__Scope_Init, A_TYPES__ScopeConfig, A_TYPES__ScopeLinkedComponents, A_TYPES_ScopeDependentComponents } from "../A-Scope/A-Scope.types";
import { A_TYPES__MetaLinkedComponentConstructors, A_TYPES__MetaLinkedComponents } from "../A-Meta/A-Meta.types";
import { A_TYPES__FeatureAvailableComponents } from "../A-Feature/A-Feature.types";
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
import { A_TYPES__ContextEnvironment } from "./A-Context.types";
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__InjectableTargets } from "../A-Inject/A-Inject.types";
import { A_TYPES__ConceptAbstractions } from "../A-Concept/A-Concept.constants";
export declare class A_Context {
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
    scope: A_Scope): A_TYPES__ScopeLinkedComponents;
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
