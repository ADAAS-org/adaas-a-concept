import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Entity } from "../../global/A-Entity/A-Entity.class";
import { A_Feature } from "../../global/A-Feature/A-Feature.class";
import { A_FeatureCaller } from "../../global/A-Feature/A-FeatureCaller.class";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
export type A_TYPES__A_InjectDecoratorDescriptor = TypedPropertyDescriptor<(...args: any[]) => Promise<void>>;
export type A_TYPES__A_InjectDecoratorReturn<T = any> = (target: T, propertyKey: string | symbol | undefined, parameterIndex: number) => void;
export type A_TYPES__A_InjectDecoratorStorageInstruction = Array<{
    new (...args: any[]): any;
}>;
export type A_TYPES__A_InjectDecorator_Meta = Array<{
    target: A_TYPES__A_InjectDecorator_Injectable;
} | {
    target: {
        new (...args: any[]): A_Entity;
    };
    instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>;
}>;
export type A_TYPES__A_InjectDecorator_Injectable = {
    new (...args: any[]): A_Fragment;
} | {
    new (...args: any[]): A_Component;
} | {
    new (...args: any[]): A_Container;
} | {
    new (...args: any[]): A_Scope;
} | {
    new (...args: any[]): A_Feature;
} | {
    new (...args: any[]): A_Entity;
} | {
    new (...args: any[]): A_FeatureCaller;
};
export type A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T extends A_Entity = A_Entity> = {
    query: Partial<A_TYPES__A_InjectDecorator_EntityInjectionQuery<T>>;
    pagination: Partial<A_TYPES__A_InjectDecorator_EntityInjectionPagination>;
};
export type A_TYPES__A_InjectDecorator_EntityInjectionQuery<T extends A_Entity = A_Entity> = {
    aseid: string;
} & {
    [key in keyof T]?: any;
};
export type A_TYPES__A_InjectDecorator_EntityInjectionPagination = {
    count: number;
    from: 'start' | 'end';
};
