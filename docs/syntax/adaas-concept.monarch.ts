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

import type { IAdaas_MonarchLanguage } from './adaas-concept.monaco-types';

import {
  ADAAS_CORE_CLASSES,
  ADAAS_DECORATOR_METHODS,
  ADAAS_DECORATOR_NAMESPACES,
  ADAAS_ERROR_CLASSES,
  ADAAS_HELPER_CLASSES,
  ADAAS_META_CLASSES,
  ADAAS_RAW_DECORATORS,
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

// ─── Language ID ──────────────────────────────────────────────────────────────

export const ADAAS_CONCEPT_LANGUAGE_ID = 'adaas-ts' as const;

// ─── TypeScript keyword sets (mirrored from Monaco's built-in TypeScript) ─────

const TS_KEYWORDS: string[] = [
  'abstract', 'any', 'as', 'asserts', 'async', 'await',
  'boolean', 'break',
  'case', 'catch', 'class', 'const', 'constructor', 'continue',
  'debugger', 'declare', 'default', 'delete', 'do',
  'else', 'enum', 'export', 'extends',
  'false', 'finally', 'for', 'from', 'function',
  'get', 'global',
  'if', 'implements', 'import', 'in', 'infer', 'instanceof', 'interface', 'is',
  'keyof',
  'let',
  'module', 'namespace', 'never', 'new', 'null', 'number',
  'object', 'of', 'override',
  'package', 'private', 'protected', 'public',
  'readonly', 'require', 'return',
  'satisfies', 'set', 'static', 'string', 'super', 'switch', 'symbol',
  'this', 'throw', 'true', 'try', 'type', 'typeof',
  'undefined', 'unique', 'unknown',
  'var', 'void',
  'while', 'with',
  'yield',
];

// ─── Monarch language definition ─────────────────────────────────────────────

export const adaasConceptMonarch: IAdaas_MonarchLanguage = {
  // ── Keyword lookup tables ────────────────────────────────────────────────
  keywords: TS_KEYWORDS,

  // ADAAS sets — referenced via @setName inside cases
  adaasCoreClasses:        ADAAS_CORE_CLASSES,
  adaasMetaClasses:        ADAAS_META_CLASSES,
  adaasErrorClasses:       ADAAS_ERROR_CLASSES,
  adaasHelperClasses:      ADAAS_HELPER_CLASSES,
  adaasRawDecorators:      ADAAS_RAW_DECORATORS,
  adaasDecoratorNS:        ADAAS_DECORATOR_NAMESPACES,
  adaasDecoratorMethods:   ADAAS_DECORATOR_METHODS,

  // ── Operators ────────────────────────────────────────────────────────────
  operators: [
    '<=', '>=', '==', '!=', '===', '!==', '=>', '+', '-', '**',
    '*', '/', '%', '++', '--', '<<', '</', '>>', '>>>', '&',
    '|', '^', '!', '~', '&&', '||', '??', '?', ':', '=', '+=',
    '-=', '*=', '**=', '/=', '%=', '<<=', '>>=', '>>>=', '&=',
    '|=', '^=', '@',
  ],

  // ── Symbols ──────────────────────────────────────────────────────────────
  symbols:     /[=><!~?:&|+\-*\/\^%]+/,
  escapes:     /\\(?:[abfnrtv\\"']|x[\dA-Fa-f]{1,4}|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/,
  digits:      /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits:/[01]+(_+[01]+)*/,
  hexdigits:   /[\dA-Fa-f]+(_+[\dA-Fa-f]+)*/,

  regexpctl:   /[(){}\[\]\$\^|\-*+?.]/,
  regexpesc:   /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4})/,

  // ── Tokenizer states ─────────────────────────────────────────────────────
  tokenizer: {
    // ── Root state ─────────────────────────────────────────────────────────
    root: [
      // Shebang
      [/^#!.*/, 'metatag'],

      // ── ADAAS: decorators ────────────────────────────────────────────────
      //
      // Compound decorator namespace: @A_Feature, @A_Dependency, etc.
      // After the namespace the dot + method name are handled in @decoratorDot.
      [
        /@(A_Feature|A_Abstraction|A_Dependency|A_Meta|A_Concept)\b/,
        { token: TOKEN_DECORATOR_NS, next: '@decoratorDot', bracket: '@open' },
      ],

      // Standalone decorators: @A_Inject, @A_MetaDecorator, @A_Feature_Define, …
      // We build a single alternation from ADAAS_RAW_DECORATORS at runtime.
      // Because Monarch only accepts literals in the grammar object we use the
      // catch-all A_ pattern here and let `cases` classify further.
      [
        /@A_[A-Za-z_][A-Za-z0-9_]*/,
        {
          cases: {
            // Strip the leading '@' — Monarch gives us the full match,
            // so we compare after stripping it manually via the regex
            // capture note: `@` prefix is part of the match.
            // We use a simple wildcard for ADAAS_RAW_DECORATORS look-up.
            '@adaasRawDecorators': TOKEN_DECORATOR,
            '@default': TOKEN_DECORATOR,
          },
        },
      ],

      // ── ADAAS: A_TYPES__ and A_CONSTANTS__ ──────────────────────────────
      [/A_TYPES__[A-Za-z0-9_]+/,    TOKEN_TYPE_IDENT],
      [/A_CONSTANTS__[A-Za-z0-9_]+/, TOKEN_CONSTANT],

      // ── ADAAS: ASEID (special — all caps) ───────────────────────────────
      [/\bASEID\b/, TOKEN_CORE_CLASS],

      // ── ADAAS: A_* identifiers ───────────────────────────────────────────
      [
        /A_[A-Za-z][A-Za-z0-9_]*/,
        {
          cases: {
            '@adaasCoreClasses':  TOKEN_CORE_CLASS,
            '@adaasMetaClasses':  TOKEN_META_CLASS,
            '@adaasErrorClasses': TOKEN_ERROR_CLASS,
            '@adaasHelperClasses':TOKEN_HELPER_CLASS,
            '@default':           'identifier',
          },
        },
      ],

      // ── TypeScript: identifiers ──────────────────────────────────────────
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            '@keywords':  { token: 'keyword.$0' },
            '@default':   'identifier',
          },
        },
      ],

      // ── Whitespace & line comments ───────────────────────────────────────
      { include: '@whitespace' },

      // ── Delimiters & brackets ─────────────────────────────────────────────
      [/[{}()\[\]]/, '@brackets'],
      [/[<>](?!@symbols)/, '@brackets'],
      [/!(?=([^=]|$))/, 'delimiter'],
      [
        /@symbols/,
        {
          cases: {
            '@operators': 'delimiter',
            '@default':   '',
          },
        },
      ],

      // ── Numbers ───────────────────────────────────────────────────────────
      [/(@digits)[eE]([-+]?(@digits))?/, 'number.float'],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, 'number.float'],
      [/0[xX](@hexdigits)n?/, 'number.hex'],
      [/0[oO]?(@octaldigits)n?/, 'number.octal'],
      [/0[bB](@binarydigits)n?/, 'number.binary'],
      [/(@digits)n?/, 'number'],

      // ── Delimiter ─────────────────────────────────────────────────────────
      [/[;,.]/, 'delimiter'],

      // ── Strings ───────────────────────────────────────────────────────────
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/'([^'\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string_double'],
      [/'/, 'string', '@string_single'],
      [/`/,  'string', '@string_backtick'],
    ],

    // ── Compound-decorator dot state ────────────────────────────────────────
    // Entered after matching @A_Feature, @A_Dependency, etc.
    // Consumes the dot and method name, then pops back to root.
    decoratorDot: [
      [
        /\.(Define|Extend|Required|Loaded|Default|Parent|Flat|All|Query|Load|Publish|Deploy|Build|Run|Start|Stop)\b/,
        { token: TOKEN_DECORATOR_METHOD, next: '@pop', bracket: '@close' },
      ],
      // No dot — just pop back to root without consuming anything
      [/(?=.)/, { token: '', next: '@pop' }],
    ],

    // ── Whitespace / comments ────────────────────────────────────────────────
    whitespace: [
      [/[ \t\r\n]+/, ''],
      [/\/\*\*(?!\/)/, 'comment.doc', '@jsdoc'],
      [/\/\*/, 'comment', '@comment'],
      [/\/\/.*$/, 'comment'],
    ],

    comment: [
      [/[^/*]+/, 'comment'],
      [/\/\*/, 'comment', '@push'],
      [/\*\//, 'comment', '@pop'],
      [/[/*]/, 'comment'],
    ],

    jsdoc: [
      [/[^/*]+/, 'comment.doc'],
      [/\/\*/, 'comment.doc', '@push'],
      [/\*\//, 'comment.doc', '@pop'],
      [/[/*]/, 'comment.doc'],
    ],

    // ── String states ────────────────────────────────────────────────────────
    string_double: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],

    string_single: [
      [/[^\\']+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/'/, 'string', '@pop'],
    ],

    string_backtick: [
      [/\$\{/, { token: 'delimiter.bracket', next: '@bracketCounting' }],
      [/[^\\`$]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/`/, 'string', '@pop'],
    ],

    bracketCounting: [
      [/\{/, 'delimiter.bracket', '@push'],
      [/\}/, 'delimiter.bracket', '@pop'],
      { include: 'root' },
    ],
  },
};
