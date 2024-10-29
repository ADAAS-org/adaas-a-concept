import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_ExtendDecoratorConfig,
    A_TYPES__A_ExtendDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";




/**
 * A-Extend decorator
 * 
 * This decorator allows to define a custom Extend stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 * 
 * The main difference between the A-Extend and A-Extend decorators is that A-Extend methods can be inherited and overridden by child classes.
 * 
 * 
 * @param params 
 * @returns 
 */
export function A_Feature_Extend(
    config: Partial<A_TYPES__A_ExtendDecoratorConfig> = {}
) {
    return function (
        target: A_Component,
        propertyKey: string,
        descriptor: A_TYPES__A_ExtendDecoratorDescriptor
    ) {

        // Get the existed metadata or create a new one
        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new Map();

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(propertyKey, {
            name: config.name || propertyKey,
            handler: propertyKey,
            container: config.container
                ? typeof config.container === 'string'
                    ? config.container
                    : config.container.name
                : '*',
        });

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);

    };
}