import { A_TYPES__A_LoadDecoratorConfig, A_TYPES__A_LoadDecoratorDescriptor, A_TYPES__A_LoadDecoratorStorageInstruction } from "./A-Load.decorator.types";
import { A_CONCEPT_ModulesDeclarationStorage, A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad } from "src/storage/A_Concept.storage";
import { A_CommonHelper } from "@adaas/a-utils";
import { A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG } from "@adaas/a-concept/constants/A_ConceptLifecycle.constants";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";




/**
 * A-Load decorator
 * 
 * This Decorator allows to an extended flow of Concept loading. 
 * 
 * @param params 
 * @returns 
 */
export function A_Load(
    config: Partial<A_TYPES__A_LoadDecoratorConfig> = {}
) {

    return function (
        target: A_Container,
        propertyKey: string,
        descriptor: A_TYPES__A_LoadDecoratorDescriptor
    ) {
        const targetProperty: Symbol = A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad;



        const existedMeta = A_CONCEPT_ModulesDeclarationStorage.get(target.constructor) || new Map();
        const inheritMeta = A_CONCEPT_ModulesDeclarationStorage.get(Object.getPrototypeOf(target.constructor)) || new Map();

        const inheritedInstructions = inheritMeta.get(targetProperty) || [];
        const instructions: Array<A_TYPES__A_LoadDecoratorStorageInstruction> = existedMeta.get(targetProperty) || [...inheritedInstructions];

        /**
         * That's is needed to remove the previous definition of the method from parent classes 
         * and override it with the new one 
         */
        const targetInstructions = instructions
            .filter(
                (instr: A_TYPES__A_LoadDecoratorStorageInstruction) => instr.handler !== propertyKey
            );

        targetInstructions.push({
            handler: propertyKey,
            config: A_CommonHelper.deepCloneAndMerge(config, A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG)
        });

        existedMeta.set(targetProperty, targetInstructions);

        A_CONCEPT_ModulesDeclarationStorage.set(target.constructor, existedMeta);
    };
}