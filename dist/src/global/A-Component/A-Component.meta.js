"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ComponentMeta = void 0;
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Component_types_1 = require("./A-Component.types");
class A_ComponentMeta extends A_Meta_class_1.A_Meta {
    /**
     * Allows to get all the extensions for a given feature
     *
     * @param feature
     * @returns
     */
    extensions(feature) {
        const steps = [];
        const extensions = this.get(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS);
        const injections = this.get(A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS);
        // const constructor = A_Context.component(this);
        extensions === null || extensions === void 0 ? void 0 : extensions
        // returns all extensions that match the feature
        .find(feature).forEach(([handler, extensions]) => {
            extensions.forEach(extension => {
                const args = (injections === null || injections === void 0 ? void 0 : injections.get(extension.handler)) || [];
                steps.push({
                    // component: constructor,
                    handler: extension.handler,
                    args
                });
            });
        });
        return steps;
    }
}
exports.A_ComponentMeta = A_ComponentMeta;
//# sourceMappingURL=A-Component.meta.js.map