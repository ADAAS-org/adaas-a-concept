"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Inject = A_Inject;
const A_Namespace_class_1 = require("../../global/A-Namespace/A_Namespace.class");
const A_Component_class_1 = require("../../global/A-Component/A-Component.class");
function A_Inject(param1) {
    switch (true) {
        case param1 instanceof A_Component_class_1.A_Component:
            return function (target, propertyKey, parameterIndex) {
                //  It should be just register the parameter in method that will be resolved in the method
            };
        case param1 instanceof A_Namespace_class_1.A_Namespace:
            return function (target, propertyKey, parameterIndex) {
                //  It should be just register the parameter in method that will be resolved in the method
            };
    }
    // const namespaces: Array<typeof A_Namespace> = [
    //     ...(Array.isArray(param1) ? param1 : [param1])
    // ];
    // const resolvedNamespaces: Array<A_Namespace> = []
    // for (const namespace of namespaces) {
    //     resolvedNamespaces.push(A_Context.resolve(namespace));
    // }
    // return function (
    //     target: T | E,
    //     propertyKey: string | symbol,
    //     parameterIndex: number
    // ) {
    //     //  It should be just register the parameter in method that will be resolved in the method
    // }
}
//# sourceMappingURL=A-Inject.decorator.js.map