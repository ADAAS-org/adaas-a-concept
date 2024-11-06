"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Extend = A_Feature_Extend;
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
function A_Feature_Extend(param1) {
    return function (target, propertyKey, descriptor) {
        let targetRegexp;
        // Check if the config is a RegExp
        if (param1 instanceof RegExp) {
            targetRegexp = param1;
        }
        else if (!!param1) {
            targetRegexp = new RegExp(`^(${(param1.scope || [])
                .map(el => el.name)
                .join('|')})\.${param1.name || propertyKey}$`);
        }
        else {
            targetRegexp = new RegExp(`^.*\\.${propertyKey}$`);
        }
        // Get the existed metadata or create a new one
        const existedMeta = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new A_Meta_class_1.A_Meta();
        const existedMetaValue = existedMeta.get(targetRegexp.source) || [];
        // Add the new method to the metadata
        existedMetaValue.push({
            name: targetRegexp.source,
            handler: propertyKey,
        });
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}
//# sourceMappingURL=A-Feature-Extend.decorator.js.map