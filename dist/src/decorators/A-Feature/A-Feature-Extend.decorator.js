"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Extend = A_Feature_Extend;
exports.buildTargetRegexp = buildTargetRegexp;
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
function A_Feature_Extend(param1) {
    return function (target, propertyKey, descriptor) {
        let targetRegexp;
        let behavior = 'sync';
        let before = [];
        let after = [];
        let include = [];
        let exclude = [];
        // Check if the config is a RegExp
        if (param1 instanceof RegExp) {
            targetRegexp = param1;
        }
        else if (!!param1 && typeof param1 === 'object') {
            if (Array.isArray(param1.scope))
                include = param1.scope;
            else if (!!param1.scope && typeof param1.scope === 'object') {
                if (Array.isArray(param1.scope.include))
                    include = param1.scope.include;
                if (Array.isArray(param1.scope.exclude))
                    exclude = param1.scope.exclude;
            }
            targetRegexp = buildTargetRegexp(param1, include, exclude, propertyKey);
            behavior = param1.behavior || behavior;
            before = param1.before || before;
            after = param1.after || after;
        }
        else {
            targetRegexp = new RegExp(`^.*\\.${propertyKey}$`);
        }
        const existedDefinitions = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_types_1.A_TYPES__ComponentMetaKey.FEATURES);
        // Get the existed metadata or create a new one
        const existedMeta = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS)
            || new A_Meta_class_1.A_Meta();
        if (existedDefinitions
            && existedDefinitions.size()
            && existedDefinitions.has(propertyKey)
            && existedDefinitions.get(propertyKey).invoke) {
            throw new Error(`A-Feature-Extend cannot be used on the method "${propertyKey}" because it is already defined as a Feature with "invoke" set to true.
            Please remove the A-Feature-Extend decorator or set "invoke" to false in the A-Feature decorator.`);
        }
        const existedMetaValue = existedMeta.get(targetRegexp.source) || [];
        // Add the new method to the metadata
        existedMetaValue.push({
            name: targetRegexp.source,
            handler: propertyKey,
            behavior,
            before,
            after
        });
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(A_Component_types_1.A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}
function buildTargetRegexp(param1, include, exclude, propertyKey) {
    const includePart = include.length
        ? `(${include.map(el => el.name).join('|')})`
        : `.*`;
    const excludePart = exclude.length
        ? `(?!${exclude.map(el => el.name).join('|')})`
        : ``;
    const pattern = param1.scope
        ? `^${excludePart}${includePart}\\.${param1.name || propertyKey}$`
        : `.*\\.${param1.name || propertyKey}$`;
    return new RegExp(pattern);
}
//# sourceMappingURL=A-Feature-Extend.decorator.js.map