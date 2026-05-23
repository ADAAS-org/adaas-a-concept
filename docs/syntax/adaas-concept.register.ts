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

import type {
  IAdaas_MonacoInstance,
  IAdaas_MonacoLanguageConfiguration,
} from './adaas-concept.monaco-types';

import { ADAAS_CONCEPT_LANGUAGE_ID, adaasConceptMonarch } from './adaas-concept.monarch';
import { adaasConceptDarkTheme, adaasConceptLightTheme } from './adaas-concept.theme';

// ─── Language configuration (mirrors Monaco's built-in TypeScript config) ─────

const LANGUAGE_CONFIGURATION: IAdaas_MonacoLanguageConfiguration = {
  wordPattern:
    /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+\[{\]}\\|;:'",.<>\/?\s]+)/g,

  comments: {
    lineComment:  '//',
    blockComment: ['/*', '*/'],
  },

  brackets: [
    ['{', '}'],
    ['[', ']'],
    ['(', ')'],
  ],

  autoClosingPairs: [
    { open: '{',  close: '}'  },
    { open: '[',  close: ']'  },
    { open: '(',  close: ')'  },
    { open: '"',  close: '"',  notIn: ['string'] },
    { open: "'",  close: "'",  notIn: ['string', 'comment'] },
    { open: '`',  close: '`',  notIn: ['string', 'comment'] },
    { open: '/**', close: ' */', notIn: ['string'] },
  ],

  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: '`', close: '`' },
  ],

  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end:   /^\s*\/\/\s*#?endregion\b/,
    },
  },

  indentationRules: {
    // Indent after opening brackets
    increaseIndentPattern: /^(?!\/\/).*[\{\[\(](?!.*[\}\]\)].*$)/,
    decreaseIndentPattern: /^\s*[\}\]\)]/,
  },
};

// ─── Registration ─────────────────────────────────────────────────────────────

/**
 * Registers the ADAAS Concept language and themes with Monaco.
 *
 * Call this once before creating any Monaco editor that should use the
 * `adaas-ts` language.
 *
 * @param monaco  The `monaco-editor` namespace import.
 */
export function registerAdaasConceptLanguage(monaco: IAdaas_MonacoInstance): void {
  // 1. Register the language ID
  monaco.languages.register({
    id:         ADAAS_CONCEPT_LANGUAGE_ID,
    extensions: ['.ts', '.tsx'],
    aliases:    ['ADAAS TypeScript', 'adaas-ts'],
    mimetypes:  ['text/x-adaas-ts'],
  });

  // 2. Set the Monarch tokenizer
  monaco.languages.setMonarchTokensProvider(
    ADAAS_CONCEPT_LANGUAGE_ID,
    adaasConceptMonarch,
  );

  // 3. Set language configuration (bracket matching, auto-close, etc.)
  monaco.languages.setLanguageConfiguration(
    ADAAS_CONCEPT_LANGUAGE_ID,
    LANGUAGE_CONFIGURATION,
  );

  // 4. Define themes
  monaco.editor.defineTheme('adaas-dark',  adaasConceptDarkTheme);
  monaco.editor.defineTheme('adaas-light', adaasConceptLightTheme);
}
