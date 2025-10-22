"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_TypeGuards = void 0;
const A_Component_class_1 = require("../global/A-Component/A-Component.class");
const A_Component_meta_1 = require("../global/A-Component/A-Component.meta");
const A_Container_class_1 = require("../global/A-Container/A-Container.class");
const A_Container_meta_1 = require("../global/A-Container/A-Container.meta");
const A_Entity_class_1 = require("../global/A-Entity/A-Entity.class");
const A_Entity_meta_1 = require("../global/A-Entity/A-Entity.meta");
const A_Feature_class_1 = require("../global/A-Feature/A-Feature.class");
const A_Fragment_class_1 = require("../global/A-Fragment/A-Fragment.class");
const A_Scope_class_1 = require("../global/A-Scope/A-Scope.class");
const A_Caller_class_1 = require("../global/A-Caller/A_Caller.class");
const A_Error_class_1 = require("../global/A-Error/A_Error.class");
const A_Common_helper_1 = require("./A_Common.helper");
class A_TypeGuards {
    // ===========================================================================
    // ============================= BASE Type Guards ============================
    // ===========================================================================
    /**
     * Check if value is a string
     *
     * @param value
     * @returns
     */
    static isString(value) {
        return typeof value === 'string' || value instanceof String;
    }
    /**
     * Check if value is a number
     *
     * @param value
     * @returns
     */
    static isNumber(value) {
        return typeof value === 'number' && isFinite(value);
    }
    /**
     * Check if value is a boolean
     *
     * @param value
     * @returns
     */
    static isBoolean(value) {
        return typeof value === 'boolean';
    }
    /**
     * Check if value is an array
     *
     * @param value
     * @returns
     */
    static isArray(value) {
        return Array.isArray(value);
    }
    /**
     * Check if value is an object
     *
     * @param value
     * @returns
     */
    static isObject(value) {
        return value && typeof value === 'object' && !Array.isArray(value);
    }
    /**
     * Check if value is a function
     *
     * @param value
     * @returns
     */
    static isFunction(value) {
        return typeof value === 'function';
    }
    static isUndefined(value) {
        return typeof value === 'undefined';
    }
    static isRegExp(value) {
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
    static isContainerConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Container_class_1.A_Container);
    }
    /**
     * Type guard to check if the constructor is of type A_Component
     *
     * @param ctor
     * @returns
     */
    static isComponentConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Component_class_1.A_Component);
    }
    /**
     * Type guard to check if the constructor is of type A_Fragment
     *
     * @param ctor
     * @returns
     */
    static isFragmentConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Fragment_class_1.A_Fragment);
    }
    /**
     * Type guard to check if the constructor is of type A_Entity
     *
     * @param ctor
     * @returns
     */
    static isEntityConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Entity_class_1.A_Entity);
    }
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isScopeConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Scope_class_1.A_Scope);
    }
    /**
     * Type guard to check if the constructor is of type A_Scope
     *
     * @param ctor
     * @returns
     */
    static isErrorConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Error_class_1.A_Error);
    }
    /**
     * Type guard to check if the constructor is of type A_Feature
     *
     * @param ctor
     * @returns
     */
    static isFeatureConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Feature_class_1.A_Feature);
    }
    /**
     * Type guard to check if the constructor is of type A_Caller
     *
     * @param ctor
     * @returns
     */
    static isCallerConstructor(ctor) {
        return typeof ctor === 'function' && A_Common_helper_1.A_CommonHelper.isInheritedFrom(ctor, A_Caller_class_1.A_Caller);
    }
    // ----------------------------------------------------------------------------
    // Instance type guards
    // ----------------------------------------------------------------------------
    /**
     * Type guard to check if the instance is of type A_Container
     *
     * @param instance
     * @returns
     */
    static isContainerInstance(instance) {
        return instance instanceof A_Container_class_1.A_Container;
    }
    /**
     * Type guard to check if the instance is of type A_Component
     *
     * @param instance
     * @returns
     */
    static isComponentInstance(instance) {
        return instance instanceof A_Component_class_1.A_Component;
    }
    /**
     * Type guard to check if the instance is of type A_Feature
     *
     * @param instance
     * @returns
     */
    static isFeatureInstance(instance) {
        return instance instanceof A_Feature_class_1.A_Feature;
    }
    /**
     * Type guard to check if the instance is of type A_Fragment
     *
     * @param instance
     * @returns
     */
    static isFragmentInstance(instance) {
        return instance instanceof A_Fragment_class_1.A_Fragment;
    }
    /**
     * Type guard to check if the instance is of type A_Entity
     *
     * @param instance
     * @returns
     */
    static isEntityInstance(instance) {
        return instance instanceof A_Entity_class_1.A_Entity;
    }
    /**
     * Type guard to check if the instance is of type A_Scope
     *
     * @param instance
     * @returns
     */
    static isScopeInstance(instance) {
        return instance instanceof A_Scope_class_1.A_Scope;
    }
    /**
     * Type guard to check if the instance is of type A_Error
     *
     * @param instance
     * @returns
     */
    static isErrorInstance(instance) {
        return instance instanceof A_Error_class_1.A_Error;
    }
    /**
     * Type guard to check if the instance is of type A_ComponentMeta
     *
     * @param instance
     * @returns
     */
    static isComponentMetaInstance(instance) {
        return instance instanceof A_Component_meta_1.A_ComponentMeta;
    }
    /**
     * Type guard to check if the instance is of type A_ContainerMeta
     *
     * @param instance
     * @returns
     */
    static isContainerMetaInstance(instance) {
        return instance instanceof A_Container_meta_1.A_ContainerMeta;
    }
    /**
     * Type guard to check if the instance is of type A_EntityMeta
     *
     * @param instance
     * @returns
     */
    static isEntityMetaInstance(instance) {
        return instance instanceof A_Entity_meta_1.A_EntityMeta;
    }
    // ==========================================================================
    // ========================= SPECIAL Type Guards =============================
    // ===========================================================================
    static isConstructorAllowedForScopeAllocation(target) {
        return A_TypeGuards.isContainerConstructor(target)
            || A_TypeGuards.isFeatureConstructor(target);
    }
    static isInstanceAllowedForScopeAllocation(target) {
        return A_TypeGuards.isContainerInstance(target)
            || A_TypeGuards.isFeatureInstance(target);
    }
    static isConstructorAvailableForAbstraction(target) {
        return A_TypeGuards.isContainerInstance(target)
            || A_TypeGuards.isComponentInstance(target);
    }
    static isTargetAvailableForInjection(target) {
        return A_TypeGuards.isComponentConstructor(target)
            || A_TypeGuards.isComponentInstance(target)
            || A_TypeGuards.isContainerInstance(target);
    }
    static isAllowedForFeatureCall(param) {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }
    static isAllowedForFeatureDefinition(param) {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param)
            || A_TypeGuards.isEntityInstance(param);
    }
    static isAllowedForFeatureExtension(param) {
        return A_TypeGuards.isComponentInstance(param);
    }
    static isAllowedForAbstractionDefinition(param) {
        return A_TypeGuards.isContainerInstance(param)
            || A_TypeGuards.isComponentInstance(param);
    }
    /**
     * Allows to check if the provided param is of constructor type.
     *
     * @param param
     * @returns
     */
    static isConstructorType(param) {
        return !!param && A_TypeGuards.isObject(param) && !(param instanceof Error) && "title" in param;
    }
}
exports.A_TypeGuards = A_TypeGuards;
//# sourceMappingURL=A_TypeGuards.helper.js.map