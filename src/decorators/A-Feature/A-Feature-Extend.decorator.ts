import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_ExtendDecoratorConfig,
    A_TYPES__A_ExtendDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";




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

        const extensionName = config.name || propertyKey

        // Get the existed metadata or create a new one
        const existedMeta = A_Context
            .meta(target)
            .get(A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new A_Meta();


        const existedMetaValue = existedMeta.get(extensionName) || [];

        // Add the new method to the metadata
        existedMetaValue.push({
            name: extensionName,
            handler: propertyKey,
        });

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(extensionName, existedMetaValue);

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target)
            .set(A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}