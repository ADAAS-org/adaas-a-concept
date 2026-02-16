import {
    A_Stage,
    A_TYPES__A_StageStep,
    A_TYPES_StageExecutionBehavior
} from "@adaas/a-concept/a-stage"
import { A_Entity } from "@adaas/a-concept/a-entity"
import {
    A_Container,
    A_TYPES__Container_Constructor
} from "@adaas/a-concept/a-container"
import {
    A_Component,
    A_TYPES__Component_Constructor
} from "@adaas/a-concept/a-component"
import { A_TYPES__Entity_Constructor } from "@adaas/a-concept/a-entity"
import { A_Feature } from "./A-Feature.class"
import {
    A_TYPES__Ctor,
    A_TYPES__Required
} from "@adaas/a-concept/types";
import { A_Scope } from "@adaas/a-concept/a-scope"
import { A_TYPES__Error_Init } from "@adaas/a-concept/a-error"


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Feature constructor type
 * Uses the generic type T to specify the type of the feature
 */
export type A_TYPES__Feature_Constructor<T = A_Feature> = A_TYPES__Ctor<T>;
/**
 * Feature initialization type
 */
export type A_TYPES__Feature_Init<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = A_TYPES__Feature_InitWithComponent<T> | A_TYPES__Feature_InitWithTemplate<T>
/**
 * Feature initialization type using component
 */
export type A_TYPES__Feature_InitWithComponent<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = {
    /**
     * Feature Name
     */
    name: string,
    /**
     * The component from where the feature is calling. It's important for proper scoping. 
     * Based on the component would be retrieved connected components, entities and containers.
     * 
     * [!] Could be Container, Entity, Component or Command
     */
    component: T,

    /**
     * In case when Entity is not attached to the scope can be used to transparently show dependencies
     * 
     * 
     */
    scope?: A_Scope
}
/**
 * Feature initialization type using template
 */
export type A_TYPES__Feature_InitWithTemplate<T extends A_TYPES__FeatureAvailableComponents = A_TYPES__FeatureAvailableComponents> = {
    /**
     * Feature Name
     */
    name: string,
    /**
     * The scope from where to retrieve dependent components, entities and containers. 
     * 
     * [!] Important for proper scoping. 
     */
    scope: A_Scope
    /**
     * The component from where the feature is calling. It's important for proper scoping. 
     * Based on the component would be retrieved connected components, entities and containers.
     * 
     * [!] Could be Container, Entity, Component or Command
     */
    component?: T,
    /**
     * Optional Feature template to be used instead of building it from decorators
     */
    template: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>
}

/**
 * Feature serialized type
 */
export type A_TYPES__Feature_Serialized = {}


/**
 * Feature lifecycle states
 */
