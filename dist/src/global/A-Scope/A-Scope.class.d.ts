import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__ComponentMeta_InjectionParam } from "../A-Component/A-Component.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
/**
 *
 *
 * A_Scope refers to the visibility and accessibility of :
 * - variables,
 * - Components,
 * - Context Fragments
 * - and objects in different parts of your code.
 * Scope determines where a particular piece of data (like a variable or function)
 * can be accessed, modified, or referenced, and it plays a crucial role in avoiding naming collisions and ensuring data integrity.
 *
 *
 */
export declare class A_Scope {
    name: string;
    private _components;
    private _fragments;
    private _entities;
    private parent?;
    protected params: A_TYPES__ScopeConstructor;
    constructor(params: Partial<A_TYPES__ScopeConstructor>, config?: Partial<A_TYPES__ScopeConfig>);
    private initComponents;
    private initFragments;
    get components(): (new (...args: any[]) => any)[];
    /**
     * This method is used to check if the component is available in the scope
     *
     * @param component
     * @returns
     */
    has(component: {
        new (...args: any[]): any;
    }): boolean;
    has(fragment: A_Fragment): boolean;
    /**
     * This method is used to get the component by class
     *
     * @param component
     * @returns
     */
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(component: T): InstanceType<T>;
    resolve<T extends A_TYPES__ComponentMeta_InjectionParam>(component: Array<T>): Array<InstanceType<T>>;
    private resolveOnce;
    private resolveFragment;
    private resolveScope;
    private resolveComponent;
    /**
     * This method is used to register the component in the scope
     *
     * @param fragment
     */
    register(fragment: A_Entity): void;
    register(fragment: A_Component): void;
    register(fragment: A_Fragment): void;
}
