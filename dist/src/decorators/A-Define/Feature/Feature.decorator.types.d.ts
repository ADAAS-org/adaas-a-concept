export type A_TYPES__A_FeatureDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
export type A_TYPES__A_FeatureDecoratorConfig = {
    name: string;
};
export type A_TYPES__A_FeatureDecoratorStorageInstruction = {
    handler: string;
    config: A_TYPES__A_FeatureDecoratorConfig;
};
