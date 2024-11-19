"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ContainerMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Container_types_1 = require("./A-Container.types");
class A_ContainerMeta extends A_Meta_class_1.A_Meta {
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction) {
        const steps = [];
        const abstractions = this.get(A_Container_types_1.A_TYPES__ContainerMetaKey.ABSTRACTIONS);
        const injections = this.get(A_Container_types_1.A_TYPES__ContainerMetaKey.INJECTIONS);
        // const constructor = A_Context.component(this);
        abstractions === null || abstractions === void 0 ? void 0 : abstractions
        // returns all extensions that match the feature
        .find(`CONCEPT_ABSTRACTION::${abstraction}`).forEach(([handler, extensions]) => {
            extensions.forEach(extension => {
                const args = (injections === null || injections === void 0 ? void 0 : injections.get(extension.handler)) || [];
                steps.push({
                    name: extension.name,
                    handler: extension.handler,
                    args,
                    before: extension.before,
                    behavior: extension.behavior,
                    after: extension.after
                });
            });
        });
        return steps;
    }
}
exports.A_ContainerMeta = A_ContainerMeta;
//# sourceMappingURL=A-Container.meta.js.map