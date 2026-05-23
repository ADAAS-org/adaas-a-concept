/**
 * Minimal structural interfaces that mirror the Monaco Editor public API
 * surface used by the ADAAS syntax files.
 *
 * These are intentionally kept narrow — only the members actually used here
 * are declared.  Because TypeScript uses structural typing, a real
 * `monaco-editor` instance satisfies every interface below, so callers can
 * pass the real Monaco namespace without any cast or adapter.
 *
 * Keeping these local means the library has NO compile-time or runtime
 * dependency on `monaco-editor`.
 */
interface IAdaas_MonacoTokenThemeRule {
    token: string;
    foreground?: string;
    background?: string;
    fontStyle?: string;
}
interface IAdaas_MonacoStandaloneThemeData {
    base: 'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
    inherit: boolean;
    rules: IAdaas_MonacoTokenThemeRule[];
    colors: Record<string, string>;
    encodedTokensColors?: string[];
}
interface IAdaas_MonarchLanguage {
    tokenizer: {
        [stateName: string]: IAdaas_MonarchRule[];
    };
    [key: string]: unknown;
}
type IAdaas_MonarchRule = [RegExp | string, string | object] | [RegExp | string, string | object, string] | {
    include: string;
};
interface IAdaas_MonacoLanguageConfiguration {
    wordPattern?: RegExp;
    comments?: {
        lineComment?: string;
        blockComment?: [string, string];
    };
    brackets?: [string, string][];
    autoClosingPairs?: Array<{
        open: string;
        close: string;
        notIn?: string[];
    }>;
    surroundingPairs?: Array<{
        open: string;
        close: string;
    }>;
    folding?: {
        markers?: {
            start: RegExp;
            end: RegExp;
        };
    };
    indentationRules?: {
        increaseIndentPattern: RegExp;
        decreaseIndentPattern: RegExp;
    };
}
interface IAdaas_MonacoInstance {
    languages: {
        register(language: {
            id: string;
            extensions?: string[];
            aliases?: string[];
            mimetypes?: string[];
        }): void;
        setMonarchTokensProvider(languageId: string, languageDef: IAdaas_MonarchLanguage): unknown;
        setLanguageConfiguration(languageId: string, configuration: IAdaas_MonacoLanguageConfiguration): unknown;
    };
    editor: {
        defineTheme(themeName: string, themeData: IAdaas_MonacoStandaloneThemeData): void;
    };
}

/**
 * ADAAS Concept — Monaco Editor Token Definitions
 *
 * All token-type IDs and keyword lists used by the Monarch tokenizer and the
 * theme contribution.  Import this file in both `adaas-concept.monarch.ts` and
 * `adaas-concept.theme.ts` so that names stay in sync.
 */
/** Base framework classes (A_Concept, A_Container, A_Component, …) */
declare const TOKEN_CORE_CLASS: "adaas.coreClass";
/** Meta companion classes (A_ComponentMeta, A_ConceptMeta, …) */
declare const TOKEN_META_CLASS: "adaas.metaClass";
/** Error classes (A_Error, A_FeatureError, …) */
declare const TOKEN_ERROR_CLASS: "adaas.errorClass";
/** Static helper / type-guard classes (A_TypeGuards, A_CommonHelper, …) */
declare const TOKEN_HELPER_CLASS: "adaas.helperClass";
/**
 * Standalone decorator identifiers used directly after @
 * e.g. @A_Inject, @A_MetaDecorator, @A_Feature_Define
 */
declare const TOKEN_DECORATOR: "adaas.decorator";
/**
 * Namespace part of a compound decorator, e.g. A_Feature in @A_Feature.Define
 */
declare const TOKEN_DECORATOR_NS: "adaas.decoratorNamespace";
/**
 * Method part of a compound decorator, e.g. Define in @A_Feature.Define
 */
declare const TOKEN_DECORATOR_METHOD: "adaas.decoratorMethod";
/** A_TYPES__* type identifiers */
declare const TOKEN_TYPE_IDENT: "adaas.typeIdentifier";
/** A_CONSTANTS__* constant identifiers */
declare const TOKEN_CONSTANT: "adaas.constant";
/**
 * Core framework classes — the main building blocks of every ADAAS application.
 */
declare const ADAAS_CORE_CLASSES: string[];
/**
 * Meta companion classes — typed metadata stores paired with core classes.
 */
declare const ADAAS_META_CLASSES: string[];
/**
 * Error classes — all typed errors thrown by the framework.
 */
declare const ADAAS_ERROR_CLASSES: string[];
/**
 * Helper / utility classes — static utility namespaces (no instantiation needed).
 */
declare const ADAAS_HELPER_CLASSES: string[];
/**
 * Standalone decorators — raw exported functions used directly after @.
 * Includes both the canonical name (A_Inject) and the lower-level variants
 * (A_Feature_Define, A_Feature_Extend, A_Dependency_All, …) for codebases that
 * import decorators individually rather than via the namespace accessor.
 */
declare const ADAAS_RAW_DECORATORS: string[];
/**
 * Decorator namespace identifiers — the class name used before the dot in
 * compound decorators such as @A_Feature.Define or @A_Concept.Run.
 */
declare const ADAAS_DECORATOR_NAMESPACES: string[];
/**
 * Decorator method names — the segment after the dot in compound decorators.
 *
 * A_Feature   : Define | Extend
 * A_Abstraction: Extend
 * A_Meta      : Define
 * A_Dependency: Required | Loaded | Default | Parent | Flat | All | Query
 * A_Concept   : Load | Publish | Deploy | Build | Run | Start | Stop
 */
