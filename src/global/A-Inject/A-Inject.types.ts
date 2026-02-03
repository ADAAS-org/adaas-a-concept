import { A_TYPES__Component_Constructor } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_TYPES__Container_Constructor } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Entity_Constructor } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_TYPES__Feature_Constructor } from "@adaas/a-concept/global/A-Feature/A-Feature.types";
import { A_TYPES__Fragment_Constructor } from "@adaas/a-concept/global/A-Fragment/A-Fragment.types";
import { A_TYPES__Caller_Constructor } from "@adaas/a-concept/global/A-Caller/A_Caller.types";
import { A_TYPES__Error_Constructor } from "../A-Error/A_Error.types";
import { A_Dependency } from "../A-Dependency/A-Dependency.class";


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


