"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Inject = A_Inject;
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Container_types_1 = require("../../global/A-Container/A-Container.types");
const a_utils_1 = require("@adaas/a-utils");
// ====================== BASE FUNCTION ======================
function A_Inject(param1, param2) {
    return function (target, methodName, parameterIndex) {
        const method = methodName ? String(methodName) : 'constructor';
        let metaKey;
        switch (true) {
            case target instanceof A_Component_class_1.A_Component:
                metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS;
                break;
            case a_utils_1.A_CommonHelper.isInheritedFrom(target, A_Component_class_1.A_Component):
                metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS;
                break;
            case a_utils_1.A_CommonHelper.isInheritedFrom(target, A_Container_class_1.A_Container):
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.INJECTIONS;
                break;
            case target instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.INJECTIONS;
                break;
            default:
                throw new Error(`A-Inject cannot be defined on the ${target} level`);
        }
        const existedMeta = A_Context_class_1.A_Context
            .meta(target)
            .get(metaKey)
            || new A_Meta_class_1.A_Meta();
        const paramsArray = existedMeta.get(method) || [];
        paramsArray[parameterIndex] = {
            target: param1,
            instructions: param2
        };
        existedMeta.set(method, paramsArray);
        A_Context_class_1.A_Context
            .meta(target)
            .set(metaKey, existedMeta);
    };
}
//# sourceMappingURL=A-Inject.decorator.js.map