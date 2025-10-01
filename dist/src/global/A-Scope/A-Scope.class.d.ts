import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "./A-Scope.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions, A_TYPES__A_InjectDecorator_Injectable } from "../../decorators/A-Inject/A-Inject.decorator.types";
import { A_Command } from "../A-Command/A-Command.class";
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
    readonly name: string;
    private _components;
    private _fragments;
    private _commands;
    private _entities;
    private _parent?;
    protected params: A_TYPES__ScopeConstructor;
    constructor(params: Partial<A_TYPES__ScopeConstructor>, config?: Partial<A_TYPES__ScopeConfig>);
    private initComponents;
    private initEntities;
    private initFragments;
    get components(): (new (...args: any[]) => A_Component)[];
    get commands(): (new (...args: any[]) => A_Command)[];
    get fragments(): A_Fragment[];
    parent(setValue: A_Scope): void;
    parent(): A_Scope;
    isInheritedFrom(scope: A_Scope): boolean;
    inherit(parent: A_Scope): A_Scope;
    /**
     * Helper method to check circular inheritance
     * Should return a full sequence of inheritance for logging purposes
     *
     * @param scope
     * @returns
     */
    checkCircularInheritance(scope: A_Scope): Array<string> | false;
    printInheritanceChain(): void;
    /**
     * This method is used to check if the component is available in the scope
     *
     * @param component
     * @returns
     */
    has<T extends A_Component>(component: new (...args: any[]) => T): boolean;
    has<T extends A_Entity>(entity: new (...args: any[]) => T): boolean;
    has<T extends A_Fragment>(fragment: new (...args: any[]) => T): boolean;
    has(constructor: string): boolean;
    /**
     * Merges two scopes into a new one
     *
     * [!] Notes:
     *  - this method does NOT modify the existing scopes
     *  - parent of the new scope will be the parent of the current scope or the parent of anotherScope (if exists)
     *
     * @param anotherScope
     * @returns
     */
    merge(anotherScope: A_Scope): A_Scope;
    /**
     * Allows to retrieve the constructor of the component or entity by its name
     *
     * [!] Notes:
     * - In case of search for A-Entity please ensure that provided string corresponds to the static entity property of the class. [!] By default it's the kebab-case of the class name
     * - In case of search for A_Command please ensure that provided string corresponds to the static code property of the class. [!] By default it's the kebab-case of the class name
     * - In case of search for A_Component please ensure that provided string corresponds to the class name in PascalCase
     *
     * @param name
     * @returns
     */
    resolveConstructor<T extends A_Component | A_Entity>(name: string): new (...args: any[]) => T;
    /**
     * This method is used to get the component by class
     *
     * @param component
     * @returns
     */
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(string: string): InstanceType<T>;
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(component: T): InstanceType<T>;
    resolve<T extends A_Entity>(entity: {
        new (...args: any[]): T;
    }, instructions: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): T | Array<T>;
    resolve<T extends A_TYPES__A_InjectDecorator_Injectable>(component: Array<T>): Array<InstanceType<T>>;
    private resolveByName;
    private resolveOnce;
    private resolveEntity;
    private resolveFragment;
    private resolveScope;
    private resolveComponent;
    /**
     * Should be similar to resolveEntity but for commands
     *
     * @param command
     */
    private resolveCommand;
    /**
     * This method is used to register the component in the scope
     *
     * @param fragment
     */
    register<T extends A_Component>(component: new (...args: any[]) => T): void;
    register<T extends A_Entity>(entity: new (...args: any[]) => T): void;
    register<T extends A_Command>(command: new (...args: any[]) => T): void;
    register(entity: A_Entity): void;
    register(component: A_Component): void;
    register(fragment: A_Fragment): void;
    toJSON(): Record<string, any>;
}
