import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import {
    A_TYPES__A_StageDecoratorConfig,
    A_TYPES__A_StageDecoratorDescriptor,
} from "./A-Stage.decorator.types";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.types";
import { A_TYPES__ConceptStage } from "@adaas/a-concept/global/A-Concept/A_Concept.types";




/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 * 
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.  
 * 
 * @param params 
 * @returns 
 */
export function A_Stage(
    method: A_TYPES__ConceptStage
) {


    return function A_Stage(
        config: Partial<A_TYPES__A_StageDecoratorConfig> = {}
    ) {
        return function (
            target: A_Container<any>,
            propertyKey: string,
            descriptor: A_TYPES__A_StageDecoratorDescriptor
        ) {

            // Get the existed metadata or create a new one
            const existedMeta = A_Context
                .meta(target)
                .get(A_TYPES__ContainerMetaKey.STAGES)
                || new Map();

            // Set the metadata of the method to define a custom Stage with name
            existedMeta
                .set(propertyKey, {
                    name: method,
                    handler: propertyKey,
                });

            //  Update the metadata of the container with the new Stage definition
            A_Context
                .meta(target)
                .set(A_TYPES__ContainerMetaKey.STAGES, existedMeta);

        };
    }
}
