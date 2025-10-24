"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ContainerMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Container_constants_1 = require("./A-Container.constants");
class A_ContainerMeta extends A_Meta_class_1.A_Meta {
    /**
     * Allows to get all the injections for a given handler
     *
     * @param handler
     * @returns
     */
    injections(handler) {
        const injections = this.get(A_Container_constants_1.A_TYPES__ContainerMetaKey.INJECTIONS);
        const args = (injections === null || injections === void 0 ? void 0 : injections.get(handler)) || [];
        return args;
    }
    /**
     * Returns all features defined in the Container
     *
     * @returns
     */
    features() {
        const features = this.get(A_Container_constants_1.A_TYPES__ContainerMetaKey.FEATURES);
        return (features === null || features === void 0 ? void 0 : features.toArray().map(([, feature]) => feature)) || [];
    }
    /**
     * Returns a set of instructions to run proper methods in Container during A-Concept Stage
     *
     * @param stage
     * @returns
     */
    abstractions(abstraction) {
        const steps = [];
        const abstractions = this.get(A_Container_constants_1.A_TYPES__ContainerMetaKey.ABSTRACTIONS);
        const injections = this.get(A_Container_constants_1.A_TYPES__ContainerMetaKey.INJECTIONS);
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
                    after: extension.after,
                    throwOnError: extension.throwOnError,
                });
            });
        });
        return steps;
    }
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature) {
        const steps = [];
        const extensions = this.get(A_Container_constants_1.A_TYPES__ContainerMetaKey.EXTENSIONS);
        extensions === null || extensions === void 0 ? void 0 : extensions
        // returns all extensions that match the feature
        .find(feature).forEach(([handler, extensions]) => {
            extensions.forEach(extension => {
                steps.push({
                    // component: constructor,
                    name: extension.name,
                    handler: extension.handler,
                    behavior: extension.behavior,
                    before: extension.before || [],
                    after: extension.after || [],
                    throwOnError: extension.throwOnError || true,
                });
            });
        });
        return steps;
    }
}
exports.A_ContainerMeta = A_ContainerMeta;
//# sourceMappingURL=A-Container.meta.js.map