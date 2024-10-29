"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Extend = A_Extend;
const A_Component_storage_1 = require("../../storage/A_Component.storage");
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
function A_Extend(config = {}) {
    return function (target, propertyKey, descriptor) {
        const existedMeta = A_Component_storage_1.A_COMPONENT_Storage.get(target.constructor) || new Map();
        const inheritMeta = A_Component_storage_1.A_COMPONENT_Storage.get(Object.getPrototypeOf(target.constructor)) || new Map();
        const inheritedExtension = inheritMeta.get(A_Component_storage_1.A_COMPONENT_STORAGE__Definition__Extensions) || new Map();
        const extensionDefinition = existedMeta.get(A_Component_storage_1.A_COMPONENT_STORAGE__Definition__Extensions) || new Map(inheritedExtension);
        extensionDefinition.set(propertyKey, {
            name: config.name || propertyKey,
            handler: propertyKey,
            container: config.container
                ? typeof config.container === 'string'
                    ? config.container
                    : config.container.name
                : '*',
        });
        existedMeta.set(A_Component_storage_1.A_COMPONENT_STORAGE__Definition__Extensions, extensionDefinition);
        A_Component_storage_1.A_COMPONENT_Storage.set(target.constructor, existedMeta);
    };
}
//# sourceMappingURL=A-Extend.decorator.js.map