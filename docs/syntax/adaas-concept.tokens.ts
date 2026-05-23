/**
 * ADAAS Concept — Monaco Editor Token Definitions
 *
 * All token-type IDs and keyword lists used by the Monarch tokenizer and the
 * theme contribution.  Import this file in both `adaas-concept.monarch.ts` and
 * `adaas-concept.theme.ts` so that names stay in sync.
 */

// ─── Token-type identifiers ───────────────────────────────────────────────────

/** Base framework classes (A_Concept, A_Container, A_Component, …) */
export const TOKEN_CORE_CLASS = 'adaas.coreClass' as const;

/** Meta companion classes (A_ComponentMeta, A_ConceptMeta, …) */
export const TOKEN_META_CLASS = 'adaas.metaClass' as const;

/** Error classes (A_Error, A_FeatureError, …) */
export const TOKEN_ERROR_CLASS = 'adaas.errorClass' as const;

/** Static helper / type-guard classes (A_TypeGuards, A_CommonHelper, …) */
export const TOKEN_HELPER_CLASS = 'adaas.helperClass' as const;

/**
 * Standalone decorator identifiers used directly after @
 * e.g. @A_Inject, @A_MetaDecorator, @A_Feature_Define
 */
export const TOKEN_DECORATOR = 'adaas.decorator' as const;

/**
 * Namespace part of a compound decorator, e.g. A_Feature in @A_Feature.Define
 */
export const TOKEN_DECORATOR_NS = 'adaas.decoratorNamespace' as const;

/**
 * Method part of a compound decorator, e.g. Define in @A_Feature.Define
 */
export const TOKEN_DECORATOR_METHOD = 'adaas.decoratorMethod' as const;

/** A_TYPES__* type identifiers */
export const TOKEN_TYPE_IDENT = 'adaas.typeIdentifier' as const;

/** A_CONSTANTS__* constant identifiers */
export const TOKEN_CONSTANT = 'adaas.constant' as const;

// ─── Keyword sets ─────────────────────────────────────────────────────────────

/**
 * Core framework classes — the main building blocks of every ADAAS application.
 */
export const ADAAS_CORE_CLASSES: string[] = [
  'A_Concept',
  'A_Container',
  'A_Component',
  'A_Entity',
  'A_Fragment',
  'A_Feature',
  'A_Abstraction',
  'A_Stage',
  'A_StepsManager',
  'A_Scope',
  'A_Context',
  'A_Dependency',
  'A_Caller',
  'A_Meta',
  'ASEID',
];

/**
 * Meta companion classes — typed metadata stores paired with core classes.
 */
export const ADAAS_META_CLASSES: string[] = [
  'A_ComponentMeta',
  'A_ContainerMeta',
  'A_ConceptMeta',
  'A_EntityMeta',
];

/**
 * Error classes — all typed errors thrown by the framework.
 */
export const ADAAS_ERROR_CLASSES: string[] = [
  'A_Error',
  'A_AbstractionError',
  'A_ContextError',
  'A_DependencyError',
  'A_EntityError',
  'A_FeatureError',
  'A_InjectError',
  'A_ScopeError',
  'A_StageError',
  'A_StepManagerError',
  'A_CallerError',
];

/**
 * Helper / utility classes — static utility namespaces (no instantiation needed).
 */
export const ADAAS_HELPER_CLASSES: string[] = [
  'A_TypeGuards',
  'A_BasicTypeGuards',
  'A_CommonHelper',
  'A_FormatterHelper',
  'A_IdentityHelper',
];

/**
 * Standalone decorators — raw exported functions used directly after @.
 * Includes both the canonical name (A_Inject) and the lower-level variants
 * (A_Feature_Define, A_Feature_Extend, A_Dependency_All, …) for codebases that
 * import decorators individually rather than via the namespace accessor.
 */
export const ADAAS_RAW_DECORATORS: string[] = [
  // Injection
  'A_Inject',

  // Meta
  'A_MetaDecorator',

  // Feature (standalone variants)
  'A_Feature_Define',
  'A_Feature_Extend',

  // Abstraction (standalone variant)
  'A_Abstraction_Extend',

  // Dependency (standalone variants)
  'A_Dependency_All',
  'A_Dependency_Default',
  'A_Dependency_Flat',
  'A_Dependency_Load',
  'A_Dependency_Parent',
  'A_Dependency_Query',
  'A_Dependency_Require',
];

/**
 * Decorator namespace identifiers — the class name used before the dot in
 * compound decorators such as @A_Feature.Define or @A_Concept.Run.
 */
export const ADAAS_DECORATOR_NAMESPACES: string[] = [
  'A_Feature',
  'A_Abstraction',
  'A_Dependency',
  'A_Meta',
  'A_Concept',
];

/**
 * Decorator method names — the segment after the dot in compound decorators.
 *
 * A_Feature   : Define | Extend
 * A_Abstraction: Extend
 * A_Meta      : Define
 * A_Dependency: Required | Loaded | Default | Parent | Flat | All | Query
 * A_Concept   : Load | Publish | Deploy | Build | Run | Start | Stop
 */
export const ADAAS_DECORATOR_METHODS: string[] = [
  // A_Feature
  'Define',
  'Extend',
  // A_Dependency
  'Required',
  'Loaded',
  'Default',
  'Parent',
  'Flat',
  'All',
  'Query',
  // A_Concept lifecycle
  'Load',
  'Publish',
  'Deploy',
  'Build',
  'Run',
  'Start',
  'Stop',
];
