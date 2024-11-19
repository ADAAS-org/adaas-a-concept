import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions, A_TYPES__A_InjectDecorator_Injectable } from "../../decorators/A-Inject/A-Inject.decorator.types";
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
    private initEntities;
    private initFragments;
    get components(): (new (...args: any[]) => A_Component)[];
    get fragments(): A_Fragment[];
    /**
     * This method is used to check if the component is available in the scope
     *
     * @param component
     * @returns
     */
    has(component: typeof A_Component): boolean;
    has(entity: typeof A_Entity): boolean;
    has(fragment: typeof A_Fragment): boolean;
    /**
     * This method is used to get the component by class
     *
     * @param component
     * @returns
     */
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(component: T): InstanceType<T>;
    resolve<T extends {
        new (...args: any[]): A_Entity;
    }>(entity: T, instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions>): InstanceType<T>;
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(component: Array<T>): Array<InstanceType<T>>;
    private resolveOnce;
    private resolveEntity;
    private resolveFragment;
    private resolveScope;
    private resolveComponent;
    /**
     * This method is used to register the component in the scope
     *
     * @param fragment
     */
    register(entity: A_Entity): void;
    register(component: A_Component): void;
    register(fragment: A_Fragment): void;
    toJSON(): Record<string, any>;
}
