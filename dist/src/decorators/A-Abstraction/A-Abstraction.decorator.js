"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Abstraction = A_Abstraction;
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Container_types_1 = require("../../global/A-Container/A-Container.types");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 *
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.
 *
 * @param params
 * @returns
 */
function A_Abstraction(method, config = {}) {
    return function (target, propertyKey, descriptor) {
        const meta = A_Context_class_1.A_Context.meta(target);
        let metaKey;
        const StageKey = `CONCEPT_ABSTRACTION::${method}`;
        switch (true) {
            case target instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.ABSTRACTIONS;
                break;
            case target instanceof A_Component_class_1.A_Component:
                metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.ABSTRACTIONS;
                break;
            default:
                throw new Error(`Concept Stage cannot be defined on the ${target} level`);
        }
        // Get the existed metadata or create a new one
        const existedMeta = meta.get(metaKey) || new A_Meta_class_1.A_Meta();
        // Set the metadata of the method to define a custom Stage with name
        const existedMetaValue = existedMeta.get(StageKey) || [];
        // Add the new method to the metadata
        existedMetaValue.push({
            name: method,
            handler: propertyKey,
            before: config.before || [],
            after: config.after || [],
            behavior: config.behavior || 'sync'
        });
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(StageKey, existedMetaValue);
        //  Update the metadata of the container with the new Stage definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(metaKey, existedMeta);
    };
}
//# sourceMappingURL=A-Abstraction.decorator.js.map