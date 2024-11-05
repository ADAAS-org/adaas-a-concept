import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class"
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class"
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class"


export type A_TYPES__A_Feature_Extend = {
    (regexp: RegExp): MethodDecorator;
    (config: Partial<A_TYPES__A_ExtendDecoratorConfig>): MethodDecorator;
    (): MethodDecorator;
};

export type A_TYPES__A_FeatureDecoratorDescriptor =

    TypedPropertyDescriptor<() => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => Promise<any>>
    |
    TypedPropertyDescriptor<() => Promise<any>>


export type A_TYPES__A_FeatureDecoratorConfig = {
    name: string,
}



export type A_TYPES__A_ExtendDecoratorDescriptor =

    TypedPropertyDescriptor<() => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => any>
    |
    TypedPropertyDescriptor<(
        ...args: any[]
    ) => Promise<any>>
    |
    TypedPropertyDescriptor<() => Promise<any>>


export type A_TYPES__A_ExtendDecoratorConfig = {
    /**
     * Name of the container Lifecycle method to be extended.
     * 
     * [!] If not provided will be used the name of the method.
     * [!!] If name contains "." dot it will be considered as a path to the method.
     */
    name: string,
    /**
     * Container class or container name uses to identify the proper container in case when the name is not unique.
     * 
     * [!] If not provided will be applied to all containers with the same name.
     * [!!] By default uses OR to join all provided items. If you need more complex Logic, please use Regexp instead
     */
    scope: Array<
        { new(...args: any[]): A_Container<any> }
        | { new(...args: any[]): A_Entity }
        | { new(...args: any[]): A_Component }
    >
}





