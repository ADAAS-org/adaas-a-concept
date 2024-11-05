"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Define = A_Feature_Define;
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Container_types_1 = require("../../global/A-Container/A-Container.types");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const a_utils_1 = require("@adaas/a-utils");
const A_Entity_types_1 = require("../../global/A-Entity/A-Entity.types");
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
/**
 * A-Feature decorator
 *
 * This decorator allows to define a custom lifecycle stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Feature and A-Feature decorators is that A-Feature methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
function A_Feature_Define(config = {}) {
    return function (target, propertyKey, descriptor) {
        const meta = A_Context_class_1.A_Context.meta(target);
        let metaKey;
        switch (true) {
            case target instanceof a_utils_1.A_Entity:
                metaKey = A_Entity_types_1.A_TYPES__EntityMetaKey.FEATURES;
                break;
            case target instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.FEATURES;
                break;
            case target instanceof A_Component_class_1.A_Component:
                metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.FEATURES;
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${target} level`);
        }
        // Get the existed metadata or create a new one
        const existedMeta = meta.get(metaKey)
            || new Map();
        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            handler: propertyKey,
            config: Object.assign(Object.assign({}, config), { name: `${target.constructor.name}.${propertyKey || config.name}` })
        });
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(metaKey, existedMeta);
    };
}
//# sourceMappingURL=A-Feature-Define.decorator.js.map