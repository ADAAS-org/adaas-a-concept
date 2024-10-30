import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__A_InjectDecoratorReturn, A_TYPES__A_InjectDecoratorStorageInstruction } from "./A-Inject.decorator.types";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";





/**
 * A-Inject decorator
 * 
 * This Decorator allows to inject dependencies into the module like 
 * - Namespaces 
 * - Other Concepts 
 * - or maybe Components
 * 
 * @param params 
 * @returns 
 */
export function A_Inject(
    scope: typeof A_Scope
): A_TYPES__A_InjectDecoratorReturn

export function A_Inject(
    component: typeof A_Component
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject(
    component: { new(...args: any[]): any }
): A_TYPES__A_InjectDecoratorReturn

//  Allows to inject just one container
export function A_Inject(
    container: typeof A_Container
): A_TYPES__A_InjectDecoratorReturn

// Allows to inject just one Context Fragment
export function A_Inject(
    fragment: typeof A_Fragment
): A_TYPES__A_InjectDecoratorReturn

// Allows to inject multiple Fragments 
export function A_Inject<
    T extends Array<typeof A_Fragment>
>(
    fragments: T
): A_TYPES__A_InjectDecoratorReturn

// ====================== BASE FUNCTION ======================
export function A_Inject<
    T extends Array<typeof A_Fragment>
>(
    param1: T | typeof A_Fragment | typeof A_Component | typeof A_Container | typeof A_Fragment,
): A_TYPES__A_InjectDecoratorReturn {
    return function (
        target: A_Component,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {

        const method = methodName ? methodName : 'constructor';


        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.INJECTIONS)
            || new Map();

        const paramsArray = existedMeta.get(method) || [];

        paramsArray[parameterIndex] = param1;

        existedMeta.set(method, paramsArray);


        A_Context
            .meta(target)
            .set(
                A_TYPES__ComponentMetaKey.INJECTIONS,
                existedMeta
            )
    }
}