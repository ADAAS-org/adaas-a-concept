declare function RegisterLazyMethod(target: any, propertyKey: string, descriptor: PropertyDescriptor): PropertyDescriptor;
export declare function A_Lazy(params: {
    source: string;
}): typeof RegisterLazyMethod;
export {};
