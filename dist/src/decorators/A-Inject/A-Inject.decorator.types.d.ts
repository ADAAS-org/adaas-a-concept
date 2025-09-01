import { A_Component } from "../../global/A-Component/A-Component.class";
import { A_Container } from "../../global/A-Container/A-Container.class";
import { A_Entity } from "../../global/A-Entity/A-Entity.class";
import { A_Feature } from "../../global/A-Feature/A-Feature.class";
import { A_Fragment } from "../../global/A-Fragment/A-Fragment.class";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
import { ASEID } from "@adaas/a-utils";
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
};
export type A_TYPES__A_InjectDecorator_EntityInjectionInstructions = {
    query: Partial<A_TYPES__A_InjectDecorator_EntityInjectionQuery>;
    pagination: Partial<A_TYPES__A_InjectDecorator_EntityInjectionPagination>;
};
export type A_TYPES__A_InjectDecorator_EntityInjectionQuery = {
    aseid: string | ASEID;
    id: string;
    type: {
        new (...args: any[]): A_Entity;
    };
    entity: string;
};
export type A_TYPES__A_InjectDecorator_EntityInjectionPagination = {
    count: number;
    from: 'start' | 'end';
};
