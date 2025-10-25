"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Feature_Extend = A_Feature_Extend;
exports.buildTargetRegexp = buildTargetRegexp;
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
const A_Feature_error_1 = require("./A-Feature.error");
function A_Feature_Extend(param1) {
    return function (target, propertyKey, descriptor) {
        var _a;
        // for error messages
        const componentName = ((_a = target === null || target === void 0 ? void 0 : target.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(target) || 'Unknown';
        if (!A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureExtension(target))
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureExtensionError, `A-Feature-Extend cannot be applied on the ${componentName} level`);
        let targetRegexp;
        let behavior = 'sync';
        let before = '';
        let after = '';
        let override = '';
        let include = [];
        let exclude = [];
        let throwOnError = true;
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isRegExp(param1):
                targetRegexp = param1;
                break;
            case !!param1 && typeof param1 === 'object':
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
                throwOnError = param1.throwOnError !== undefined ? param1.throwOnError : throwOnError;
                before = A_TypeGuards_helper_1.A_TypeGuards.isArray(param1.before)
                    ? new RegExp(`^${param1.before.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.before instanceof RegExp
                        ? param1.before.source
                        : '';
                after = A_TypeGuards_helper_1.A_TypeGuards.isArray(param1.after)
                    ? new RegExp(`^${param1.after.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.after instanceof RegExp
                        ? param1.after.source
                        : '';
                override = A_TypeGuards_helper_1.A_TypeGuards.isArray(param1.override)
                    ? new RegExp(`^${param1.override.join('|').replace(/\./g, '\\.')}$`).source
                    : param1.override instanceof RegExp
                        ? param1.override.source
                        : '';
                break;
            default:
                targetRegexp = new RegExp(`^.*${propertyKey.replace(/\./g, '\\.')}$`);
                break;
        }
        const existedDefinitions = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_constants_1.A_TYPES__ComponentMetaKey.FEATURES);
        // Get the existed metadata or create a new one
        const meta = A_Context_class_1.A_Context
            .meta(target);
        const existedMeta = meta.get(A_Component_constants_1.A_TYPES__ComponentMetaKey.EXTENSIONS)
            ? new A_Meta_class_1.A_Meta().from(meta.get(A_Component_constants_1.A_TYPES__ComponentMetaKey.EXTENSIONS))
            : new A_Meta_class_1.A_Meta();
        if (existedDefinitions
            && existedDefinitions.size()
            && existedDefinitions.has(propertyKey)
            && existedDefinitions.get(propertyKey).invoke) {
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureExtensionError, `A-Feature-Extend cannot be used on the method "${propertyKey}" because it is already defined as a Feature with "invoke" set to true. Please remove the A-Feature-Extend decorator or set "invoke" to false in the A-Feature decorator.`);
        }
        const existedMetaValue = [
            ...(existedMeta.get(targetRegexp.source) || [])
        ];
        const existedIndex = existedMetaValue.findIndex(item => item.handler === propertyKey);
        const extension = {
            name: targetRegexp.source,
            handler: propertyKey,
            behavior,
            before,
            after,
            throwOnError,
            override
        };
        if (existedIndex !== -1) {
            // Update the existing method in the metadata
            existedMetaValue[existedIndex] = extension;
        }
        else {
            // Add the new method to the metadata
            existedMetaValue.push(extension);
        }
        // Add the new method to the metadata
        existedMetaValue.push();
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(targetRegexp.source, existedMetaValue);
        //  Update the metadata of the container with the new Feature definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(A_Component_constants_1.A_TYPES__ComponentMetaKey.EXTENSIONS, existedMeta);
    };
}
/**
 * Builds a target regular expression based on the provided parameters.
 *
 * @param param1 - The first parameter, which can be a string or an object.
 * @param include - An array of items to include in the regular expression.
 * @param exclude - An array of items to exclude from the regular expression.
 * @param propertyKey - The property key to use in the regular expression.
 * @returns A regular expression object.
 */
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