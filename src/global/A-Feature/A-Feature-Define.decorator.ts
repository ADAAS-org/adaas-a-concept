import {
    A_TYPES__FeatureDefineDecoratorConfig,
    A_TYPES__FeatureDefineDecoratorDescriptor,
    A_TYPES__FeatureDefineDecoratorMeta,
    A_TYPES__FeatureDefineDecoratorTarget
} from "./A-Feature.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_EntityMeta } from "@adaas/a-concept/global/A-Entity/A-Entity.meta";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_TYPES__EntityMetaKey } from "@adaas/a-concept/global/A-Entity/A-Entity.constants";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.constants";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.constants";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";
import { A_FeatureError } from "./A-Feature.error";

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
    config: Partial<A_TYPES__FeatureDefineDecoratorConfig> = {}
) {
    return function (
        target: A_TYPES__FeatureDefineDecoratorTarget,
        propertyKey: string,
        descriptor: A_TYPES__FeatureDefineDecoratorDescriptor
    ) {
        // for error messages
        const componentName = (target as any)?.constructor?.name || String(target) || 'Unknown';


        if (!A_TypeGuards.isAllowedForFeatureDefinition(target))
            throw new A_FeatureError(
                A_FeatureError.FeatureDefinitionError,
                `A-Feature cannot be defined on the ${componentName} level`
            );

        const meta: A_EntityMeta | A_ContainerMeta | A_ComponentMeta = A_Context.meta(target.constructor as any);

        let metaKey;

        switch (true) {
            case A_TypeGuards.isEntityInstance(target):
                metaKey = A_TYPES__EntityMetaKey.FEATURES;
                break;
            case A_TypeGuards.isContainerInstance(target):
                metaKey = A_TYPES__ContainerMetaKey.FEATURES
                break;
            case A_TypeGuards.isComponentInstance(target):
                metaKey = A_TYPES__ComponentMetaKey.FEATURES
                break;
        }


        // Get the existed metadata or create a new one
        const existedMeta: A_Meta<{
            /**
             * Where Key is the name of the feature
             * 
             * Where value is the list of features
             */
            [Key: string]: A_TYPES__FeatureDefineDecoratorMeta
        }> = meta.get(metaKey) || new A_Meta();


        const name = config.name || propertyKey;
        //  default to false
        const invoke = config.invoke || false;


        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            name: `${target.constructor.name}.${name}`,
            handler: propertyKey,
            invoke: invoke,
            template: config.template && config.template.length ? config.template.map(
                item => ({
                    ...item,
                    before: item.before || [],
                    after: item.after || [],
                    behavior: item.behavior || 'sync',
                })
            ) : [],
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
            if (typeof (this as A_TYPES__FeatureDefineDecoratorTarget).call === "function" && invoke)
                return (this as A_TYPES__FeatureDefineDecoratorTarget).call(name);

        };

        return descriptor;
    };
}