export enum A_TYPES__FeatureState {
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

// ===========================================================================
// --------------------------- Error Types ------------------------------------
// ===========================================================================

export type A_TYPES__FeatureError_Init = {
    /**
     * Stage where the error occurred
     */
    stage?: A_Stage

} & A_TYPES__Error_Init



// ===========================================================================-
// --------------------------- Available Types -------------------------------
// ===========================================================================

/**
 * A list of component where features can be Defined
 * 
 * [!] On this component Feature Definition is Available
 */
export type A_TYPES__FeatureAvailableComponents = InstanceType<A_TYPES__FeatureAvailableConstructors>
/**
 * A list of constructors where features can be Defined
 * 
 * [!] On this component Feature Definition is Available
 */
export type A_TYPES__FeatureAvailableConstructors = A_TYPES__Component_Constructor
    | A_TYPES__Entity_Constructor
    | A_TYPES__Container_Constructor



// ===========================================================================
// --------------------------- Decorator Types -------------------------------
// ===========================================================================
// ---------------------------------------------------------------------------
// --------------------Feature Define Decorator Types-------------------------
// ---------------------------------------------------------------------------
/**
 * Indicates a type of Feature Define decorator
 */
export type A_TYPES__FeatureDefineDecoratorDescriptor =
    TypedPropertyDescriptor<(...args: any[]) => any>
    | TypedPropertyDescriptor<(...args: any[]) => any>
    | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
    | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
/**
 * Describes additional configuration properties to be used in Feature Define decorator
 */
export type A_TYPES__FeatureDefineDecoratorConfig = {
    /**
     * Feature name
     * 
     * [!] By default uses the method name
     */
    name: string,
    /**
     * Indicates a default behavior of the feature. If true the feature will be automatically attached to the execution.
     * 
     * [!] Before feature execution the method itself will be called to prepare the feature template
     * [!] Default is false
     */
    invoke: boolean,
    /**
     * Allows to add a default behavior or number of steps that will be part of the feature
     */
    template: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>
}
/**
 * Describes a single template item used in Feature Define decorator
 */
export type A_TYPES__FeatureDefineDecoratorTemplateItem = A_TYPES__Required<Partial<A_TYPES__A_StageStep>, ['name', 'handler', 'dependency']>
/**
 * Describes a target where Feature Define decorator can be applied
 * 
 * [!] The feature can be defined on Container, Entity, Component or Command
 */
export type A_TYPES__FeatureDefineDecoratorTarget = A_Container
    | A_Entity
    | A_Component
/**
 * A type of Meta information stored by Feature Define decorator
 * This information then uses by A-Context to build a proper feature template
 */
export type A_TYPES__FeatureDefineDecoratorMeta = {
    /**
     * Feature name
     * mainly it's a unique combination of the class name and method name
     */
    name: string,
    /**
     * Actual method name in the class
     */
    handler: string,
    /**
     * Indicates a default behavior of the feature. If true the feature will be automatically attached to the execution.
     * 
     * [!] Before feature execution the method itself will be called to prepare the feature template
     * [!] Default is false
     */
    invoke: boolean,
    /**
     * Allows to add a default behavior or number of steps that will be part of the feature
     */
    template: Array<A_TYPES__A_StageStep>
}
// ---------------------------------------------------------------------------
// --------------------Feature Extend Decorator Types-------------------------
// ---------------------------------------------------------------------------
/**
 * Descriptor type for A_Extend decorator
 */
export type A_TYPES__FeatureExtendDecoratorDescriptor =
    TypedPropertyDescriptor<() => any>
    | TypedPropertyDescriptor<(...args: any[]) => any>
    | TypedPropertyDescriptor<(...args: any[]) => Promise<any>>
    | TypedPropertyDescriptor<() => Promise<any>>
/**
 * Target type for A_Extend decorator
 * 
 * [!] Can be applied only on A-Components
 */
export type A_TYPES__FeatureExtendDecoratorTarget = A_Component | A_Container | A_Entity

/**
 * Configuration type for A_Extend decorator
 * 
 * This is an INPUT parameter provided by the user
 */
export type A_TYPES__FeatureExtendDecoratorConfig = {
    /**
     * Name of the container Lifecycle method to be extended.
     * 
     * [!] If not provided will be used the name of the method.
     * [!!] If name contains "." dot it will be considered as a path to the method.
     */
    name: string,
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
    scope: Array<A_TYPES__FeatureExtendDecoratorScopeItem> | Partial<A_TYPES__FeatureExtendDecoratorScopeConfig>,
    /**
     * The behavior of the method. 
     * In case its async it will be executed independently from the main thread.
     * 
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     * 
     */
    behavior: A_TYPES_StageExecutionBehavior
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
    before: Array<string> | RegExp

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
    after: Array<string> | RegExp
    /**
     * Indicates whether to throw an error if the step fails.
     * 
     * [!] By default is true
     */
    throwOnError: boolean

    /**
     * Allows to override particular steps in the feature sequence by provided names [Component].[Method] or by regexp
     */
    override: Array<string> | RegExp
}
/**
 * Scope item that can be used in A_Extend decorator configuration
 */
export type A_TYPES__FeatureExtendDecoratorScopeConfig = {
    /**
     * A list of components, entities or containers to include in the scope of the extension
     */
    include?: Array<A_TYPES__FeatureExtendDecoratorScopeItem>,
    /**
     * A list of components, entities or containers to exclude from the scope of the extension
     */
    exclude?: Array<A_TYPES__FeatureExtendDecoratorScopeItem>
}
/**
 * A single item that can be used in scope configuration
 */
export type A_TYPES__FeatureExtendDecoratorScopeItem = A_TYPES__Container_Constructor
    | A_TYPES__Entity_Constructor
    | A_TYPES__Component_Constructor



// =======================================================================
// --------------------------META TYPES-----------------------------------
// =======================================================================
/**
 * Meta type for A_Extend decorator
 */
export type A_TYPES__FeatureExtendDecoratorMeta = {
    /**
     * Original Feature Extension name
     * 
     * [!] could be string or regex
     */
    name: string,
    /**
     * Actual method name in the class
     */
    handler: string
    /**
     * The behavior of the method. 
     * In case its async it will be executed independently from the main thread.
     * 
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     * 
     */
    behavior: A_TYPES_StageExecutionBehavior
    /**
     * Allows to define the order of the execution of the method.
     * 
     * [!] In case the method has circular dependencies it will Throw an error.
     * 
     */
    before: string
    /**
     * Allows to define the order of the execution of the method.
     * 
     * [!] In case the method has circular dependencies it will Throw an error.
     * 
     */
    after: string
    /**
     * Indicates whether to throw an error if the step fails.
     * 
     * [!] By default is true
     */
    throwOnError: boolean,
    /**
     * Allows to override particular steps in the feature sequence by provided names [Component].[Method] or by regexp
     */
    override: string
}


