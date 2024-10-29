"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ContainerMeta = void 0;
const A_Component_types_1 = require("../A-Component/A-Component.types");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Container_types_1 = require("./A-Container.types");
class A_ContainerMeta extends A_Meta_class_1.A_Meta {
    feature(container, name) {
        const scope = A_Context_class_1.A_Context.scope(container);
        // First lets validate that there'are registered method with the same name
        const featureMeta = this.get(A_Container_types_1.A_TYPES__ContainerMetaKey.FEATURES);
        if (!featureMeta) {
            throw new Error(`Container ${container.constructor.name} has no metadata defined`);
        }
        const instruction = featureMeta.get(name);
        if (!instruction)
            throw new Error(`Method ${name} is not defined in ${this.constructor.name}`);
        // const scope = new A_Scope({
        //     name: `${this.constructor.name}.${feature}`,
        //     fragments: param2?.fragments || [],
        //     components: param2?.components || []
        // }, {
        //     parent: this.scope
        // });
        // Now we need to resolve the method from all registered components 
        return scope
            .components
            .reduce((acc, component) => {
            const componentMeta = A_Context_class_1.A_Context.meta(component);
            const extensions = componentMeta.get(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS) || [];
            const injections = componentMeta.get(A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS);
            const out = [];
            extensions.forEach((extension, handler) => {
                if (extension.name === name
                    &&
                        (extension.container === container.constructor.name || extension.container === '*')) {
                    const args = (injections === null || injections === void 0 ? void 0 : injections.get(handler)) || [];
                    out.push({
                        component,
                        handler,
                        args
                    });
                }
            });
            return [
                ...acc,
                ...out
            ];
        }, []);
    }
}
exports.A_ContainerMeta = A_ContainerMeta;
//# sourceMappingURL=A-Container.meta.js.map