'use strict';

// docs/syntax/adaas-concept.tokens.ts
var TOKEN_CORE_CLASS = "adaas.coreClass";
var TOKEN_META_CLASS = "adaas.metaClass";
var TOKEN_ERROR_CLASS = "adaas.errorClass";
var TOKEN_HELPER_CLASS = "adaas.helperClass";
var TOKEN_DECORATOR = "adaas.decorator";
var TOKEN_DECORATOR_NS = "adaas.decoratorNamespace";
var TOKEN_DECORATOR_METHOD = "adaas.decoratorMethod";
var TOKEN_TYPE_IDENT = "adaas.typeIdentifier";
var TOKEN_CONSTANT = "adaas.constant";
var ADAAS_CORE_CLASSES = [
  "A_Concept",
  "A_Container",
  "A_Component",
  "A_Entity",
  "A_Fragment",
  "A_Feature",
  "A_Abstraction",
  "A_Stage",
  "A_StepsManager",
  "A_Scope",
  "A_Context",
  "A_Dependency",
  "A_Caller",
  "A_Meta",
  "ASEID"
];
var ADAAS_META_CLASSES = [
  "A_ComponentMeta",
  "A_ContainerMeta",
  "A_ConceptMeta",
  "A_EntityMeta"
];
var ADAAS_ERROR_CLASSES = [
  "A_Error",
  "A_AbstractionError",
  "A_ContextError",
  "A_DependencyError",
  "A_EntityError",
  "A_FeatureError",
  "A_InjectError",
  "A_ScopeError",
  "A_StageError",
  "A_StepManagerError",
  "A_CallerError"
];
var ADAAS_HELPER_CLASSES = [
  "A_TypeGuards",
  "A_BasicTypeGuards",
  "A_CommonHelper",
  "A_FormatterHelper",
  "A_IdentityHelper"
];
var ADAAS_RAW_DECORATORS = [
  // Injection
  "A_Inject",
  // Meta
  "A_MetaDecorator",
  // Feature (standalone variants)
  "A_Feature_Define",
  "A_Feature_Extend",
  // Abstraction (standalone variant)
  "A_Abstraction_Extend",
  // Dependency (standalone variants)
  "A_Dependency_All",
  "A_Dependency_Default",
  "A_Dependency_Flat",
  "A_Dependency_Load",
  "A_Dependency_Parent",
  "A_Dependency_Query",
  "A_Dependency_Require"
];
var ADAAS_DECORATOR_NAMESPACES = [
  "A_Feature",
  "A_Abstraction",
  "A_Dependency",
  "A_Meta",
  "A_Concept"
];
var ADAAS_DECORATOR_METHODS = [
  // A_Feature
  "Define",
  "Extend",
  // A_Dependency
  "Required",
  "Loaded",
  "Default",
  "Parent",
  "Flat",
  "All",
  "Query",
  // A_Concept lifecycle
  "Load",
  "Publish",
  "Deploy",
  "Build",
  "Run",
  "Start",
  "Stop"
];

