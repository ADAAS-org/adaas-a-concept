"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Load = A_Load;
const A_Concept_storage_1 = require("src/storage/A_Concept.storage");
const a_utils_1 = require("@adaas/a-utils");
const A_ConceptLifecycle_constants_1 = require("../../../constants/A_ConceptLifecycle.constants");
/**
 * A-Load decorator
 *
 * This Decorator allows to an extended flow of Concept loading.
 *
 * @param params
 * @returns
 */
function A_Load(config = {}) {
    return function (target, propertyKey, descriptor) {
        const targetProperty = A_Concept_storage_1.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad;
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
//# sourceMappingURL=A-Load.decorator.js.map