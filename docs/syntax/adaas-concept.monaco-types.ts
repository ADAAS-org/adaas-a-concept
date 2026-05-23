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

// ─── Token / theme ────────────────────────────────────────────────────────────

export interface IAdaas_MonacoTokenThemeRule {
  token:        string;
  foreground?:  string;
  background?:  string;
  fontStyle?:   string;
}

export interface IAdaas_MonacoStandaloneThemeData {
  base:        'vs' | 'vs-dark' | 'hc-black' | 'hc-light';
  inherit:     boolean;
  rules:       IAdaas_MonacoTokenThemeRule[];
  colors:      Record<string, string>;
  encodedTokensColors?: string[];
}

// ─── Monarch tokenizer ────────────────────────────────────────────────────────

export interface IAdaas_MonarchLanguage {
  tokenizer: {
    [stateName: string]: IAdaas_MonarchRule[];
  };
  // Top-level keyword / operator lookup tables and regex helpers
  [key: string]: unknown;
}

// A Monarch rule is either a tuple-array or an include shorthand
export type IAdaas_MonarchRule =
  | [RegExp | string, string | object]
  | [RegExp | string, string | object, string]
  | { include: string };

// ─── Language configuration ───────────────────────────────────────────────────

export interface IAdaas_MonacoLanguageConfiguration {
  wordPattern?:      RegExp;
  comments?: {
    lineComment?:  string;
    blockComment?: [string, string];
  };
  brackets?:         [string, string][];
  autoClosingPairs?: Array<{
    open:   string;
    close:  string;
    notIn?: string[];
  }>;
  surroundingPairs?: Array<{
    open:  string;
    close: string;
  }>;
  folding?: {
    markers?: {
      start: RegExp;
      end:   RegExp;
    };
  };
  indentationRules?: {
    increaseIndentPattern: RegExp;
    decreaseIndentPattern: RegExp;
  };
}

// ─── Monaco instance (only the surface `registerAdaasConceptLanguage` uses) ───

export interface IAdaas_MonacoInstance {
  languages: {
    register(language: {
      id:          string;
      extensions?: string[];
      aliases?:    string[];
      mimetypes?:  string[];
    }): void;

    setMonarchTokensProvider(
      languageId:  string,
      languageDef: IAdaas_MonarchLanguage,
    ): unknown;

    setLanguageConfiguration(
      languageId:    string,
      configuration: IAdaas_MonacoLanguageConfiguration,
    ): unknown;
  };

  editor: {
    defineTheme(
      themeName: string,
      themeData: IAdaas_MonacoStandaloneThemeData,
    ): void;
  };
}
