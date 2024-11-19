"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Connect = A_Connect;
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
function A_Connect(channel, config) {
    return function (target, methodName, parameterIndex) {
        const meta = A_Context_class_1.A_Context.meta(target);
        let metaKey;
        // // Get the existed metadata or create a new one
        // const existedMeta: A_Meta<{
        //     [Key: string]: A_TYPES__ContainerMeta_StageExtension[];
        // }> = meta.get(metaKey) || new A_Meta();
        // // Set the metadata of the method to define a custom Stage with name
        // const existedMetaValue = existedMeta.get(StageKey) || [];
        // // Add the new method to the metadata
        // existedMetaValue.push({
        //     name: method,
        //     handler: propertyKey,
        // });
        // // Set the metadata of the method to define a custom Feature with name
        // existedMeta.set(StageKey, existedMetaValue);
        // //  Update the metadata of the container with the new Stage definition
        // A_Context
        //     .meta(target as any)
        //     .set(
        //         metaKey,
        //         existedMeta
        //     );
    };
}
//# sourceMappingURL=A-Connect.decorator.js.map