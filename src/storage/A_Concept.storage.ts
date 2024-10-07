

// --------------------------------------------------------------
// ----- A Concept -> Module Declaration -> Main Config ---------
// --------------------------------------------------------------
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Config = Symbol('a-concept-modules-declaration');



// -------------------------------------------------------------------------------
// ----- A Concept -> Module Declaration -> Concept Lifecycle Extension_ --------- 
// -------------------------------------------------------------------------------
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun = Symbol('a-concept-modules-declaration-lifecycle-root-run');
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad = Symbol('a-concept-modules-declaration-lifecycle-root-load');
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootBuild = Symbol('a-concept-modules-declaration-lifecycle-root-build');
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootPublish = Symbol('a-concept-modules-declaration-lifecycle-root-publish');
export const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootTest = Symbol('a-concept-modules-declaration-lifecycle-root-test');




/**
 * Storage to keep the module declarations across all modules
 */
export const A_CONCEPT_ModulesDeclarationStorage: WeakMap<
    any,
    Map<string | Symbol, any>
> = new WeakMap();



/**
 * Storage to keep the lifecycle declarations across all modules
 */
export const A_CONCEPT_LifecycleDeclarationsStorage: Map<Symbol, any> = new Map();





/**
 * The simplest way to store the decorators
 * If any extra API is needed, it can be added here or replaced with a new class
 */
export const A_CONCEPT_Storage = new WeakMap();