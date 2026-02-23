
import { A_Context } from "@adaas/a-concept/a-context";
import { A_Meta } from "@adaas/a-concept/a-meta";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/a-component";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/a-container";
import { A_TYPES__A_Dependency_EntityInjectionPagination, A_TYPES__A_Dependency_EntityInjectionQuery, A_TYPES__A_Dependency_EntityResolutionConfig, A_TYPES__A_Dependency_QueryDecoratorReturn } from "./A-Dependency.types";
import { A_DependencyError } from "./A-Dependency.error";
import type { A_Entity } from "@adaas/a-concept/a-entity";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/a-entity";
import {
    A_TYPES__A_InjectDecorator_Meta,
    A_TYPES__InjectableTargets
} from "@adaas/a-concept/a-inject";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_CommonHelper } from "@adaas/a-concept/helpers/A_Common.helper";

/**
 * Query Decorator is only applicable for Entities since Scope instance may have multiple entities but only one component or container, so there is no need for such complex resolution strategies for them, but for entities it is a common case to have multiple instances and need to specify which one(s) to inject.
 * 
 * 
 * @param query 
 * @returns 
 */
export function A_Dependency_Query<T extends A_Entity = A_Entity>(
    query: Partial<A_TYPES__A_Dependency_EntityInjectionQuery<T>>,
    pagination?: Partial<A_TYPES__A_Dependency_EntityInjectionPagination>
): A_TYPES__A_Dependency_QueryDecoratorReturn {

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
            query: {
                ...paramsArray[parameterIndex].resolutionStrategy.query,
                ...query
            },
            pagination: {
                ...paramsArray[parameterIndex].resolutionStrategy.pagination,
                ...pagination
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