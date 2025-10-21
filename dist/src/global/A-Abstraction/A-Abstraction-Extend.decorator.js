"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Abstraction_Extend = A_Abstraction_Extend;
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Container_constants_1 = require("../A-Container/A-Container.constants");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
const A_Abstraction_error_1 = require("./A-Abstraction.error");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
/**
 * A-Abstraction Extend decorator allows to extends behavior of each concept abstraction execution.
 * In case some components or containers requires to extend the behavior of the abstraction like 'start', 'build' or 'deploy'
 * for example, this decorator allows to do so.
 *
 * @param name - abstraction name
 * @param config - configuration of the abstraction extension
 * @returns
 */
function A_Abstraction_Extend(
/**
 * Name of the Concept Abstraction to extend
 */
name, 
/**
 * Configuration of the Abstraction Extension
 *
 */
config = {}) {
    return function (target, propertyKey, descriptor) {
        var _a;
        // for error messages
        const componentName = ((_a = target === null || target === void 0 ? void 0 : target.constructor) === null || _a === void 0 ? void 0 : _a.name) || String(target) || 'UnknownComponent';
        if (!name)
            throw new A_Abstraction_error_1.A_AbstractionError(A_Abstraction_error_1.A_AbstractionError.AbstractionExtensionError, `Abstraction name must be provided to extend abstraction for '${componentName}'.`);
        //  Only Containers and Components can extend Concept Abstractions
        if (!A_TypeGuards_helper_1.A_TypeGuards.isConstructorAvailableForAbstraction(target)) {
            throw new A_Abstraction_error_1.A_AbstractionError(A_Abstraction_error_1.A_AbstractionError.AbstractionExtensionError, `Unable to extend Abstraction '${name}' for '${componentName}'. Only A-Containers and A-Components can extend Abstractions.`);
        }
        let metaKey;
        const meta = A_Context_class_1.A_Context.meta(target);
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerConstructor(target):
                metaKey = A_Container_constants_1.A_TYPES__ContainerMetaKey.ABSTRACTIONS;
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(target):
                metaKey = A_Component_constants_1.A_TYPES__ComponentMetaKey.ABSTRACTIONS;
                break;
        }
        // Get the existed metadata or create a new one
        const existedMeta = meta.get(metaKey) || new A_Meta_class_1.A_Meta();
        // Set the metadata of the method to define a custom Stage with name
        const existedMetaValue = existedMeta.get(name) || [];
        // Add the new method to the metadata
        existedMetaValue.push({
            name,
            handler: propertyKey,
            before: config.before || [],
            after: config.after || [],
            behavior: config.behavior || 'sync'
        });
        // Set the metadata of the method to define a custom Feature with name
        existedMeta.set(name, existedMetaValue);
        //  Update the metadata of the container with the new Stage definition
        A_Context_class_1.A_Context
            .meta(target)
            .set(metaKey, existedMeta);
    };
}
//# sourceMappingURL=A-Abstraction-Extend.decorator.js.map