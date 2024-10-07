function RegisterLazyMethod(
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) {
    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
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



export function A_Lazy(
    params: {
        source: string;
    }
) {
    return RegisterLazyMethod;
}