declare const ADAAS_DECORATOR_METHODS: string[];

/**
 * ADAAS Concept — Monaco Editor Monarch Tokenizer
 *
 * Provides syntax highlighting for the ADAAS Concept framework, built on top
 * of TypeScript/JavaScript.  The tokenizer:
 *
 *  1. Applies full TypeScript tokenization rules (keywords, strings, comments,
 *     template literals, JSX, generics, …).
 *  2. Adds ADAAS-specific token types for core classes, meta classes, error
 *     classes, helper classes, decorator namespaces, decorator methods, and
 *     A_TYPES__ / A_CONSTANTS__ identifiers.
 *
 * ## Usage
 *
 * ```ts
 * import * as monaco from 'monaco-editor';
 * import { ADAAS_CONCEPT_LANGUAGE_ID, adaasConceptMonarch } from './adaas-concept.monarch';
 *
 * monaco.languages.register({ id: ADAAS_CONCEPT_LANGUAGE_ID });
 * monaco.languages.setMonarchTokensProvider(ADAAS_CONCEPT_LANGUAGE_ID, adaasConceptMonarch);
 * ```
 *
 * Then open a model with `language: ADAAS_CONCEPT_LANGUAGE_ID`.
 *
 * See `adaas-concept.register.ts` for the full registration helper.
 */

declare const ADAAS_CONCEPT_LANGUAGE_ID: "adaas-ts";
declare const adaasConceptMonarch: IAdaas_MonarchLanguage;

/**
 * ADAAS Concept — Monaco Editor Theme Contribution
 *
 * Defines foreground colours for every ADAAS-specific token type so that the
 * custom tokens stand out clearly from regular TypeScript code.
 *
 * The palette is designed to complement both the default Monaco dark theme
 * (`vs-dark`) and the light theme (`vs`).  Two exported theme definitions are
 * provided; register the one that matches your editor background.
 *
 * ## Usage
 *
 * ```ts
 * import * as monaco from 'monaco-editor';
 * import { adaasConceptDarkTheme, adaasConceptLightTheme } from './adaas-concept.theme';
 *
 * monaco.editor.defineTheme('adaas-dark',  adaasConceptDarkTheme);
 * monaco.editor.defineTheme('adaas-light', adaasConceptLightTheme);
 *
 * // Then use it:
 * monaco.editor.create(container, { theme: 'adaas-dark', language: 'adaas-ts' });
 * ```
 */

/**
 * Dark theme that extends Monaco's built-in `vs-dark` theme with ADAAS tokens.
 */
declare const adaasConceptDarkTheme: IAdaas_MonacoStandaloneThemeData;
/**
 * Light theme that extends Monaco's built-in `vs` theme with ADAAS tokens.
 */
declare const adaasConceptLightTheme: IAdaas_MonacoStandaloneThemeData;

/**
 * ADAAS Concept — Monaco Editor Registration Helper
 *
 * One-call helper that:
 *  1. Registers the `adaas-ts` language.
 *  2. Sets the Monarch tokenizer on that language.
 *  3. Defines both the dark and light ADAAS themes.
 *  4. Sets up language configuration (brackets, auto-closing, comments, …)
 *     so that the editor behaves like TypeScript.
 *
 * ## Minimal usage
 *
 * ```ts
 * import * as monaco from 'monaco-editor';
 * import { registerAdaasConceptLanguage } from './adaas-concept.register';
 *
 * registerAdaasConceptLanguage(monaco);
 *
 * const editor = monaco.editor.create(document.getElementById('container')!, {
 *   value: `import { A_Component } from '@adaas/a-concept';\n\nexport class MyService extends A_Component {}`,
 *   language: 'adaas-ts',
 *   theme:    'adaas-dark',
 * });
 * ```
 *
 * ## Choosing a theme
 *
 * | `theme` value   | Description                                      |
 * |-----------------|--------------------------------------------------|
 * | `'adaas-dark'`  | VS Dark base + ADAAS token colours               |
 * | `'adaas-light'` | VS (light) base + ADAAS token colours            |
 * | `'vs-dark'`     | Plain Monaco dark (ADAAS tokens still tokenized  |
 * |                 | but coloured via Monaco defaults)                |
 */

/**
 * Registers the ADAAS Concept language and themes with Monaco.
 *
 * Call this once before creating any Monaco editor that should use the
 * `adaas-ts` language.
 *
 * @param monaco  The `monaco-editor` namespace import.
 */
declare function registerAdaasConceptLanguage(monaco: IAdaas_MonacoInstance): void;

export { ADAAS_CONCEPT_LANGUAGE_ID, ADAAS_CORE_CLASSES, ADAAS_DECORATOR_METHODS, ADAAS_DECORATOR_NAMESPACES, ADAAS_ERROR_CLASSES, ADAAS_HELPER_CLASSES, ADAAS_META_CLASSES, ADAAS_RAW_DECORATORS, type IAdaas_MonacoInstance, type IAdaas_MonacoLanguageConfiguration, type IAdaas_MonacoStandaloneThemeData, type IAdaas_MonacoTokenThemeRule, type IAdaas_MonarchLanguage, type IAdaas_MonarchRule, TOKEN_CONSTANT, TOKEN_CORE_CLASS, TOKEN_DECORATOR, TOKEN_DECORATOR_METHOD, TOKEN_DECORATOR_NS, TOKEN_ERROR_CLASS, TOKEN_HELPER_CLASS, TOKEN_META_CLASS, TOKEN_TYPE_IDENT, adaasConceptDarkTheme, adaasConceptLightTheme, adaasConceptMonarch, registerAdaasConceptLanguage };
