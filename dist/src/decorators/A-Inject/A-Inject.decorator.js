"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Inject = A_Inject;
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Component_types_1 = require("../../global/A-Component/A-Component.types");
const A_Meta_class_1 = require("../../global/A-Meta/A-Meta.class");
// ====================== BASE FUNCTION ======================
function A_Inject(param1) {
    return function (target, methodName, parameterIndex) {
        const method = methodName ? String(methodName) : 'constructor';
        console.log('target: ', target);
        const existedMeta = A_Context_class_1.A_Context
            .meta(target)
            .get(A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS)
            || new A_Meta_class_1.A_Meta();
        const paramsArray = existedMeta.get(method) || [];
        paramsArray[parameterIndex] = param1;
        existedMeta.set(method, paramsArray);
        A_Context_class_1.A_Context
            .meta(target)
            .set(A_Component_types_1.A_TYPES__ComponentMetaKey.INJECTIONS, existedMeta);
    };
}
//# sourceMappingURL=A-Inject.decorator.js.map