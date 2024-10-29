"use strict";
// --------------------------------------------------------------
// ----- A Concept -> Module Declaration -> Main Config ---------
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CONCEPT_Storage = exports.A_CONCEPT_LifecycleDeclarationsStorage = exports.A_CONCEPT_ModulesDeclarationStorage = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootTest = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootPublish = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootBuild = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun = exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Config = void 0;
// --------------------------------------------------------------
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Config = Symbol('a-concept-modules-declaration');
// -------------------------------------------------------------------------------
// ----- A Concept -> Module Declaration -> Concept Lifecycle Extension_ --------- 
// -------------------------------------------------------------------------------
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun = Symbol('a-concept-modules-declaration-lifecycle-root-run');
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad = Symbol('a-concept-modules-declaration-lifecycle-root-load');
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootBuild = Symbol('a-concept-modules-declaration-lifecycle-root-build');
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootPublish = Symbol('a-concept-modules-declaration-lifecycle-root-publish');
exports.A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootTest = Symbol('a-concept-modules-declaration-lifecycle-root-test');
/**
 * Storage to keep the module declarations across all modules
 */
exports.A_CONCEPT_ModulesDeclarationStorage = new WeakMap();
/**
 * Storage to keep the lifecycle declarations across all modules
 */
exports.A_CONCEPT_LifecycleDeclarationsStorage = new Map();
/**
 * The simplest way to store the decorators
 * If any extra API is needed, it can be added here or replaced with a new class
 */
exports.A_CONCEPT_Storage = new WeakMap();
//# sourceMappingURL=A_Concept.storage.js.map