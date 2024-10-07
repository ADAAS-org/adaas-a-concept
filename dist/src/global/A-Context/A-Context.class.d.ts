import { A_Namespace } from "../A-Namespace/A_Namespace.class";
import { A_Component } from "../A-Component/A-Component.class";
/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 *
 */
export declare class A_Context {
    static instance: A_Context;
    /**
     * Stores all the Namespaces by namespace.
     * There might be a Namespaces of the same type but with different namespaces.
     * That might be useful for the cases when you need to have multiple instances of the same Namespace e.g.
     * - multiple http servers
     * - multitenant applications
     * - etc.
     */
    namespaced: Map<string, A_Namespace>;
    /**
     * Stores the singleton Namespaces.
     * Singleton Namespaces are the Namespaces that are used only once in the program.
     * In most cases, the singleton Namespace is the main Namespace of the program.
     * It could be :
     * - the main Namespace of the Program
     * - the authentication Namespace
     * - the main database Namespace
     * - etc.
     */
    singleton: WeakMap<{
        new (...args: any[]): A_Namespace;
    }, A_Namespace>;
    /**
     * Stores the components that are used in the program.
     */
    components: Map<string, any>;
    /**
     * Root Namespace is a Namespace that is used to run the program.
     */
    private _root;
    private constructor();
    /**
     * Get the instance of the Namespace Provider.
     *
     * @returns
     */
    static getInstance(): A_Context;
    static get root(): string;
    static get environment(): 'server' | 'browser';
    /**
     * Register a Namespace in the provider.
     * @param Namespace
     */
    static register(Namespace: A_Namespace): string;
    static register(Namespace: A_Namespace, namespace?: string): string;
    /**
     * Get the Namespace by namespace.
     * @param namespace
     */
    static get(namespace: string): A_Namespace<any> | undefined;
    /**
     * Resolve the Component by Class.
     *
     * @param component
     */
    static resolve<T extends A_Component>(component: {
        new (...args: any[]): T;
    }): T;
    static resolve<T extends A_Namespace>(namespace: {
        new (...args: any[]): T;
    }): T;
    static resolve<T extends A_Namespace>(namespaces: Array<{
        new (...args: any[]): T;
    }>): Array<T>;
    static resolve<T extends A_Namespace>(namespace: {
        new (...args: any[]): T;
    }, name: string): T;
    private static resolveComponent;
    /**
     *
     * Allowing to resolve the Namespace by Class and Name.
     *
     * @param namespace
     * @param name
     */
    private static resolveNamespace;
}
