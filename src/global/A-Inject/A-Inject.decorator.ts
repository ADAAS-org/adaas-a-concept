import {
    A_TYPES__A_InjectDecorator_EntityInjectionInstructions,
    A_TYPES__A_InjectDecorator_Meta,
    A_TYPES__A_InjectDecoratorReturn,
    A_TYPES__InjectableConstructors,
    A_TYPES__InjectableTargets
} from "./A-Inject.types";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_TYPES__Component_Constructor } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Feature_Constructor } from "@adaas/a-concept/global/A-Feature/A-Feature.types";
import { A_Caller } from "@adaas/a-concept/global/A-Caller/A_Caller.class";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.constants";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.constants";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_InjectError } from "./A-Inject.error";
import { A_TYPES__Entity_Constructor } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_TYPES__Fragment_Constructor } from "@adaas/a-concept/global/A-Fragment/A-Fragment.types";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_TYPES__Scope_Constructor } from "@adaas/a-concept/global/A-Scope/A-Scope.types";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";
import { A_TYPES__Error_Constructor } from "../A-Error/A_Error.types";
import { A_Error } from "../A-Error/A_Error.class";
import { A_TYPES__EntityMetaKey } from "../A-Entity/A-Entity.constants";


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
export function A_Inject<T extends A_Scope>(
    /***
     * Provide the Scope constructor that will be associated with the injection.
     *
     * [!] It returns an instance of the Scope where the Entity/Component/Container is defined.
     */
    scope: A_TYPES__Scope_Constructor<T>
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject<T extends A_Error>(
    /***
     * Provide the Error constructor that will be associated with the injection.
     *
     * [!] It returns an Instance of the Error what is executed.
     */
    error: A_TYPES__Error_Constructor<T>
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject<T extends A_Feature>(
    /**
     * Provide the Feature constructor that will be associated with the injection.
     * 
     * [!] It returns an Instance of the Feature what is executed. 
     */
    feature: A_TYPES__Feature_Constructor<T>
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject<T extends A_Component>(
    /**
     * Provide the Component constructor that will be associated with the injection.
     * 
     * [!] It returns an Instance of the Component from current Scope or from Parent Scopes.
     */
    component: A_TYPES__Component_Constructor<T>
): A_TYPES__A_InjectDecoratorReturn
//  Allows to inject just one A_FeatureCaller
export function A_Inject(
    /**
     * Provide the A_Caller constructor to inject the Caller instance
     *
     * [!] It returns initiator of the call, e.g. Container/Component/Command who called Feature 
     */
    caller: typeof A_Caller
): A_TYPES__A_InjectDecoratorReturn
// Allows to inject just one Context Fragment
export function A_Inject<T extends A_Fragment>(
    /**
     * Provide the Fragment constructor to inject the Fragment instance
     *
     * [!] It returns the Fragment instance from current Scope or from Parent Scopes.
     */
    fragment: A_TYPES__Fragment_Constructor<T>
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject<T extends A_Entity>(
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
    config?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>
): A_TYPES__A_InjectDecoratorReturn<T>
export function A_Inject<T extends A_Component>(
    /**
     * Provide the name of Component constructor to inject the Component instance
     * 
     * [!] You can use both customized one or original depending on your overriding strategy
     */
    ctor: string
): A_TYPES__A_InjectDecoratorReturn
export function A_Inject(
    param1: A_TYPES__InjectableConstructors,
    param2?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>
): A_TYPES__A_InjectDecoratorReturn {

    //  pre call checks
    if (!param1) {
        throw new A_InjectError(
            A_InjectError.MissingInjectionTarget,
            `A-Inject decorator is missing the target to inject`
        );
    }


    return function (
        target: A_TYPES__InjectableTargets,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {
        // for Error handling purposes
        const componentName = A_CommonHelper.getComponentName(target)

        if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
            throw new A_InjectError(
                A_InjectError.InvalidInjectionTarget,
                `A-Inject cannot be used on the target of type ${typeof target} (${componentName})`
            );
        }

        // determine the method name or 'constructor' for constructor injections
        const method = methodName ? String(methodName) : 'constructor';
        let metaKey;

        switch (true) {
            case A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target):
                metaKey = A_TYPES__ComponentMetaKey.INJECTIONS;
                break;

            case A_TypeGuards.isContainerInstance(target):
                metaKey = A_TYPES__ContainerMetaKey.INJECTIONS;
                break;

            case A_TypeGuards.isEntityInstance(target):
                metaKey = A_TYPES__EntityMetaKey.INJECTIONS;
                break;
        }

        // get existing meta or create a new one
        const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
        // get existing injections for the method or create a new array
        const paramsArray: A_TYPES__A_InjectDecorator_Meta = existedMeta.get(method) || [];

        // set the parameter injection info
        paramsArray[parameterIndex] = {
            target: param1,
            instructions: param2
        }
        // save back the updated injections array
        existedMeta.set(method, paramsArray);

        // save back the updated meta info
        A_Context
            .meta(target)
            .set(
                metaKey,
                existedMeta
            );
    }
}