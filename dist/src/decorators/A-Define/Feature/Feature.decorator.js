"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature = A_Feature;
const A_Container_storage_1 = require("../../../storage/A_Container.storage");
/**
 * A-Feature decorator
 *
 * This decorator allows to define a custom Feature stage for the Container.
 * These stages are executed in a container-specific order and can be extended by components that are injected into the container.
 * This approach allows to create a flexible and extendable architecture for the application.
 *
 * The main difference between the A-Feature and A-Feature decorators is that A-Feature methods can be inherited and overridden by child classes.
 *
 *
 * @param params
 * @returns
 */
function A_Feature(config = {}) {
    return function (target, propertyKey, descriptor) {
        const existedMeta = A_Container_storage_1.A_CONTAINER_Storage.get(target.constructor) || new Map();
        const inheritMeta = A_Container_storage_1.A_CONTAINER_Storage.get(Object.getPrototypeOf(target.constructor)) || new Map();
        const inheritedFeature = inheritMeta.get(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Feature) || new Map();
        const feature = existedMeta.get(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Feature) || new Map(inheritedFeature);
        feature.set(propertyKey, {
            handler: propertyKey,
            config: Object.assign({ name: propertyKey }, config)
        });
        // targetInstructions.push({
        //     handler: propertyKey,
        //     config: A_CommonHelper.deepCloneAndMerge(config, A_CONSTANTS__DEFAULT_CONCEPT_Feature_METHOD_DECLARATION_CONFIG)
        // });
        existedMeta.set(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Feature, feature);
        A_Container_storage_1.A_CONTAINER_Storage.set(target.constructor, existedMeta);
    };
}
//# sourceMappingURL=Feature.decorator.js.map