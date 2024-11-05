import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_FeatureDecoratorConfig,
    A_TYPES__A_FeatureDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Entity } from "@adaas/a-utils";
import { A_EntityMeta } from "@adaas/a-concept/global/A-Entity/A-Entity.meta";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";


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
        target: A_Container<any> | A_Entity | A_Component,
        propertyKey: string,
        descriptor: A_TYPES__A_FeatureDecoratorDescriptor
    ) {

        const meta: A_EntityMeta | A_ContainerMeta | A_ComponentMeta = A_Context.meta(target as any);

        let metaKey;


        switch (true) {
            case target instanceof A_Entity:
                metaKey = A_TYPES__EntityMetaKey.FEATURES;
                break;
            case target instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.FEATURES
                break;
            case target instanceof A_Component:
                metaKey = A_TYPES__ComponentMetaKey.FEATURES
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${target} level`);
        }


        // Get the existed metadata or create a new one
        const existedMeta = meta.get(metaKey)
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
            .meta(target as any)
            .set(
                metaKey,
                existedMeta
            );
    };
}