// docs/syntax/adaas-concept.monarch.ts
var ADAAS_CONCEPT_LANGUAGE_ID = "adaas-ts";
var TS_KEYWORDS = [
  "abstract",
  "any",
  "as",
  "asserts",
  "async",
  "await",
  "boolean",
  "break",
  "case",
  "catch",
  "class",
  "const",
  "constructor",
  "continue",
  "debugger",
  "declare",
  "default",
  "delete",
  "do",
  "else",
  "enum",
  "export",
  "extends",
  "false",
  "finally",
  "for",
  "from",
  "function",
  "get",
  "global",
  "if",
  "implements",
  "import",
  "in",
  "infer",
  "instanceof",
  "interface",
  "is",
  "keyof",
  "let",
  "module",
  "namespace",
  "never",
  "new",
  "null",
  "number",
  "object",
  "of",
  "override",
  "package",
  "private",
  "protected",
  "public",
  "readonly",
  "require",
  "return",
  "satisfies",
  "set",
  "static",
  "string",
  "super",
  "switch",
  "symbol",
  "this",
  "throw",
  "true",
  "try",
  "type",
  "typeof",
  "undefined",
  "unique",
  "unknown",
  "var",
  "void",
  "while",
  "with",
  "yield"
];
var adaasConceptMonarch = {
  // ── Keyword lookup tables ────────────────────────────────────────────────
  keywords: TS_KEYWORDS,
  // ADAAS sets — referenced via @setName inside cases
  adaasCoreClasses: ADAAS_CORE_CLASSES,
  adaasMetaClasses: ADAAS_META_CLASSES,
  adaasErrorClasses: ADAAS_ERROR_CLASSES,
  adaasHelperClasses: ADAAS_HELPER_CLASSES,
  adaasRawDecorators: ADAAS_RAW_DECORATORS,
  adaasDecoratorNS: ADAAS_DECORATOR_NAMESPACES,
  adaasDecoratorMethods: ADAAS_DECORATOR_METHODS,
  // ── Operators ────────────────────────────────────────────────────────────
  operators: [
    "<=",
    ">=",
    "==",
    "!=",
    "===",
    "!==",
    "=>",
    "+",
    "-",
    "**",
    "*",
    "/",
    "%",
    "++",
    "--",
    "<<",
    "</",
    ">>",
    ">>>",
    "&",
    "|",
    "^",
    "!",
    "~",
    "&&",
    "||",
    "??",
    "?",
    ":",
    "=",
    "+=",
    "-=",
    "*=",
    "**=",
    "/=",
    "%=",
    "<<=",
    ">>=",
    ">>>=",
    "&=",
    "|=",
    "^=",
    "@"
  ],
  // ── Symbols ──────────────────────────────────────────────────────────────
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[\dA-Fa-f]{1,4}|u[\dA-Fa-f]{4}|U[\dA-Fa-f]{8})/,
  digits: /\d+(_+\d+)*/,
  octaldigits: /[0-7]+(_+[0-7]+)*/,
  binarydigits: /[01]+(_+[01]+)*/,
  hexdigits: /[\dA-Fa-f]+(_+[\dA-Fa-f]+)*/,
  regexpctl: /[(){}\[\]\$\^|\-*+?.]/,
  regexpesc: /\\(?:[bBdDfnrstvwWn0\\\/]|@regexpctl|c[A-Z]|x[\dA-Fa-f]{2}|u[\dA-Fa-f]{4})/,
  // ── Tokenizer states ─────────────────────────────────────────────────────
  tokenizer: {
    // ── Root state ─────────────────────────────────────────────────────────
    root: [
      // Shebang
      [/^#!.*/, "metatag"],
      // ── ADAAS: decorators ────────────────────────────────────────────────
      //
      // Compound decorator namespace: @A_Feature, @A_Dependency, etc.
      // After the namespace the dot + method name are handled in @decoratorDot.
      [
        /@(A_Feature|A_Abstraction|A_Dependency|A_Meta|A_Concept)\b/,
        { token: TOKEN_DECORATOR_NS, next: "@decoratorDot", bracket: "@open" }
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
            "@adaasRawDecorators": TOKEN_DECORATOR,
            "@default": TOKEN_DECORATOR
          }
        }
      ],
      // ── ADAAS: A_TYPES__ and A_CONSTANTS__ ──────────────────────────────
      [/A_TYPES__[A-Za-z0-9_]+/, TOKEN_TYPE_IDENT],
      [/A_CONSTANTS__[A-Za-z0-9_]+/, TOKEN_CONSTANT],
      // ── ADAAS: ASEID (special — all caps) ───────────────────────────────
      [/\bASEID\b/, TOKEN_CORE_CLASS],
      // ── ADAAS: A_* identifiers ───────────────────────────────────────────
      [
        /A_[A-Za-z][A-Za-z0-9_]*/,
        {
          cases: {
            "@adaasCoreClasses": TOKEN_CORE_CLASS,
            "@adaasMetaClasses": TOKEN_META_CLASS,
            "@adaasErrorClasses": TOKEN_ERROR_CLASS,
            "@adaasHelperClasses": TOKEN_HELPER_CLASS,
            "@default": "identifier"
          }
        }
      ],
      // ── TypeScript: identifiers ──────────────────────────────────────────
      [
        /[a-zA-Z_$][\w$]*/,
        {
          cases: {
            "@keywords": { token: "keyword.$0" },
            "@default": "identifier"
          }
        }
      ],
      // ── Whitespace & line comments ───────────────────────────────────────
      { include: "@whitespace" },
      // ── Delimiters & brackets ─────────────────────────────────────────────
      [/[{}()\[\]]/, "@brackets"],
      [/[<>](?!@symbols)/, "@brackets"],
      [/!(?=([^=]|$))/, "delimiter"],
      [
        /@symbols/,
        {
          cases: {
            "@operators": "delimiter",
            "@default": ""
          }
        }
      ],
      // ── Numbers ───────────────────────────────────────────────────────────
      [/(@digits)[eE]([-+]?(@digits))?/, "number.float"],
      [/(@digits)\.(@digits)([eE][-+]?(@digits))?/, "number.float"],
      [/0[xX](@hexdigits)n?/, "number.hex"],
      [/0[oO]?(@octaldigits)n?/, "number.octal"],
      [/0[bB](@binarydigits)n?/, "number.binary"],
      [/(@digits)n?/, "number"],
      // ── Delimiter ─────────────────────────────────────────────────────────
      [/[;,.]/, "delimiter"],
      // ── Strings ───────────────────────────────────────────────────────────
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/'([^'\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string_double"],
      [/'/, "string", "@string_single"],
      [/`/, "string", "@string_backtick"]
    ],
    // ── Compound-decorator dot state ────────────────────────────────────────
    // Entered after matching @A_Feature, @A_Dependency, etc.
    // Consumes the dot and method name, then pops back to root.
    decoratorDot: [
      [
        /\.(Define|Extend|Required|Loaded|Default|Parent|Flat|All|Query|Load|Publish|Deploy|Build|Run|Start|Stop)\b/,
        { token: TOKEN_DECORATOR_METHOD, next: "@pop", bracket: "@close" }
      ],
      // No dot — just pop back to root without consuming anything
      [/(?=.)/, { token: "", next: "@pop" }]
    ],
    // ── Whitespace / comments ────────────────────────────────────────────────
    whitespace: [
      [/[ \t\r\n]+/, ""],
      [/\/\*\*(?!\/)/, "comment.doc", "@jsdoc"],
      [/\/\*/, "comment", "@comment"],
      [/\/\/.*$/, "comment"]
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\/\*/, "comment", "@push"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"]
    ],
    jsdoc: [
      [/[^/*]+/, "comment.doc"],
      [/\/\*/, "comment.doc", "@push"],
      [/\*\//, "comment.doc", "@pop"],
      [/[/*]/, "comment.doc"]
    ],
    // ── String states ────────────────────────────────────────────────────────
    string_double: [
      [/[^\\"]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/"/, "string", "@pop"]
    ],
    string_single: [
      [/[^\\']+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/'/, "string", "@pop"]
    ],
    string_backtick: [
      [/\$\{/, { token: "delimiter.bracket", next: "@bracketCounting" }],
      [/[^\\`$]+/, "string"],
      [/@escapes/, "string.escape"],
      [/\\./, "string.escape.invalid"],
      [/`/, "string", "@pop"]
    ],
    bracketCounting: [
      [/\{/, "delimiter.bracket", "@push"],
      [/\}/, "delimiter.bracket", "@pop"],
      { include: "root" }
    ]
  }
};

// docs/syntax/adaas-concept.theme.ts
var DARK = {
  coreClass: "#4FC1FF",
  metaClass: "#9CDCFE",
  errorClass: "#F48771",
  helperClass: "#DCDCAA",
  decorator: "#C586C0",
  decoratorNS: "#C586C0",
  decoratorMethod: "#CE9178",
  typeIdent: "#4EC9B0",
  constant: "#D7BA7D"
};
var LIGHT = {
  coreClass: "#0070C1",
  // Strong blue
  metaClass: "#001080",
  // dark navy
  errorClass: "#A31515",
  // red
  helperClass: "#795E26",
  // brown/gold
  decorator: "#AF00DB",
  // purple
  decoratorNS: "#AF00DB",
  decoratorMethod: "#863B00",
  // dark orange
  typeIdent: "#267F99",
  // teal
  constant: "#0000FF"
  // blue
};
function buildRules(palette) {
  return [
    { token: TOKEN_CORE_CLASS, foreground: palette.coreClass, fontStyle: "bold" },
    { token: TOKEN_META_CLASS, foreground: palette.metaClass },
    { token: TOKEN_ERROR_CLASS, foreground: palette.errorClass, fontStyle: "italic" },
    { token: TOKEN_HELPER_CLASS, foreground: palette.helperClass },
    { token: TOKEN_DECORATOR, foreground: palette.decorator, fontStyle: "bold" },
    { token: TOKEN_DECORATOR_NS, foreground: palette.decoratorNS, fontStyle: "bold" },
    { token: TOKEN_DECORATOR_METHOD, foreground: palette.decoratorMethod },
    { token: TOKEN_TYPE_IDENT, foreground: palette.typeIdent, fontStyle: "italic" },
    { token: TOKEN_CONSTANT, foreground: palette.constant }
  ];
}
var adaasConceptDarkTheme = {
  base: "vs-dark",
  inherit: true,
  // inherit all VS Dark rules; only ADAAS rules are added
  rules: buildRules(DARK),
  colors: {}
};
var adaasConceptLightTheme = {
  base: "vs",
  inherit: true,
  rules: buildRules(LIGHT),
  colors: {}
};

// docs/syntax/adaas-concept.register.ts
var LANGUAGE_CONFIGURATION = {
  wordPattern: /(-?\d*\.\d\w*)|([^`~!@#%^&*()\-=+\[{\]}\\|;:'",.<>\/?\s]+)/g,
  comments: {
    lineComment: "//",
    blockComment: ["/*", "*/"]
  },
  brackets: [
    ["{", "}"],
    ["[", "]"],
    ["(", ")"]
  ],
  autoClosingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"', notIn: ["string"] },
    { open: "'", close: "'", notIn: ["string", "comment"] },
    { open: "`", close: "`", notIn: ["string", "comment"] },
    { open: "/**", close: " */", notIn: ["string"] }
  ],
  surroundingPairs: [
    { open: "{", close: "}" },
    { open: "[", close: "]" },
    { open: "(", close: ")" },
    { open: '"', close: '"' },
    { open: "'", close: "'" },
    { open: "`", close: "`" }
  ],
  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end: /^\s*\/\/\s*#?endregion\b/
    }
  },
  indentationRules: {
    // Indent after opening brackets
    increaseIndentPattern: /^(?!\/\/).*[\{\[\(](?!.*[\}\]\)].*$)/,
    decreaseIndentPattern: /^\s*[\}\]\)]/
  }
};
function registerAdaasConceptLanguage(monaco) {
  monaco.languages.register({
    id: ADAAS_CONCEPT_LANGUAGE_ID,
    extensions: [".ts", ".tsx"],
    aliases: ["ADAAS TypeScript", "adaas-ts"],
    mimetypes: ["text/x-adaas-ts"]
  });
  monaco.languages.setMonarchTokensProvider(
    ADAAS_CONCEPT_LANGUAGE_ID,
    adaasConceptMonarch
  );
  monaco.languages.setLanguageConfiguration(
    ADAAS_CONCEPT_LANGUAGE_ID,
    LANGUAGE_CONFIGURATION
  );
  monaco.editor.defineTheme("adaas-dark", adaasConceptDarkTheme);
  monaco.editor.defineTheme("adaas-light", adaasConceptLightTheme);
}

