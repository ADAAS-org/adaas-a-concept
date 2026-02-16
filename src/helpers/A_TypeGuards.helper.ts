import { A_CommonHelper } from "./A_Common.helper";
import {
    A_TYPES__Feature_Constructor,
    A_TYPES__FeatureAvailableComponents,
    A_TYPES__FeatureExtendDecoratorTarget
} from "@adaas/a-concept/a-feature";
import {
    A_TYPES__Error_Constructor,
    A_TYPES__Error_Init,
    A_TYPES__Error_Serialized
} from "@adaas/a-concept/a-error";
import {
    A_Component,
    A_ComponentMeta,
    A_TYPES__Component_Constructor
} from "@adaas/a-concept/a-component";
import {
    A_Container,
    A_ContainerMeta,
    A_TYPES__Container_Constructor
} from "@adaas/a-concept/a-container";
import {
    A_Entity,
    A_EntityMeta,
    A_TYPES__Entity_Constructor
} from "@adaas/a-concept/a-entity";
import { A_Feature } from "@adaas/a-concept/a-feature";
import {
    A_TYPES__Fragment_Constructor,
    A_Fragment
} from "@adaas/a-concept/a-fragment";
import {
    A_Scope,
    A_TYPES__Scope_Constructor,
    A_TYPES__ScopeLinkedComponents,
    A_TYPES__ScopeLinkedConstructors
} from "@adaas/a-concept/a-scope";
import {
    A_Caller,
    A_TYPES__Caller_Constructor
} from "@adaas/a-concept/a-caller";
import { A_TYPES__AbstractionAvailableComponents } from "@adaas/a-concept/a-abstraction";
import { A_TYPES__InjectableTargets } from "@adaas/a-concept/a-inject";
import { ASEID } from "@adaas/a-concept/aseid";
import {
    A_Dependency,
    A_TYPES__A_DependencyInjectable
} from "@adaas/a-concept/a-dependency";



