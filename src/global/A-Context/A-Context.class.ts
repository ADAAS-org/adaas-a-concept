import { A_CommonHelper, A_Polyfills } from "@adaas/a-utils";
import { A_Namespace } from "../A-Namespace/A_Namespace.class";
import { A_Component } from "../A-Component/A-Component.class";


/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *  
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 * 
 */
export class A_Context {


    static instance: A_Context;

    /**
     * Stores all the Namespaces by namespace.
     * There might be a Namespaces of the same type but with different namespaces.
     * That might be useful for the cases when you need to have multiple instances of the same Namespace e.g.
     * - multiple http servers
     * - multitenant applications
     * - etc.
     */
    namespaced: Map<string, A_Namespace> = new Map();

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
    singleton: WeakMap<{ new(...args: any[]): A_Namespace }, A_Namespace> = new WeakMap();


    /**
     * Stores the components that are used in the program.
     */
    components: Map<string, any> = new Map();

    /**
     * Root Namespace is a Namespace that is used to run the program.
     */
    private _root!: string


    private constructor() {

    }

    /**
     * Get the instance of the Namespace Provider.
     * 
     * @returns 
     */
    static getInstance() {
        if (!A_Context.instance) {
            A_Context.instance = new A_Context();
        }

        return A_Context.instance;
    }

    static get root(): string {
        return this.getInstance()._root;
    }

    static get environment(): 'server' | 'browser' {
        return A_Polyfills.env;
    }

    /**
     * Register a Namespace in the provider.
     * @param Namespace 
     */
    static register(Namespace: A_Namespace): string
    static register(
        Namespace: A_Namespace,
        namespace?: string
    ): string
    static register(
        param1: A_Namespace,
        param2?: A_Namespace | string,
    ): string {

        const instance = this.getInstance();

        let Namespace: A_Namespace;
        let namespace: string;

        if (typeof param2 === 'string') {
            namespace = param2;
            Namespace = param1;
        } else {
            Namespace = param1 as A_Namespace;
            namespace = Namespace.name;
        }

        /**
         * If the namespace is not provided, then use the root namespace.
         * If the root namespace is not provided, then use the default namespace.
         */
        if (!namespace)
            namespace = this.root
                || process.env.ADAAS_NAMESPACE
                || process.env.A_NAMESPACE
                || process.env.ADAAS_APP_NAMESPACE
                || 'a-concept'



        if (!this.root)
            instance._root = namespace;

        instance.namespaced.set(namespace, Namespace);

        return namespace;
    }






    /**
     * Get the Namespace by namespace.
     * @param namespace 
     */
    static get(namespace: string) {
        const instance = this.getInstance();

        return instance.namespaced.get(namespace)
    }





    /**
     * Resolve the Component by Class. 
     * 
     * @param component 
     */
    static resolve<T extends A_Component>(
        component: { new(...args: any[]): T }
    ): T
    static resolve<T extends A_Namespace>(
        namespace: { new(...args: any[]): T }
    ): T
    static resolve<
        T extends A_Namespace,
    >(
        namespaces: Array<{ new(...args: any[]): T }>
    ): Array<T>
    static resolve<T extends A_Namespace>(
        namespace: { new(...args: any[]): T },
        name: string
    ): T
    static resolve<
        T extends A_Namespace,
        K extends A_Component,
    >(
        param1: { new(...args: any[]): T } | { new(...args: any[]): K } | Array<{ new(...args: any[]): T }>,
        param2?: string
    ): T | K | Array<T> {

        switch (true) {

            // If the first parameter is a Namespace 
            case Array.isArray(param1) && param1.every(namespace => A_CommonHelper.isInheritedFrom(namespace, A_Namespace)):
                return param1.map(namespace => this.resolveNamespace(namespace));

            // If the first parameter is a Namespace and the second parameter is a string
            case !!param2 && typeof param1 === 'function' && A_CommonHelper.isInheritedFrom(param1, A_Namespace):
                return this.resolveNamespace(param1 as typeof A_Namespace, param2) as T;

            // If the first parameter is a Component
            case !!param2 && typeof param1 === 'function' && A_CommonHelper.isInheritedFrom(param1, A_Component):
                return this.resolveComponent(param1 as { new(...args: any[]): A_Component }) as K;

            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }
    }



    private static resolveComponent<T extends A_Component>(
        component: { new(...args: any[]): T }
    ): T {
        const instance = this.getInstance();

        return instance.components.get(component.name) as T;
    }



    /**
     * 
     * Allowing to resolve the Namespace by Class and Name.
     * 
     * @param namespace 
     * @param name 
     */
    private static resolveNamespace<T extends A_Namespace>(
        namespace: { new(...args: any[]): T },
        name: string
    ): T
    private static resolveNamespace<T extends A_Namespace>(
        namespace: { new(...args: any[]): T }
    ): T
    private static resolveNamespace<T extends A_Namespace>(
        param1: { new(...args: any[]): T },
        param2?: string
    ): T {
        const instance = this.getInstance();

        return instance.namespaced.get(
            param2 || param1.name
        ) as T;
    }



}