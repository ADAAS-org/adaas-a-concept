import { A_TYPES__Feature_Constructor, A_TYPES__FeatureAvailableComponents, A_TYPES__FeatureExtendDecoratorTarget } from "../global/A-Feature/A-Feature.types";
import { A_TYPES__Error_Constructor, A_TYPES__Error_Init } from "../global/A-Error/A_Error.types";
import { A_Component } from "../global/A-Component/A-Component.class";
import { A_ComponentMeta } from "../global/A-Component/A-Component.meta";
import { A_TYPES__Component_Constructor } from "../global/A-Component/A-Component.types";
import { A_Container } from "../global/A-Container/A-Container.class";
import { A_ContainerMeta } from "../global/A-Container/A-Container.meta";
import { A_TYPES__Container_Constructor } from "../global/A-Container/A-Container.types";
import { A_Entity } from "../global/A-Entity/A-Entity.class";
import { A_EntityMeta } from "../global/A-Entity/A-Entity.meta";
import { A_TYPES__Entity_Constructor } from "../global/A-Entity/A-Entity.types";
import { A_Feature } from "../global/A-Feature/A-Feature.class";
import { A_Fragment } from "../global/A-Fragment/A-Fragment.class";
import { A_TYPES__Fragment_Constructor } from "../global/A-Fragment/A-Fragment.types";
import { A_Scope } from "../global/A-Scope/A-Scope.class";
import { A_TYPES__Caller_Constructor } from "../global/A-Caller/A_Caller.types";
import { A_Error } from "../global/A-Error/A_Error.class";
import { A_TYPES__AbstractionAvailableComponents } from "../global/A-Abstraction/A-Abstraction.types";
import { A_TYPES__Scope_Constructor, A_TYPES__ScopeLinkedComponents, A_TYPES__ScopeLinkedConstructors } from "../global/A-Scope/A-Scope.types";
import { A_TYPES__InjectableTargets } from "../global/A-Inject/A-Inject.types";
export declare class A_TypeGuards {
    /**
     * Check if value is a string
     *
     * @param value
     * @returns
     */
    static isString(value: any): value is string;
    /**
     * Check if value is a number
     *
     * @param value
     * @returns
     */
    static isNumber(value: any): value is number;
    /**
     * Check if value is a boolean
     *
     * @param value
     * @returns
     */
    static isBoolean(value: any): value is boolean;
    /**
     * Check if value is an array
     *
     * @param value
     * @returns
     */
    static isArray(value: any): value is Array<any>;
    /**
     * Check if value is an object
     *
     * @param value
     * @returns
     */
    static isObject<T extends Object = Object>(value: any): value is T;
    /**
     * Check if value is a function
     *
     * @param value
     * @returns
     */
    static isFunction(value: any): value is Function;
    static isUndefined(value: any): value is undefined;
    static isRegExp(value: any): value is RegExp;
    /**
     * Type guard to check if the constructor is of type A_Container
     *
     * @param ctor
     * @returns
     */
    static isContainerConstructor(ctor: any): ctor is A_TYPES__Container_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Component
     *
     * @param ctor
     * @returns
     */
    static isComponentConstructor(ctor: any): ctor is A_TYPES__Component_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Fragment
     *
     * @param ctor
     * @returns
     */
    static isFragmentConstructor(ctor: any): ctor is A_TYPES__Fragment_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Entity
     *
     * @param ctor
     * @returns
     */
    static isEntityConstructor(ctor: any): ctor is A_TYPES__Entity_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isScopeConstructor(ctor: any): ctor is A_TYPES__Scope_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isErrorConstructor(ctor: any): ctor is A_TYPES__Error_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Feature
     *
     * @param ctor
     * @returns
     */
    static isFeatureConstructor(ctor: any): ctor is A_TYPES__Feature_Constructor;
    /**
     * Type guard to check if the constructor is of type A_Caller
     *
     * @param ctor
     * @returns
     */
    static isCallerConstructor(ctor: any): ctor is A_TYPES__Caller_Constructor;
    /**
     * Type guard to check if the instance is of type A_Container
     *
     * @param instance
     * @returns
     */
    static isContainerInstance(instance: any): instance is A_Container;
    /**
     * Type guard to check if the instance is of type A_Component
     *
     * @param instance
     * @returns
     */
    static isComponentInstance(instance: any): instance is A_Component;
    /**
     * Type guard to check if the instance is of type A_Feature
     *
     * @param instance
     * @returns
     */
    static isFeatureInstance(instance: any): instance is A_Feature;
    /**
     * Type guard to check if the instance is of type A_Fragment
     *
     * @param instance
     * @returns
     */
    static isFragmentInstance(instance: any): instance is A_Fragment;
    /**
     * Type guard to check if the instance is of type A_Entity
     *
     * @param instance
     * @returns
     */
    static isEntityInstance(instance: any): instance is A_Entity;
    /**
     * Type guard to check if the instance is of type A_Scope
     *
     * @param instance
     * @returns
     */
    static isScopeInstance(instance: any): instance is A_Scope;
    /**
     * Type guard to check if the instance is of type A_Error
     *
     * @param instance
     * @returns
     */
    static isErrorInstance(instance: any): instance is A_Error;
    /**
     * Type guard to check if the instance is of type A_ComponentMeta
     *
     * @param instance
     * @returns
     */
    static isComponentMetaInstance(instance: any): instance is A_ComponentMeta;
    /**
     * Type guard to check if the instance is of type A_ContainerMeta
     *
     * @param instance
     * @returns
     */
    static isContainerMetaInstance(instance: any): instance is A_ContainerMeta;
    /**
     * Type guard to check if the instance is of type A_EntityMeta
     *
     * @param instance
     * @returns
     */
    static isEntityMetaInstance(instance: any): instance is A_EntityMeta;
    static isConstructorAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedConstructors;
    static isInstanceAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedComponents;
    static isConstructorAvailableForAbstraction(target: any): target is A_TYPES__AbstractionAvailableComponents;
    static isTargetAvailableForInjection(target: any): target is A_TYPES__InjectableTargets;
    static isAllowedForFeatureCall(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureDefinition(param: any): param is A_TYPES__FeatureAvailableComponents;
    static isAllowedForFeatureExtension(param: any): param is A_TYPES__FeatureExtendDecoratorTarget;
    static isAllowedForAbstractionDefinition(param: any): param is A_TYPES__AbstractionAvailableComponents;
    /**
     * Allows to check if the provided param is of constructor type.
     *
     * @param param
     * @returns
     */
    static isConstructorType<T extends A_TYPES__Error_Init>(param: any): param is T;
}
