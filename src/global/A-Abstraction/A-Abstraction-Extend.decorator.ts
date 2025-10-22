import {
    A_TYPES__AbstractionDecoratorConfig,
    A_TYPES__AbstractionDecoratorDescriptor
} from "./A-Abstraction.types";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_ContainerMeta } from "@adaas/a-concept/global/A-Container/A-Container.meta";
import { A_ComponentMeta } from "@adaas/a-concept/global/A-Component/A-Component.meta";
import { A_Meta } from "@adaas/a-concept/global/A-Meta/A-Meta.class";
import { A_TYPES__ConceptAbstractions } from "@adaas/a-concept/global/A-Concept/A-Concept.constants";
import { A_TYPES__ContainerMetaKey } from "@adaas/a-concept/global/A-Container/A-Container.constants";
import { A_TYPES__ComponentMetaKey } from "@adaas/a-concept/global/A-Component/A-Component.constants";
import { A_TYPES__ConceptAbstraction } from "@adaas/a-concept/global/A-Concept/A-Concept.types";
import { A_AbstractionError } from "./A-Abstraction.error";
import { A_TypeGuards } from "@adaas/a-concept/helpers/A_TypeGuards.helper";


/**
 * A-Abstraction Extend decorator allows to extends behavior of each concept abstraction execution. 
 * In case some components or containers requires to extend the behavior of the abstraction like 'start', 'build' or 'deploy'
 * for example, this decorator allows to do so.    
 * 
 * @param name - abstraction name 
 * @param config - configuration of the abstraction extension
 * @returns 
 */
export function A_Abstraction_Extend(
    /**
     * Name of the Concept Abstraction to extend
     */
    name: A_TYPES__ConceptAbstractions,
    /**
     * Configuration of the Abstraction Extension
     * 
     */
    config: Partial<A_TYPES__AbstractionDecoratorConfig> = {}
) {
    return function (
        target: A_Container | A_Component,
        propertyKey: string,
        descriptor: A_TYPES__AbstractionDecoratorDescriptor
    ) {
        // for error messages
        const componentName = (target as any)?.constructor?.name || String(target) || 'UnknownComponent';

        if (!name)
            throw new A_AbstractionError(
                A_AbstractionError.AbstractionExtensionError,
                `Abstraction name must be provided to extend abstraction for '${componentName}'.`,
            );

        //  Only Containers and Components can extend Concept Abstractions
        if (!A_TypeGuards.isConstructorAvailableForAbstraction(target)) {
            throw new A_AbstractionError(
                A_AbstractionError.AbstractionExtensionError,
                `Unable to extend Abstraction '${name}' for '${componentName}'. Only A-Containers and A-Components can extend Abstractions.`,
            );
        }

        let metaKey;
        const meta: A_ContainerMeta | A_ComponentMeta = A_Context.meta(target);

        switch (true) {
            case A_TypeGuards.isContainerConstructor(target) || A_TypeGuards.isContainerInstance(target):
                metaKey = A_TYPES__ContainerMetaKey.ABSTRACTIONS
                break;
            case A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target):
                metaKey = A_TYPES__ComponentMetaKey.ABSTRACTIONS
                break;
        }

        // Get the existed metadata or create a new one
        const existedMeta: A_Meta<{
            [Key: string]: A_TYPES__ConceptAbstraction[];
        }> = meta.get(metaKey) || new A_Meta();

        // Set the metadata of the method to define a custom Stage with name
        const existedMetaValue = existedMeta.get(name) || [];

        const setName = `CONCEPT_ABSTRACTION::${name}`;

        // Add the new method to the metadata
        existedMetaValue.push({
            name: setName,
            handler: propertyKey,
            before: config.before || [],
            after: config.after || [],
            behavior: config.behavior || 'sync'
        });

        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(setName, existedMetaValue);


        //  Update the metadata of the container with the new Stage definition
        A_Context
            .meta(target)
            .set(
                metaKey,
                existedMeta
            );
    };
}