export class A_TypeGuards {
    // ===========================================================================
    // ============================= BASE Type Guards ============================
    // ===========================================================================
    /**
     * Check if value is a string
     * 
     * @param value 
     * @returns 
     */
    static isString(value: any): value is string {
        return typeof value === 'string' || value instanceof String;
    }
    /**
     * Check if value is a number
     * 
     * @param value 
     * @returns 
     */
    static isNumber(value: any): value is number {
        return typeof value === 'number' && isFinite(value);
    }
    /**
     * Check if value is a boolean
     * 
     * @param value 
     * @returns 
     */
    static isBoolean(value: any): value is boolean {
        return typeof value === 'boolean';
    }
    /**
     * Check if value is an array
     * 
     * @param value 
     * @returns 
     */
    static isArray(value: any): value is Array<any> {
        return Array.isArray(value);
    }
    /**
     * Check if value is an object
     * 
     * @param value 
     * @returns 
     */
    static isObject<T extends Object = Object>(value: any): value is T {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    /**
     * Check if value is a function
     * 
     * @param value 
     * @returns 
     */
    static isFunction(value: any): value is Function {
        return typeof value === 'function';
    }

    static isUndefined(value: any): value is undefined {
        return typeof value === 'undefined';
    }

    static isRegExp(value: any): value is RegExp {
        return value instanceof RegExp;
    }


    // ===========================================================================
    // ==========================A-Concept Type Guards ===========================
    // ===========================================================================
    /**
     * Type guard to check if the constructor is of type A_Container
     * 
     * @param ctor 
     * @returns 
     */
    static isContainerConstructor(ctor: any): ctor is A_TYPES__Container_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Container);
    }
    /**
     * Type guard to check if the constructor is of type A_Component
     * 
     * @param ctor 
     * @returns 
     */
    static isComponentConstructor(ctor: any): ctor is A_TYPES__Component_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Component);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment
     * 
     * @param ctor 
     * @returns 
     */
    static isFragmentConstructor(ctor: any): ctor is A_TYPES__Fragment_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Fragment);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity
     * 
     * @param ctor 
     * @returns 
     */
    static isEntityConstructor(ctor: any): ctor is A_TYPES__Entity_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Entity);
    }
    /**
     * Type guard to check if the constructor is of type A_Scope
     * 
     * @param ctor 
     * @returns 
     */
    static isScopeConstructor(ctor: any): ctor is A_TYPES__Scope_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Scope);
    }
    /**
     * Type guard to check if the constructor is of type A_Scope
     * 
     * @param ctor 
     * @returns 
     */
    static isErrorConstructor(ctor: any): ctor is A_TYPES__Error_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, Error);
    }
    /**
     * Type guard to check if the constructor is of type A_Feature
     * 
     * @param ctor 
     * @returns 
     */
    static isFeatureConstructor(ctor: any): ctor is A_TYPES__Feature_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Feature);
    }
    /**
     * Type guard to check if the constructor is of type A_Caller
     * 
     * @param ctor 
     * @returns 
     */
    static isCallerConstructor(ctor: any): ctor is A_TYPES__Caller_Constructor {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Caller);
    }
    /**
     * Type guard to check if the constructor is of type A_Dependency
     * 
     * @param ctor 
     * @returns 
     */
    static isDependencyConstructor<T extends A_TYPES__A_DependencyInjectable>(ctor: any): ctor is A_Dependency<T> {
        return typeof ctor === 'function' && A_CommonHelper.isInheritedFrom(ctor, A_Dependency);
    }
    // ----------------------------------------------------------------------------
    // Instance type guards
    // ----------------------------------------------------------------------------
    /**
     * Type guard to check if the instance is of type A_Dependency
     * 
     * @param instance 
     * @returns 
     */
    static isDependencyInstance<T extends A_TYPES__A_DependencyInjectable>(instance: any): instance is A_Dependency<T> {
        return instance instanceof A_Dependency;
    }
    /**
     * Type guard to check if the instance is of type A_Container
     * 
     * @param instance 
     * @returns 
     */
    static isContainerInstance(instance: any): instance is A_Container {
        return instance instanceof A_Container;
    }
    /**
     * Type guard to check if the instance is of type A_Component
     * 
     * @param instance 
     * @returns 
     */
    static isComponentInstance(instance: any): instance is A_Component {
        return instance instanceof A_Component;
    }

    /**
     * Type guard to check if the instance is of type A_Feature
     * 
     * @param instance 
     * @returns 
     */
    static isFeatureInstance(instance: any): instance is A_Feature {
        return instance instanceof A_Feature;
    }
    /**
     * Type guard to check if the instance is of type A_Fragment
     * 
     * @param instance 
     * @returns 
     */
    static isFragmentInstance(instance: any): instance is A_Fragment {
        return instance instanceof A_Fragment;
    }
    /**
     * Type guard to check if the instance is of type A_Entity
     * 
     * @param instance 
     * @returns 
     */
    static isEntityInstance(instance: any): instance is A_Entity {
        return instance instanceof A_Entity;
    }
    /**
     * Type guard to check if the instance is of type A_Scope
     * 
     * @param instance 
     * @returns 
     */
    static isScopeInstance(instance: any): instance is A_Scope {
        return instance instanceof A_Scope;
    }
    /**
     * Type guard to check if the instance is of type A_Error
     * 
     * @param instance 
     * @returns 
     */
    static isErrorInstance(instance: any): boolean {
        return instance instanceof Error;
    }
    /**
     * Type guard to check if the instance is of type A_ComponentMeta
     * 
     * @param instance 
     * @returns 
     */
    static isComponentMetaInstance(instance: any): instance is A_ComponentMeta {
        return instance instanceof A_ComponentMeta;
    }
    /**
     * Type guard to check if the instance is of type A_ContainerMeta
     * 
     * @param instance 
     * @returns 
     */
    static isContainerMetaInstance(instance: any): instance is A_ContainerMeta {
        return instance instanceof A_ContainerMeta;
    }
    /**
     * Type guard to check if the instance is of type A_EntityMeta
     * 
     * @param instance 
     * @returns 
     */
    static isEntityMetaInstance(instance: any): instance is A_EntityMeta {
        return instance instanceof A_EntityMeta;
    }



    // ==========================================================================
    // ========================= SPECIAL Type Guards =============================
    // ===========================================================================
    static hasASEID(value: any): value is A_Entity | { aseid: any } {
        return value && typeof value === 'object' && 'aseid' in value && (A_TypeGuards.isEntityInstance(value) || A_TypeGuards.isErrorInstance(value));
    }


    static isConstructorAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedConstructors {
        return A_TypeGuards.isContainerConstructor(target)
            || A_TypeGuards.isFeatureConstructor(target);
    }
    static isInstanceAllowedForScopeAllocation(target: any): target is A_TYPES__ScopeLinkedComponents {
        return A_TypeGuards.isContainerInstance(target)
            || A_TypeGuards.isFeatureInstance(target);
    }

    static isConstructorAvailableForAbstraction(target: any): target is A_TYPES__AbstractionAvailableComponents {
        return A_TypeGuards.isContainerInstance(target)
            || A_TypeGuards.isComponentInstance(target);
    }


    static isTargetAvailableForInjection(target: any): target is A_TYPES__InjectableTargets {
        return A_TypeGuards.isComponentConstructor(target)
            || A_TypeGuards.isComponentInstance(target)
            || A_TypeGuards.isContainerInstance(target)
            || A_TypeGuards.isEntityInstance(target)
    }

    static isAllowedForFeatureCall(param: any): param is A_TYPES__FeatureAvailableComponents {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }

    static isAllowedForFeatureDefinition(param: any): param is A_TYPES__FeatureAvailableComponents {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }

    static isAllowedForFeatureExtension(param: any): param is A_TYPES__FeatureExtendDecoratorTarget {
        return A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }

    static isAllowedForAbstractionDefinition(param: any): param is A_TYPES__AbstractionAvailableComponents {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param);
    }

    static isAllowedForDependencyDefaultCreation(param: any): param is A_TYPES__Entity_Constructor | A_TYPES__Fragment_Constructor {
        return A_TypeGuards.isFragmentConstructor(param)
            || A_CommonHelper.isInheritedFrom(param, A_Fragment)
            || A_TypeGuards.isEntityConstructor(param)
            || A_CommonHelper.isInheritedFrom(param, A_Entity)

    }

    /**
     * Allows to check if the provided param is of constructor type.
     * 
     * @param param 
     * @returns 
     */
    static isErrorConstructorType<T extends A_TYPES__Error_Init>(param: any): param is T {
        return !!param && A_TypeGuards.isObject(param) && !(param instanceof Error) && "title" in param;
    }


    static isErrorSerializedType<T extends A_TYPES__Error_Serialized>(param: any): param is T {
        return !!param && A_TypeGuards.isObject(param) && !(param instanceof Error) && "aseid" in param && ASEID.isASEID(param.aseid);
    }


    static isPromiseInstance<T>(value: any): value is Promise<T> {
        return value instanceof Promise;
    }
}