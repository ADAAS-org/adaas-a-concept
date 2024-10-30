import { A_CommonHelper, A_Polyfills, A_TYPES__Dictionary } from "@adaas/a-utils";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_ComponentMeta } from "../A-Component/A-Component.meta";
import { A_ContainerMeta } from "../A-Container/A-Container.meta";
import { A_Concept } from "../A-Concept/A_Concept.class";


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
     * A set of globally registered containers.
     */
    protected containers: WeakMap<A_Container<any>, A_Scope> = new WeakMap();

    /**
     * A set of globally registered features.
     */
    protected features: WeakMap<A_Feature, A_Scope> = new WeakMap();

    /**
     * A set of globally registered concepts.
     */
    protected concepts: WeakMap<A_Concept<any>, A_Scope> = new WeakMap();



    /**
     * A set of allocated scopes per every element in the program.
     */
    // protected scopes: WeakMap<A_Container<any> | A_Feature | A_Component | any, A_Scope> = new WeakMap();

    protected conceptsMeta: Map<typeof A_Concept.constructor, A_Meta<any>> = new Map();
    protected containersMeta: Map<typeof A_Container.constructor, A_ContainerMeta> = new Map();
    protected componentsMeta: Map<typeof A_Container.constructor, A_ComponentMeta> = new Map();
    // uses to allow to store custom meta data
    protected customMeta: Map<typeof A_Container.constructor, A_Meta<any>> = new Map();


    /**
     * Root Namespace is a Namespace that is used to run the program.
     */
    private _root!: string


    private constructor() { }



    // ===================================================================================================
    // ================================ META OPERATIONS ==================================================
    // ===================================================================================================



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




    static allocate(
        component: any,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        feature: A_Feature,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        container: A_Container<any>,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        param1: A_Container<any> | A_Feature | A_Component | any,
        param2: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope {

        const instance = this.getInstance();

        const newScope = new A_Scope(param2, param2);

        switch (true) {
            case param1 instanceof A_Container:
                instance.containers.set(param1, newScope);
                break;

            case param1 instanceof A_Feature:
                instance.features.set(param1, newScope);
                break;

            case param1 instanceof A_Concept:
                instance.concepts.set(param1, newScope);
                break;


            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }


        return newScope;
    }




    static meta(
        container: typeof A_Container,
    ): A_ContainerMeta
    static meta(
        container: A_Container<any>,
    ): A_ContainerMeta
    static meta(
        component: typeof A_Component,
    ): A_ComponentMeta
    static meta(
        component: A_Component,
    ): A_ComponentMeta
    static meta<T extends Record<string, any>>(
        component: { new(...args: any[]): any },
    ): A_Meta<T>
    static meta<T extends Record<string, any>>(
        param1: typeof A_Container | A_Container<any> | { new(...args: any[]): any } | A_Component | typeof A_Component,
    ): A_ContainerMeta | A_ComponentMeta | A_Meta<T> {
        const instance = this.getInstance();

        let metaStorage: WeakMap<typeof A_Container.constructor, A_Meta<any>>;
        let property: Function;

        let meta: A_Meta<any>;


        switch (true) {
            case param1 instanceof A_Container: {

                metaStorage = instance.containersMeta;
                property = param1.constructor;


                if (!metaStorage.has(property)) {
                    const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new A_ContainerMeta();
                    metaStorage.set(property, new A_ContainerMeta().from(inheritMeta));
                }

                meta = metaStorage.get(property)!;

                break;
            }

            case A_CommonHelper.isInheritedFrom(param1, A_Container): {
                metaStorage = instance.containersMeta;
                property = param1 as typeof A_Container<any>;

                if (!metaStorage.has(property)) {
                    const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new A_ContainerMeta();
                    metaStorage.set(property, new A_ContainerMeta().from(inheritMeta));
                }

                meta = metaStorage.get(property)!;

                break;
            }

            case param1 instanceof A_Component: {
                metaStorage = instance.componentsMeta;
                property = param1.constructor;


                if (!metaStorage.has(property)) {
                    const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new A_ComponentMeta();
                    metaStorage.set(property, new A_ComponentMeta().from(inheritMeta));
                }

                meta = metaStorage.get(property)!;

                break;
            }

            case A_CommonHelper.isInheritedFrom(param1, A_Component): {
                metaStorage = instance.componentsMeta;
                property = param1 as typeof A_Component;


                if (!metaStorage.has(property)) {
                    const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new A_ComponentMeta();
                    metaStorage.set(property, new A_ComponentMeta().from(inheritMeta));
                }

                meta = metaStorage.get(property)!;

                break;
            }

            default: {
                metaStorage = instance.customMeta;
                property = typeof (param1 as any) === 'function' ? param1 : param1.constructor;

                if (!metaStorage.has(property)) {
                    const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new A_Meta();
                    metaStorage.set(property, new A_Meta().from(inheritMeta));
                }

                meta = metaStorage.get(property)!;

                break;
            }
        }

        // const inheritMeta: T = metaStorage.get(Object.getPrototypeOf(property))  || new A_Meta() as T;
        // // we just know that the type of parent meta is the same as the type of the current meta
        // const meta = metaStorage.get(property);

        return meta!;
    }





    static scope(
        concept: A_Concept
    ): A_Scope
    static scope(
        component: A_Container<any>
    ): A_Scope
    static scope(
        component: A_Feature
    ): A_Scope
    static scope(
        param1: A_Feature | A_Container<any> | A_Concept
    ): A_Scope | undefined {

        const instance = this.getInstance();

        switch (true) {
            case param1 instanceof A_Container:
                return instance.containers.get(param1);

            case param1 instanceof A_Feature:
                return instance.features.get(param1);


            case param1 instanceof A_Concept:
                return instance.concepts.get(param1);

            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }
    }



    /**
     * Register a Namespace in the provider.
     * @param Namespace 
     */
    static register(Namespace: A_Fragment): string
    static register(
        Namespace: A_Fragment,
        namespace?: string
    ): string
    static register(
        param1: A_Fragment,
        param2?: A_Fragment | string,
    ): string {

        const instance = this.getInstance();

        let fragment: A_Fragment;
        let name: string;

        if (typeof param2 === 'string') {
            name = param2;
            fragment = param1;
        } else {
            fragment = param1 as A_Fragment;
            name = fragment.name;
        }

        /**
         * If the namespace is not provided, then use the root namespace.
         * If the root namespace is not provided, then use the default namespace.
         */
        if (!name)
            name = this.root
                || process.env.ADAAS_NAMESPACE
                || process.env.A_NAMESPACE
                || process.env.ADAAS_APP_NAMESPACE
                || 'a-concept'



        if (!this.root)
            instance._root = name;

        // instance.namedFragments.set(namespace, Namespace);

        return name;
    }
}