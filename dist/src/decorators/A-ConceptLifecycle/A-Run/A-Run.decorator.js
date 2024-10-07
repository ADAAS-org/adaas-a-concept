"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Run = A_Run;
const A_Concept_storage_1 = require("src/storage/A_Concept.storage");
const a_utils_1 = require("@adaas/a-utils");
const A_ConceptLifecycle_constants_1 = require("../../../constants/A_ConceptLifecycle.constants");
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
function A_Run(config = {}) {
    return function (target, propertyKey, descriptor) {
        const targetProperty = A_Concept_storage_1.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun;
        const existedMeta = A_Concept_storage_1.A_CONCEPT_ModulesDeclarationStorage.get(target.constructor) || new Map();
        const inheritMeta = A_Concept_storage_1.A_CONCEPT_ModulesDeclarationStorage.get(Object.getPrototypeOf(target.constructor)) || new Map();
        const inheritedInstructions = inheritMeta.get(targetProperty) || [];
        const instructions = existedMeta.get(targetProperty) || [...inheritedInstructions];
        /**
         * That's is needed to remove the previous definition of the method from parent classes
         * and override it with the new one
         */
        const targetInstructions = instructions
            .filter((instr) => instr.handler !== propertyKey);
        targetInstructions.push({
            handler: propertyKey,
            config: a_utils_1.A_CommonHelper.deepCloneAndMerge(config, A_ConceptLifecycle_constants_1.A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG)
        });
        existedMeta.set(targetProperty, targetInstructions);
        A_Concept_storage_1.A_CONCEPT_ModulesDeclarationStorage.set(target.constructor, existedMeta);
    };
}
//# sourceMappingURL=A-Run.decorator.js.map