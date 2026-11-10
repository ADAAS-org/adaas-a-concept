import { A_Context } from "@adaas/a-concept/a-context";
import { A_Meta } from "@adaas/a-concept/a-meta";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/a-component";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/a-container";
import { A_TYPES__A_Dependency_LoadDecoratorReturn } from "./A-Dependency.types";
import { A_DependencyError } from "./A-Dependency.error";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/a-entity";
import {
    A_TYPES__A_InjectDecorator_Meta,
    A_TYPES__InjectableTargets
} from "@adaas/a-concept/a-inject";
import { A_TypeGuards} from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_CommonHelper} from "@adaas/a-concept/helpers/A_Common.helper";


/**
 * Marks an injected parameter as loadable. If the dependency is not in the scope
 * when a feature step runs, the scope's A_DependencyLoader loads it first
 * (see A_Scope.load). `source` is passed to the loader as-is (package specifier, URL, …).
 */
export function A_Dependency_Load(
    source?: string
): A_TYPES__A_Dependency_LoadDecoratorReturn {

    if (source !== undefined && (typeof source !== 'string' || !source)) {
        throw new A_DependencyError(
            A_DependencyError.InvalidLoadPath,
            `A-Load decorator requires a non-empty source string when a source is provided`
        );
    }

    return function (
        target: A_TYPES__InjectableTargets,
        methodName: string | symbol | undefined,
        parameterIndex: number
    ) {
        // for Error handling purposes
        const componentName = A_CommonHelper.getComponentName(target);

        if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
            throw new A_DependencyError(
                A_DependencyError.InvalidLoadTarget,
                `A-Load cannot be used on the target of type ${typeof target} (${componentName})`
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

        // get existing meta or create a new one (always clone to avoid mutating shared inherited meta)
        const inheritedMeta = A_Context.meta(target).get(metaKey);
        const existedMeta = inheritedMeta ? inheritedMeta.clone() : new A_Meta();
        // get existing injections for the method or create a new array (clone to avoid mutating shared array)
        const paramsArray: A_TYPES__A_InjectDecorator_Meta = existedMeta.get(method) ? [...existedMeta.get(method)!] : [];

        // set the parameter injection info
        paramsArray[parameterIndex].resolutionStrategy = {
            load: true,
            source,
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