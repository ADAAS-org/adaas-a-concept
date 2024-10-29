import { A_Container } from "../../global/A-Container/A-Container.class";
export type A_TYPES__A_ExtendDecoratorDescriptor = TypedPropertyDescriptor<() => any> | TypedPropertyDescriptor<(...args: any[]) => any> | TypedPropertyDescriptor<(...args: any[]) => Promise<any>> | TypedPropertyDescriptor<() => Promise<any>>;
export type A_TYPES__A_ExtendDecoratorConfig = {
    /**
     * Name of the container Lifecycle method to be extended.
     *
     * [!] If not provided will be used the name of the method.
     */
    name: string;
    /**
     * Container class or container name uses to identify the proper container in case when the name is not unique.
     *
     * [!] If not provided will be applied to all containers with the same name.
     */
    container: string | typeof A_Container;
};
export type A_TYPES__A_ExtendDecoratorStorageInstruction = {
    name: string;
    container: string;
    handler: string;
};
