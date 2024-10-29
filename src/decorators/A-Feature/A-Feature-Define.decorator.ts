import {
    A_TYPES__A_FeatureDecoratorConfig,
    A_TYPES__A_FeatureDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";


/**
 * A-Feature decorator
 * 
 * This decorator allows to define a custom lifecycle stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 * 
 * The main difference between the A-Feature and A-Feature decorators is that A-Feature methods can be inherited and overridden by child classes.
 * 
 * 
 * @param params 
 * @returns 
 */
export function A_Feature_Define(
    config: Partial<A_TYPES__A_FeatureDecoratorConfig> = {}
) {
    return function (
        target: A_Container<any>,
        propertyKey: string,
        descriptor: A_TYPES__A_FeatureDecoratorDescriptor
    ) {

        // Get the existed metadata or create a new one
        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ContainerMetaKey.FEATURES)
            || new Map();



        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            handler: propertyKey,
            config: {
                ...config,
                name: `${target.constructor.name}.${propertyKey || config.name}`,
            }
        });

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(
                A_TYPES__ContainerMetaKey.FEATURES,
                existedMeta
            );
    };
}