export type A_TYPES__A_LifecycleDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
export type A_TYPES__A_LifecycleDecoratorConfig = {
    name: string;
};
export type A_TYPES__A_LifecycleDecoratorStorageInstruction = {
    handler: string;
    config: A_TYPES__A_LifecycleDecoratorConfig;
};