exports.ADAAS_CONCEPT_LANGUAGE_ID = ADAAS_CONCEPT_LANGUAGE_ID;
exports.ADAAS_CORE_CLASSES = ADAAS_CORE_CLASSES;
exports.ADAAS_DECORATOR_METHODS = ADAAS_DECORATOR_METHODS;
exports.ADAAS_DECORATOR_NAMESPACES = ADAAS_DECORATOR_NAMESPACES;
exports.ADAAS_ERROR_CLASSES = ADAAS_ERROR_CLASSES;
exports.ADAAS_HELPER_CLASSES = ADAAS_HELPER_CLASSES;
exports.ADAAS_META_CLASSES = ADAAS_META_CLASSES;
exports.ADAAS_RAW_DECORATORS = ADAAS_RAW_DECORATORS;
exports.TOKEN_CONSTANT = TOKEN_CONSTANT;
exports.TOKEN_CORE_CLASS = TOKEN_CORE_CLASS;
exports.TOKEN_DECORATOR = TOKEN_DECORATOR;
exports.TOKEN_DECORATOR_METHOD = TOKEN_DECORATOR_METHOD;
exports.TOKEN_DECORATOR_NS = TOKEN_DECORATOR_NS;
exports.TOKEN_ERROR_CLASS = TOKEN_ERROR_CLASS;
exports.TOKEN_HELPER_CLASS = TOKEN_HELPER_CLASS;
exports.TOKEN_META_CLASS = TOKEN_META_CLASS;
exports.TOKEN_TYPE_IDENT = TOKEN_TYPE_IDENT;
exports.adaasConceptDarkTheme = adaasConceptDarkTheme;
exports.adaasConceptLightTheme = adaasConceptLightTheme;
exports.adaasConceptMonarch = adaasConceptMonarch;
exports.registerAdaasConceptLanguage = registerAdaasConceptLanguage;
//# sourceMappingURL=docs.cjs.map
//# sourceMappingURL=docs.cjs.map