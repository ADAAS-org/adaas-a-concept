"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Lifecycle = A_Lifecycle;
const A_Container_storage_1 = require("../../../storage/A_Container.storage");
function A_Lifecycle(config = {}) {
    return function (target, propertyKey, descriptor) {
        const existedMeta = A_Container_storage_1.A_CONTAINER_Storage.get(target.constructor) || new Map();
        const inheritMeta = A_Container_storage_1.A_CONTAINER_Storage.get(Object.getPrototypeOf(target.constructor)) || new Map();
        const inheritedLifecycle = inheritMeta.get(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Lifecycle) || new Map();
        const lifecycle = existedMeta.get(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Lifecycle) || new Map(inheritedLifecycle);
        lifecycle.set(propertyKey, {
            handler: propertyKey,
            config: Object.assign(Object.assign({}, config), { name: `${target.constructor.name}.${propertyKey || config.name}` })
            // config: A_CommonHelper.deepCloneAndMerge(config, A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG)
        });
        // targetInstructions.push({
        //     handler: propertyKey,
        //     config: A_CommonHelper.deepCloneAndMerge(config, A_CONSTANTS__DEFAULT_CONCEPT_LIFECYCLE_METHOD_DECLARATION_CONFIG)
        // });
        existedMeta.set(A_Container_storage_1.A_CONTAINER_STORAGE__Definition__Lifecycle, lifecycle);
        A_Container_storage_1.A_CONTAINER_Storage.set(target.constructor, existedMeta);
    };
}
//# sourceMappingURL=Lifecycle.decorator.js.map