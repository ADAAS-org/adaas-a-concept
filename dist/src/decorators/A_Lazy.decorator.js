"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Lazy = A_Lazy;
function RegisterLazyMethod(target, propertyKey, descriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = function (...args) {
        console.log(`Intercepted call to method: ${propertyKey}`);
        console.log(`Arguments: `, args);
        // You can modify args or do something else here
        const result = originalMethod.apply(this, args);
        // You can also modify the return value
        console.log(`Result: `, result);
        return result;
    };
    return descriptor;
}
function A_Lazy(params) {
    return RegisterLazyMethod;
}
//# sourceMappingURL=A_Lazy.decorator.js.map