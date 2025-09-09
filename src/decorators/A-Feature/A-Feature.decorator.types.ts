import { A_Channel } from "@adaas/a-concept/global/A-Channel/A-Channel.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class"
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class"
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class"
import { A_TYPES__A_StageStep } from "@adaas/a-concept/global/A-Stage/A-Stage.types";
import { A_TYPES__Required } from "@adaas/a-utils";


export type A_TYPES__A_Feature_Extend = {
    (regexp: RegExp): MethodDecorator;
    (config: Partial<A_TYPES__A_ExtendDecoratorConfig>): MethodDecorator;
    (): MethodDecorator;
};

export type A_TYPES__A_FeatureDecoratorDescriptor =
    TypedPropertyDescriptor<
        ((...args: any[]) => any)
        |
        ((...args: any[]) => Promise<any>)
        |
        (() => any)
        |
        (() => Promise<any>)
    >




export type A_TYPES__A_FeatureDecoratorConfig = {
    name: string,
    invoke: boolean,
    channel: Array<typeof A_Channel>
    template: Array<A_TYPES__A_FeatureTemplateItem>
}

export type A_TYPES__A_FeatureTemplateItem = A_TYPES__Required<Partial<A_TYPES__A_StageStep>, ['name', 'handler', 'component']>


export type A_TYPES__A_DefineDecorator_Meta = {
    name: string,
    handler: string,
    invoke: boolean,
    channel: Array<typeof A_Channel>
    template: Array<A_TYPES__A_StageStep>
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
     * 
     * [!!!] In case if you need to exclude some containers, entities or components, please use "exclude" property
     * 
     * Example:
     * 
     * ```ts
     *  @A_Feature.Extend({
     *      name: 'load',
     *      scope: {
     *          include: [A_Container1, A_Entity1],
     *          exclude: [A_Component1]
     *      }
     *  })
     * ```
     */
    scope: Array<A_TYPES__A_ExtendDecorator_ScopeItem> | Partial<A_TYPES__A_ExtendDecorator_ScopeConfig>,
} & A_TYPES__A_ExtendDecorator_BehaviorConfig

export type A_TYPES__A_ExtendDecorator_ScopeItem = { new(...args: any[]): A_Container }
    | { new(...args: any[]): A_Entity }
    | { new(...args: any[]): A_Component }


export type A_TYPES__A_ExtendDecorator_ScopeConfig = {
    include?: Array<A_TYPES__A_ExtendDecorator_ScopeItem>,
    exclude?: Array<A_TYPES__A_ExtendDecorator_ScopeItem>
}

export type A_TYPES__A_ExtendDecorator_BehaviorConfig = {
    /**
     * The behavior of the method. 
     * In case its async it will be executed independently from the main thread.
     * 
     * [!] However, in case of sync, it will be executed in the main thread.in the order of the declaration.
     * 
     */
    behavior: 'async' | 'sync'


    /**
     * Allows to define the order of the execution of the method.
     * 
     * [!] In case the method has circular dependencies it will Throw an error.
     * 
     */
    before: string[]

    /**
     * Allows to define the order of the execution of the method.
     * 
     * [!] In case the method has circular dependencies it will Throw an error.
     * 
     */
    after: string[]
}



export type A_TYPES__A_ExtendDecorator_Meta = {
    name: string,
    handler: string
} & A_TYPES__A_ExtendDecorator_BehaviorConfig





