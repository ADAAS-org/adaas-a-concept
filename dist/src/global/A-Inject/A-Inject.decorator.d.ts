import { A_TYPES__A_InjectDecorator_EntityInjectionInstructions, A_TYPES__A_InjectDecoratorReturn } from "./A-Inject.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__Feature_Constructor } from "../A-Feature/A-Feature.types";
import { A_Caller } from "../A-Caller/A_Caller.class";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_TYPES__Fragment_Constructor } from "../A-Fragment/A-Fragment.types";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__Scope_Constructor } from "../A-Scope/A-Scope.types";
import { A_Feature } from "../A-Feature/A-Feature.class";
/**
 * A-Inject decorator
 *
 * This Decorator allows to inject dependencies into the module like
 * - Namespaces
 * - Other Concepts
 * - or maybe Components
 *
 * @param params - see overloads
 * @returns - decorator function
 */
export declare function A_Inject<T extends A_Scope>(
/***
 * Provide the Scope constructor that will be associated with the injection.
 *
 * [!] It returns an instance of the Scope where the Entity/Component/Container is defined.
 */
scope: A_TYPES__Scope_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject<T extends A_Feature>(
/**
 * Provide the Feature constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Feature what is executed.
 */
feature: A_TYPES__Feature_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject<T extends A_Component>(
/**
 * Provide the Component constructor that will be associated with the injection.
 *
 * [!] It returns an Instance of the Component from current Scope or from Parent Scopes.
 */
component: A_TYPES__Component_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject(
/**
 * Provide the A_Caller constructor to inject the Caller instance
 *
 * [!] It returns initiator of the call, e.g. Container/Component/Command who called Feature
 */
caller: typeof A_Caller): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject<T extends A_Fragment>(
/**
 * Provide the Fragment constructor to inject the Fragment instance
 *
 * [!] It returns the Fragment instance from current Scope or from Parent Scopes.
 */
fragment: A_TYPES__Fragment_Constructor<T>): A_TYPES__A_InjectDecoratorReturn;
export declare function A_Inject<T extends A_Entity>(
/**
 * Provide the Entity constructor to inject the Entity instance
 *
 * [!] Note: It returns the Entity instance from current Scope or from Parent Scopes.
 * [!] Note: If instance has more than one Entity of the same type It returns FIRST found Entity
 * [!] Note: Use 'config' to specify to inject specific one or even Array of Entities
 */
entity: A_TYPES__Entity_Constructor<T>, 
/**
 * Provide additional instructions on how to perform the injection
 *
 * [!] Default Pagination is 1 if it's necessary to get multiple Entities please customize it in the instructions
 */
config?: Partial<A_TYPES__A_InjectDecorator_EntityInjectionInstructions<T>>): A_TYPES__A_InjectDecoratorReturn<T>;
export declare function A_Inject<T extends A_Component>(
/**
 * Provide the name of Component constructor to inject the Component instance
 *
 * [!] You can use both customized one or original depending on your overriding strategy
 */
ctor: string): A_TYPES__A_InjectDecoratorReturn;
