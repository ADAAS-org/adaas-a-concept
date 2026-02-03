
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.constants";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.constants";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_TYPES__A_InjectDecorator_Meta, A_TYPES__InjectableTargets } from "../A-Inject/A-Inject.types";
import { A_TYPES__A_Dependency_AllDecoratorReturn } from "./A-Dependency.types";
import { A_DependencyError } from "./A-Dependency.error";
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_TYPES__EntityMetaKey } from "../A-Entity/A-Entity.constants";


/**
 * Should indicate which All is required
 */
export function A_Dependency_All(): A_TYPES__A_Dependency_AllDecoratorReturn {

    return function (
        target: A_TYPES__InjectableTargets,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {
        // for Error handling purposes
        const componentName = A_CommonHelper.getComponentName(target)

        if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
            throw new A_DependencyError(
                A_DependencyError.InvalidDependencyTarget,
                `A-All cannot be used on the target of type ${typeof target} (${componentName})`
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
        paramsArray[parameterIndex].resolutionStrategy = {
            pagination: {
                ...paramsArray[parameterIndex].resolutionStrategy.pagination,
                count: -1
            }
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