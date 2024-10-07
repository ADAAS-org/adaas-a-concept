export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Config: unique symbol;
export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootRun: unique symbol;
export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootLoad: unique symbol;
export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootBuild: unique symbol;
export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootPublish: unique symbol;
export declare const A_CONCEPT_STORAGE__MODULE_DECLARATION_Lifecycle_RootTest: unique symbol;
/**
 * Storage to keep the module declarations across all modules
 */
export declare const A_CONCEPT_ModulesDeclarationStorage: WeakMap<any, Map<string | Symbol, any>>;
/**
 * Storage to keep the lifecycle declarations across all modules
 */
export declare const A_CONCEPT_LifecycleDeclarationsStorage: Map<Symbol, any>;
/**
 * The simplest way to store the decorators
 * If any extra API is needed, it can be added here or replaced with a new class
 */
export declare const A_CONCEPT_Storage: WeakMap<object, any>;
