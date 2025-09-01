"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Define = A_Feature_Define;
const A_Entity_class_1 = require("../../global/A-Entity/A-Entity.class");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Container_types_1 = require("../../global/A-Container/A-Container.types");
const A_Entity_types_1 = require("../../global/A-Entity/A-Entity.types");
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
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
        const meta = A_Context_class_1.A_Context.meta(target.constructor);
        let metaKey;
        switch (true) {
            case target instanceof A_Entity_class_1.A_Entity:
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
        const existedMeta = meta.get(metaKey) || new A_Meta_class_1.A_Meta();
        const handlerName = config.name || propertyKey;
        const invoke = config.invoke !== false;
        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            name: `${target.constructor.name}.${handlerName}`,
            handler: handlerName,
            template: config.template && config.template.length ? config.template.map(item => (Object.assign(Object.assign({}, item), { before: item.before || [], after: item.after || [], behavior: item.behavior || 'sync' }))) : [],
            channel: config.channel || []
        });
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target.constructor)
            .set(metaKey, existedMeta);
        const originalMethod = descriptor.value;
        // Wrap the original method to add the call to `call`
        // this helps to automatically call the container/entity/component method when it's called
        descriptor.value = function (...args) {
            // Call the original method
            if (!invoke)
                return originalMethod.apply(this, args);
            else
                originalMethod.apply(this, args);
            // Call your `call` with the function name
            if (typeof this.call === "function" && invoke)
                return this.call(propertyKey);
        };
        return descriptor;
    };
}
//# sourceMappingURL=A-Feature-Define.decorator.js.map