import {
    A_TYPES__A_DefineDecorator_Meta,
    A_TYPES__A_FeatureDecoratorConfig,
    A_TYPES__A_FeatureDecoratorDescriptor,
} from "./A-Feature.decorator.types";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_EntityMeta } from "@adaas/a-concept/global/A-Entity/A-Entity.meta";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";

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
        target: A_Container | A_Entity | A_Component,
        propertyKey: string,
        descriptor: A_TYPES__A_FeatureDecoratorDescriptor
    ) {

        const meta: A_EntityMeta | A_ContainerMeta | A_ComponentMeta = A_Context.meta(target.constructor as any);

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
        const existedMeta: A_Meta<{
            /**
             * Where Key is the name of the feature
             * 
             * Where value is the list of features
             */
            [Key: string]: A_TYPES__A_DefineDecorator_Meta
        }> = meta.get(metaKey) || new A_Meta();



        const handlerName = config.name || propertyKey;
        const invoke = config.invoke !== false;


        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            name: `${target.constructor.name}.${handlerName}`,
            handler: handlerName,
            template: config.template && config.template.length ? config.template.map(
                item => ({
                    ...item,
                    before: item.before || [],
                    after: item.after || [],
                    behavior: item.behavior || 'sync',
                })
            ) : [],
            channel: config.channel || []
        });

        //  Update the metadata of the container with the new Feature definition
        A_Context
            .meta(target.constructor as any)
            .set(
                metaKey,
                existedMeta
            );


        const originalMethod = descriptor.value!;



        // Wrap the original method to add the call to `call`
        // this helps to automatically call the container/entity/component method when it's called
        descriptor.value = function (...args: any[]) {

            // Call the original method
            if (!invoke)
                return originalMethod.apply(this, args);
            else
                originalMethod.apply(this, args);

            // Call your `call` with the function name
            if (typeof (this as any).call === "function" && invoke)
                return (this as any).call(propertyKey);

        };

        return descriptor;
    };
}