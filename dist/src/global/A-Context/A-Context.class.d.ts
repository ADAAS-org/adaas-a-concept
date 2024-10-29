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
export declare class A_Context {
    static instance: A_Context;
    /**
     * A set of globally registered containers.
     */
    protected containers: WeakMap<A_Container<any>, A_Scope>;
    /**
     * A set of globally registered features.
     */
    protected features: WeakMap<A_Feature, A_Scope>;
    /**
     * A set of globally registered concepts.
     */
    protected concepts: WeakMap<A_Concept<any>, A_Scope>;
    /**
     * A set of allocated scopes per every element in the program.
     */
    protected conceptsMeta: Map<typeof A_Concept.constructor, A_Meta<any>>;
    protected containersMeta: Map<typeof A_Container.constructor, A_ContainerMeta>;
    protected componentsMeta: Map<typeof A_Container.constructor, A_ComponentMeta>;
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
    static allocate(component: any, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static allocate(feature: A_Feature, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static allocate(container: A_Container<any>, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static meta(container: typeof A_Container): A_ContainerMeta;
    static meta(container: A_Container<any>): A_ContainerMeta;
    static meta(component: typeof A_Component): A_ComponentMeta;
    static meta(component: A_Component): A_ComponentMeta;
    static meta<T extends Record<string, any>>(component: {
        new (...args: any[]): any;
    }): A_Meta<T>;
    static scope(concept: A_Concept): A_Scope;
    static scope(component: A_Container<any>): A_Scope;
    static scope(component: A_Feature): A_Scope;
    /**
     * Register a Namespace in the provider.
     * @param Namespace
     */
    static register(Namespace: A_Fragment): string;
    static register(Namespace: A_Fragment, namespace?: string): string;
}
