"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Inject = A_Inject;
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Component_constants_1 = require("../A-Component/A-Component.constants");
const A_Container_constants_1 = require("../A-Container/A-Container.constants");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Inject_error_1 = require("./A-Inject.error");
function A_Inject(param1, param2) {
    //  pre call checks
    if (!param1) {
        throw new A_Inject_error_1.A_InjectError(A_Inject_error_1.A_InjectError.MissingInjectionTarget, `A-Inject decorator is missing the target to inject`);
    }
    return function (target, methodName, parameterIndex) {
        // for Error handling purposes
        const componentName = target.name || (target.constructor && target.constructor.name);
        if (!A_TypeGuards_helper_1.A_TypeGuards.isTargetAvailableForInjection(target)) {
            throw new A_Inject_error_1.A_InjectError(A_Inject_error_1.A_InjectError.InvalidInjectionTarget, `A-Inject cannot be used on the target of type ${typeof target} (${componentName})`);
        }
        // determine the method name or 'constructor' for constructor injections
        const method = methodName ? String(methodName) : 'constructor';
        let metaKey;
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isComponentConstructor(target) || A_TypeGuards_helper_1.A_TypeGuards.isComponentInstance(target):
                metaKey = A_Component_constants_1.A_TYPES__ComponentMetaKey.INJECTIONS;
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(target):
                metaKey = A_Container_constants_1.A_TYPES__ContainerMetaKey.INJECTIONS;
                break;
        }
        // get existing meta or create a new one
        const existedMeta = A_Context_class_1.A_Context.meta(target).get(metaKey) || new A_Meta_class_1.A_Meta();
        // get existing injections for the method or create a new array
        const paramsArray = existedMeta.get(method) || [];
        // set the parameter injection info
        paramsArray[parameterIndex] = {
            target: param1,
            instructions: param2
        };
        // save back the updated injections array
        existedMeta.set(method, paramsArray);
        // save back the updated meta info
        A_Context_class_1.A_Context
            .meta(target)
            .set(metaKey, existedMeta);
    };
}
//# sourceMappingURL=A-Inject.decorator.js.map