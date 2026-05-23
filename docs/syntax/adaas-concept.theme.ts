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

import type {
  IAdaas_MonacoStandaloneThemeData,
  IAdaas_MonacoTokenThemeRule,
} from './adaas-concept.monaco-types';

import {
  TOKEN_CONSTANT,
  TOKEN_CORE_CLASS,
  TOKEN_DECORATOR,
  TOKEN_DECORATOR_METHOD,
  TOKEN_DECORATOR_NS,
  TOKEN_ERROR_CLASS,
  TOKEN_HELPER_CLASS,
  TOKEN_META_CLASS,
  TOKEN_TYPE_IDENT,
} from './adaas-concept.tokens';

// ─── Colour palettes ──────────────────────────────────────────────────────────

/**
 * Dark-theme colour palette.
 *
 * Token             Colour        Rationale
 * ──────────────────────────────────────────────────────────────────────────
 * coreClass         #4FC1FF       Bright cyan — the prime building blocks
 * metaClass         #9CDCFE       Soft blue — companion metadata stores
 * errorClass        #F48771       Salmon-red — errors should stand out
 * helperClass       #DCDCAA       Desaturated yellow — utility, not domain
 * decorator         #C586C0       Magenta — decorators are special syntax
 * decoratorNS       #C586C0       Same as decorator — same semantic family
 * decoratorMethod   #CE9178       Warm orange — the method segment of @NS.Method
 * typeIdentifier    #4EC9B0       Teal — type-level constructs
 * constant          #D7BA7D       Muted gold — constants / enum-like values
 */
const DARK = {
  coreClass:       '#4FC1FF',
  metaClass:       '#9CDCFE',
  errorClass:      '#F48771',
  helperClass:     '#DCDCAA',
  decorator:       '#C586C0',
  decoratorNS:     '#C586C0',
  decoratorMethod: '#CE9178',
  typeIdent:       '#4EC9B0',
  constant:        '#D7BA7D',
} as const;

/**
 * Light-theme colour palette (deeper tones for white backgrounds).
 */
const LIGHT = {
  coreClass:       '#0070C1',  // Strong blue
  metaClass:       '#001080',  // dark navy
  errorClass:      '#A31515',  // red
  helperClass:     '#795E26',  // brown/gold
  decorator:       '#AF00DB',  // purple
  decoratorNS:     '#AF00DB',
  decoratorMethod: '#863B00',  // dark orange
  typeIdent:       '#267F99',  // teal
  constant:        '#0000FF',  // blue
} as const;

// ─── Helper ───────────────────────────────────────────────────────────────────

function buildRules(
  palette: Record<keyof typeof DARK, string>,
): IAdaas_MonacoTokenThemeRule[] {
  return [
    { token: TOKEN_CORE_CLASS,       foreground: palette.coreClass,        fontStyle: 'bold' },
    { token: TOKEN_META_CLASS,       foreground: palette.metaClass                           },
    { token: TOKEN_ERROR_CLASS,      foreground: palette.errorClass,        fontStyle: 'italic' },
    { token: TOKEN_HELPER_CLASS,     foreground: palette.helperClass                          },
    { token: TOKEN_DECORATOR,        foreground: palette.decorator,         fontStyle: 'bold' },
    { token: TOKEN_DECORATOR_NS,     foreground: palette.decoratorNS,       fontStyle: 'bold' },
    { token: TOKEN_DECORATOR_METHOD, foreground: palette.decoratorMethod                      },
    { token: TOKEN_TYPE_IDENT,       foreground: palette.typeIdent,         fontStyle: 'italic' },
    { token: TOKEN_CONSTANT,         foreground: palette.constant                             },
  ];
}

// ─── Theme definitions ────────────────────────────────────────────────────────

/**
 * Dark theme that extends Monaco's built-in `vs-dark` theme with ADAAS tokens.
 */
export const adaasConceptDarkTheme: IAdaas_MonacoStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,   // inherit all VS Dark rules; only ADAAS rules are added
  rules: buildRules(DARK),
  colors: {},
};

/**
 * Light theme that extends Monaco's built-in `vs` theme with ADAAS tokens.
 */
export const adaasConceptLightTheme: IAdaas_MonacoStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: buildRules(LIGHT),
  colors: {},
};
