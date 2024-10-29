"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_TYPES__ConceptMetaKey = exports.A_TYPES__ConceptStage = void 0;
var A_TYPES__ConceptStage;
(function (A_TYPES__ConceptStage) {
    A_TYPES__ConceptStage["Run"] = "run";
    A_TYPES__ConceptStage["Build"] = "build";
    A_TYPES__ConceptStage["Publish"] = "publish";
    A_TYPES__ConceptStage["Deploy"] = "deploy";
    A_TYPES__ConceptStage["Load"] = "load";
    A_TYPES__ConceptStage["Start"] = "start";
    A_TYPES__ConceptStage["Stop"] = "stop";
})(A_TYPES__ConceptStage || (exports.A_TYPES__ConceptStage = A_TYPES__ConceptStage = {}));
// export type A_TYPES__ConceptMeta = {
//     [A_TYPES__ConceptMetaKey.EXTENSIONS]: Map<string, A_TYPES__ConceptMeta_ExtensionItem>,
//     [A_TYPES__ConceptMetaKey.FEATURES]: any[],
//     // [A_TYPES__ConceptMetaKey.INJECTIONS]: Map<
//     //     // Where key is method name
//     //     Symbol | string,
//     //     // And value is Injection instructions
//     //     A_TYPES__ConceptMeta_InjectionParams
//     // >
// }
var A_TYPES__ConceptMetaKey;
(function (A_TYPES__ConceptMetaKey) {
    A_TYPES__ConceptMetaKey["LIFECYCLE"] = "a-component-extensions";
})(A_TYPES__ConceptMetaKey || (exports.A_TYPES__ConceptMetaKey = A_TYPES__ConceptMetaKey = {}));
//# sourceMappingURL=A_Concept.types.js.map