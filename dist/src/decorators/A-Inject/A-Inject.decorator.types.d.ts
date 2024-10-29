export type A_TYPES__A_InjectDecoratorDescriptor = TypedPropertyDescriptor<(...args: any[]) => Promise<void>>;
export type A_TYPES__A_InjectDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
export type A_TYPES__A_InjectDecoratorStorageInstruction = Array<{
    new (...args: any[]): any;
}>;
