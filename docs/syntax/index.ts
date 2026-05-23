/**
 * ADAAS Concept — Monaco Editor Syntax
 *
 * Entry point for the `@adaas/a-concept/docs` sub-path export.
 * Only available in Node environments (bundled in the node build).
 *
 * Usage:
 *   import { registerAdaasConceptLanguage } from '@adaas/a-concept/docs';
 *   import { adaasConceptDarkTheme }         from '@adaas/a-concept/docs';
 *   import { ADAAS_CONCEPT_LANGUAGE_ID }     from '@adaas/a-concept/docs';
 */

export * from './adaas-concept.monaco-types';
export * from './adaas-concept.tokens';
export * from './adaas-concept.monarch';
export * from './adaas-concept.theme';
export * from './adaas-concept.register';
