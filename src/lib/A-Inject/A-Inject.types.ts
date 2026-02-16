import { A_TYPES__Component_Constructor } from "@adaas/a-concept/a-component";
import { A_TYPES__Container_Constructor } from "@adaas/a-concept/a-container";
import { A_Dependency } from "@adaas/a-concept/a-dependency";


// ============================================================================
// --------------------------- Decorator Types -------------------------------
// ============================================================================
/**
 * A-Inject decorator descriptor type 
 * Indicates the type of the decorator function
 */
export type A_TYPES__A_InjectDecoratorDescriptor = TypedPropertyDescriptor<(
    ...args: any[]
) => Promise<void>>

/**
 * A-Inject decorator return type 
 * Indicates what the decorator function returns
 */
export type A_TYPES__A_InjectDecoratorReturn<T = any> = (
    target: T,
    propertyKey: string | symbol | undefined,
    parameterIndex: number
) => void


export type A_TYPES__A_InjectDecorator_Meta = Array<A_Dependency>;

/**
 * Targets that can be injected into Extended functions or constructors
 */
export type A_TYPES__InjectableTargets = A_TYPES__Component_Constructor
    | InstanceType<A_TYPES__Component_Constructor>
    | InstanceType<A_TYPES__Container_Constructor>;


