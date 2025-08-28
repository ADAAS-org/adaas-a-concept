import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_AbstractionDecoratorDescriptor,
} from "./A-Abstraction.decorator.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_TYPES__ConceptAbstraction, A_TYPES__ConceptStage } from "@adaas/a-concept/global/A-Concept/A_Concept.types";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_TYPES__A_ExtendDecoratorConfig } from "../A-Feature/A-Feature.decorator.types";


/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 * 
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.  
 * 
 * @param params 
 * @returns 
 */
export function A_Abstraction(
    method: A_TYPES__ConceptStage,
    config: Partial<A_TYPES__A_ExtendDecoratorConfig> = {}
) {
    return function (
        target: A_Container<any> | A_Component,
        propertyKey: string,
        descriptor: A_TYPES__A_AbstractionDecoratorDescriptor
    ) {

        const meta: A_ContainerMeta | A_ComponentMeta = A_Context.meta(target as any);

        let metaKey;

        const abstractionKey = `CONCEPT_ABSTRACTION::${method}`;

        switch (true) {
            case target instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.ABSTRACTIONS
                break;
            case target instanceof A_Component:
                metaKey = A_TYPES__ComponentMetaKey.ABSTRACTIONS
                break;
            default:
                throw new Error(`Concept Stage cannot be defined on the ${target} level`);
        }

        // Get the existed metadata or create a new one
        const existedMeta: A_Meta<{
            [Key: string]: A_TYPES__ConceptAbstraction[];
        }> = meta.get(metaKey) || new A_Meta();

        // Set the metadata of the method to define a custom Stage with name
        const existedMetaValue = existedMeta.get(abstractionKey) || [];


        // Add the new method to the metadata
        existedMetaValue.push({
            name: method,
            handler: propertyKey,
            before: config.before || [],
            after: config.after || [],
            behavior: config.behavior || 'sync'
        });

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(abstractionKey, existedMetaValue);


        //  Update the metadata of the container with the new Stage definition
        A_Context
            .meta(target as any)
            .set(
                metaKey,
                existedMeta
            );

    };
}
