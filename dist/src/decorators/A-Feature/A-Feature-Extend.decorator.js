"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Extend = A_Feature_Extend;
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
/**
 * A-Extend decorator
 *
 * This decorator allows to define a custom Extend stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Extend and A-Extend decorators is that A-Extend methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
function A_Feature_Extend(config = {}) {
    return function (target, propertyKey, descriptor) {
        // Get the existed metadata or create a new one
        const existedMeta = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new Map();
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(propertyKey, {
            name: config.name || propertyKey,
            handler: propertyKey,
            container: config.container
                ? typeof config.container === 'string'
                    ? config.container
                    : config.container.name
                : '*',
        });
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}
//# sourceMappingURL=A-Feature-Extend.decorator.js.map