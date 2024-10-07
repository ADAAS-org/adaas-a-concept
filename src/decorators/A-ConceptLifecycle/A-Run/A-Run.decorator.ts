import { A_TYPES__A_RunDecoratorConfig, A_TYPES__A_RunDecoratorDescriptor, A_TYPES__A_RunDecoratorStorageInstruction } from "./A-Run.decorator.types";
import { A_CONCEPT_ModulesDeclarationStorage, A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun } from "src/storage/A_Concept.storage";
import { A_CommonHelper } from "@adaas/a-utils";
import { A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG } from "@adaas/a-concept/constants/A_ConceptLifecycle.constants";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";





/**
 * A-Run decorator
 * 
 * This decorator is used to define a method that will be executed during the lifecycle of the module.
 * Depending on the definition and configurations 
 * it will be executed during the run command 
 * modifying and adjusting the whole [root.run] pipeline.
 * 
 * This decorator can be used in case of the need to define a custom logic that will be executed during the run command.
 * 
 * 
 * @param params 
 * @returns 
 */
export function A_Run(
    config: Partial<A_TYPES__A_RunDecoratorConfig> = {}
) {

    return function (
        target: A_Container,
        propertyKey: string,
        descriptor: A_TYPES__A_RunDecoratorDescriptor
    ) {
        const targetProperty: Symbol = A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun;



        const existedMeta = A_CONCEPT_ModulesDeclarationStorage.get(target.constructor) || new Map();
        const inheritMeta = A_CONCEPT_ModulesDeclarationStorage.get(Object.getPrototypeOf(target.constructor)) || new Map();

        const inheritedInstructions = inheritMeta.get(targetProperty) || [];
        const instructions: Array<A_TYPES__A_RunDecoratorStorageInstruction> = existedMeta.get(targetProperty) || [...inheritedInstructions];

        /**
         * That's is needed to remove the previous definition of the method from parent classes 
         * and override it with the new one 
         */
        const targetInstructions = instructions
            .filter(
                (instr: A_TYPES__A_RunDecoratorStorageInstruction) => instr.handler !== propertyKey
            );

        targetInstructions.push({
            handler: propertyKey,
            config: A_CommonHelper.deepCloneAndMerge(config, A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG)
        });

        existedMeta.set(targetProperty, targetInstructions);

        A_CONCEPT_ModulesDeclarationStorage.set(target.constructor, existedMeta);
    };
}