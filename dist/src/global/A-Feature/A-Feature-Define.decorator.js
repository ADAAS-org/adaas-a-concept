"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Define = A_Feature_Define;
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Entity_constants_1 = require("../A-Entity/A-Entity.constants");
const A_Container_constants_1 = require("../A-Container/A-Container.constants");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Feature_error_1 = require("./A-Feature.error");
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
        var _a;
        // for error messages
        const componentName = ((_a = target === null || target === void 0 ? void 0 : target.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(target) || 'Unknown';
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureDefinition(target))
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureDefinitionError, `A-Feature cannot be defined on the ${componentName} level`);
        const meta = A_Context_class_1.A_Context.meta(target.constructor);
        let metaKey;
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isEntityInstance(target):
                metaKey = A_Entity_constants_1.A_TYPES__EntityMetaKey.FEATURES;
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(target):
                metaKey = A_Container_constants_1.A_TYPES__ContainerMetaKey.FEATURES;
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentInstance(target):
                metaKey = A_Component_constants_1.A_TYPES__ComponentMetaKey.FEATURES;
                break;
        }
        // Get the existed metadata or create a new one
        const existedMeta = meta.get(metaKey) || new A_Meta_class_1.A_Meta();
        const name = config.name || propertyKey;
        //  default to false
        const invoke = config.invoke || false;
        // Set the metadata of the method to define a custom Feature with name 
        existedMeta.set(propertyKey, {
            name: `${target.constructor.name}.${name}`,
            handler: propertyKey,
            invoke: invoke,
            template: config.template && config.template.length ? config.template.map(item => (Object.assign(Object.assign({}, item), { before: item.before || [], after: item.after || [], behavior: item.behavior || 'sync' }))) : [],
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
                return this.call(name);
        };
        return descriptor;
    };
}
//# sourceMappingURL=A-Feature-Define.decorator.js.map