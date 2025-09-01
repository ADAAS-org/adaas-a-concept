import {
    A_TYPES__A_InjectDecorator_EntityInjectionInstructions,
    A_TYPES__A_InjectDecoratorReturn
} from "./A-Inject.decorator.types";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_CommonHelper } from "@adaas/a-utils";



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
    feature: typeof A_Feature
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject(
    component: { new(...args: any[]): A_Component }
): A_TYPES__A_InjectDecoratorReturn
//  Allows to inject just one container
// export function A_Inject(
//     container: typeof A_Container
// ): A_TYPES__A_InjectDecoratorReturn
// Allows to inject just one Context Fragment
export function A_Inject(
    fragment: { new(...args: any[]): A_Fragment }
): A_TYPES__A_InjectDecoratorReturn

export function A_Inject(
    entity: { new(...args: any[]): A_Entity },
    config: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
): A_TYPES__A_InjectDecoratorReturn

// ====================== BASE FUNCTION ======================
export function A_Inject(
    param1: typeof A_Scope
        | typeof A_Feature
        | { new(...args: any[]): A_Component }
        | { new(...args: any[]): A_Fragment }
        | { new(...args: any[]): A_Entity },
    param2?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
): A_TYPES__A_InjectDecoratorReturn {
    return function (
        target: A_Component,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {

        const method = methodName ? String(methodName) : 'constructor';

        let metaKey;

        switch (true) {

            case target instanceof A_Component:
                metaKey = A_TYPES__ComponentMetaKey.INJECTIONS;
                break;

            case A_CommonHelper.isInheritedFrom(target, A_Component):
                metaKey = A_TYPES__ComponentMetaKey.INJECTIONS;
                break;

            case A_CommonHelper.isInheritedFrom(target, A_Container):
                metaKey = A_TYPES__ContainerMetaKey.INJECTIONS;
                break;

            case target instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.INJECTIONS;
                break;


            default:
                throw new Error(`A-Inject cannot be defined on the ${target} level`);
        }

        const existedMeta = A_Context
            .meta(target)
            .get(metaKey)
            || new A_Meta();


        const paramsArray = existedMeta.get(method) || [];

        paramsArray[parameterIndex] = {
            target: param1,
            instructions: param2
        }

        existedMeta.set(method, paramsArray);

        A_Context
            .meta(target)
            .set(
                metaKey,
                existedMeta
            );
    }
}