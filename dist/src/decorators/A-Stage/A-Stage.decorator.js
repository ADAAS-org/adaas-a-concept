"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Stage = A_Stage;
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Container_types_1 = require("../../global/A-Container/A-Container.types");
/**
 * A_Stage Decorator uses to extend basic A-Concept Stage methods inside Containers.
 *
 * Using this decorator you can define extend a logic and sequence of the Container Stage methods execution.
 *
 * @param params
 * @returns
 */
function A_Stage(method) {
    return function A_Stage(config = {}) {
        return function (target, propertyKey, descriptor) {
            // Get the existed metadata or create a new one
            const existedMeta = A_Context_class_1.A_Context
                .meta(target)
                .get(A_Container_types_1.A_TYPES__ContainerMetaKey.STAGES)
                || new Map();
            // Set the metadata of the method to define a custom Stage with name
            existedMeta
                .set(propertyKey, {
                name: method,
                handler: propertyKey,
            });
            //  Update the metadata of the container with the new Stage definition
            A_Context_class_1.A_Context
                .meta(target)
                .set(A_Container_types_1.A_TYPES__ContainerMetaKey.STAGES, existedMeta);
        };
    };
}
//# sourceMappingURL=A-Stage.decorator.js.map