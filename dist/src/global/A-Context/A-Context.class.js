"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Context = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Component_class_1 = require("../A-Component/A-Component.class");
const A_Fragment_class_1 = require("../A-Fragment/A-Fragment.class");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
const A_Container_class_1 = require("../A-Container/A-Container.class");
const A_Scope_class_1 = require("../A-Scope/A-Scope.class");
const A_Meta_class_1 = require("../A-Meta/A-Meta.class");
const A_Component_meta_1 = require("../A-Component/A-Component.meta");
const A_Container_meta_1 = require("../A-Container/A-Container.meta");
const A_Entity_types_1 = require("../A-Entity/A-Entity.types");
const A_Entity_class_1 = require("../A-Entity/A-Entity.class");
const A_Entity_meta_1 = require("../A-Entity/A-Entity.meta");
const A_Container_types_1 = require("../A-Container/A-Container.types");
const A_Component_types_1 = require("../A-Component/A-Component.types");
const env_constants_1 = require("../../constants/env.constants");
/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 *
 */
class A_Context {
    constructor() {
        /**
         * A set of globally registered containers.
         */
        this.containers = new WeakMap();
        /**
         * A set of globally registered features.
         */
        this.features = new WeakMap();
        /**
         * Uses to store the scope of every element in the program.
         */
        this.registry = new WeakMap();
        /**
         * A set of allocated scopes per every element in the program.
         */
        this.containersMeta = new Map();
        this.componentsMeta = new Map();
        this.entitiesMeta = new Map();
        // uses to allow to store custom meta data
        this.customMeta = new Map();
        this._root = new A_Scope_class_1.A_Scope({
            name: process && process.env ? process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE] || 'a-concept' : 'a-concept'
        });
    }
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
    static get root() {
        return this.getInstance()._root;
    }
    static get environment() {
        return a_utils_1.A_Polyfills.env;
    }
    static allocate(param1, param2) {
        const instance = this.getInstance();
        const newScope = param2 instanceof A_Scope_class_1.A_Scope ? param2 : new A_Scope_class_1.A_Scope(param2, param2);
        if (!newScope.isInheritedFrom(A_Context.root)) {
            newScope.inherit(A_Context.root);
        }
        switch (true) {
            case param1 instanceof A_Container_class_1.A_Container:
                instance.containers.set(param1, newScope);
                break;
            case param1 instanceof A_Feature_class_1.A_Feature:
                instance.features.set(param1, newScope);
                break;
            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }
        return newScope;
    }
    static meta(param1) {
        const instance = this.getInstance();
        let metaStorage;
        let property;
        let metaType;
        switch (true) {
            // 1) If param1 is instance of A_Container
            case param1 instanceof A_Container_class_1.A_Container: {
                metaStorage = instance.containersMeta;
                property = param1.constructor;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            // 2) If param1 is class of A_Container
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Container_class_1.A_Container): {
                metaStorage = instance.containersMeta;
                property = param1;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            // 3) If param1 is instance of A_Component
            case param1 instanceof A_Component_class_1.A_Component: {
                metaStorage = instance.componentsMeta;
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 4) If param1 is class of A_Component
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Component_class_1.A_Component): {
                metaStorage = instance.componentsMeta;
                property = param1;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 5) If param1 is instance of A_Entity
            case param1 instanceof A_Entity_class_1.A_Entity: {
                metaStorage = instance.entitiesMeta;
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 6) If param1 is class of A_Entity
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Entity_class_1.A_Entity): {
                metaStorage = instance.entitiesMeta;
                property = param1;
                metaType = A_Entity_meta_1.A_EntityMeta;
                break;
            }
            // 7) If param1 is string then we need to find the component by its name
            case typeof param1 === 'string': {
                metaStorage = instance.componentsMeta;
                const found = Array.from(instance.componentsMeta).find(([c]) => c.name === param1);
                if (!(found && found.length))
                    throw new a_utils_1.A_Error(`Component with name ${param1} not found`);
                property = found[0];
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            // 8) If param1 is any other class or function
            default: {
                metaStorage = instance.customMeta;
                property = typeof param1 === 'function' ? param1 : param1.constructor;
                metaType = A_Meta_class_1.A_Meta;
                break;
            }
        }
        if (!metaStorage.has(property)) {
            const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new metaType();
            metaStorage.set(property, new metaType().from(inheritMeta));
        }
        return metaStorage.get(property);
    }
    static scope(param1) {
        const instance = this.getInstance();
        switch (true) {
            case param1 instanceof A_Container_class_1.A_Container:
                return instance.containers.get(param1);
            case param1 instanceof A_Feature_class_1.A_Feature:
                return instance.features.get(param1);
            case param1 instanceof A_Entity_class_1.A_Entity:
                return instance.registry.get(param1);
            case param1 instanceof A_Component_class_1.A_Component:
                return instance.registry.get(param1);
            case param1 instanceof A_Fragment_class_1.A_Fragment:
                return instance.registry.get(param1);
            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }
    }
    /**
     * This method returns a component by its meta.
     *
     * @param meta
     * @returns
     */
    static component(meta) {
        const instance = this.getInstance();
        let component;
        instance.componentsMeta.forEach((meta, constructor) => {
            if (meta === meta) {
                component = constructor;
            }
        });
        if (!component) {
            throw new Error(`[!] A-Concept Context: Component not found.`);
        }
        return component;
    }
    /**
     * This method returns a constructor params to create a new feature
     *
     * @param scope
     * @returns
     */
    static featureDefinition(component, feature, scope) {
        var _a, _b;
        const instance = this.getInstance();
        const name = `${component.constructor.name}.${feature}`;
        /**
         * Important NOTE::: Component Scope and Parent Scope are different things.
         *
         * Component Scope is a scope where Component Registered.
         * Parent Scope is a scope From Where Feature Requested.
         *
         *
         * Example: ComponentA registered in ScopeA of ContainerA.
         * When FeatureA Requested from ContainerA, then Parent Scope is ScopeA For the FeatureA [!]
         * BUT In FeatureA may be used ComponentB with FeatureB.
         *
         *
         * ------------------------------Execution-----------------------------------------------------------
         * ContainerA      ->      FeatureA       ->    ComponentA     ->     FeatureB       ->     ComponentB
         * - Scope:ScopeA  ->  - Scope:  FeatA    -> - Scope: ScopeA   -> - Scope:  FeatB    -> - Scope: ScopeA
         *                     - Parent: ScopeA   -> - Parent: ROOT    -> - Parent: FeatA    -> - Parent: ROOT
         * --------------------------------------------------------------------------------------------------
         *
         * So ComponentA and ComponentB  are registered in the SAME scope of ContainerA.
         * But Each Feature has its own Scope and Parent Scope.
         *
         *
         * Component AND Entity DO [!] NOT HAVE THEIR OWN SCOPE.
         *
         * Feature AND Container HAVE OWN SCOPE.
         *
         *
         * So Parent can come from the Container or from the Feature.
         * While Scope we use just to store the scope where the component registered.
         *
         */
        let metaKey;
        switch (true) {
            case component instanceof A_Entity_class_1.A_Entity:
                metaKey = A_Entity_types_1.A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.FEATURES;
                break;
            case component instanceof A_Component_class_1.A_Component:
                {
                    metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.FEATURES;
                }
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${component} level`);
        }
        const featureDefinition = (_b = (_a = this
            .meta(component)) === null || _a === void 0 ? void 0 : _a.get(metaKey)) === null || _b === void 0 ? void 0 : _b.get(feature);
        const steps = [
            ...((featureDefinition === null || featureDefinition === void 0 ? void 0 : featureDefinition.template) || [])
        ];
        // const feature: string = new ASEID({
        //     id: `${param2}-${Math.random()}`,
        //     entity: 'a-feature',
        //     namespace: component.constructor.name,
        //     scope: scope.name
        // }).toString();
        // Now we need to resolve the method from all registered components 
        // We need to get all components that has extensions for the feature in component
        instance.componentsMeta
            .forEach((meta, constructor) => {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(constructor))
                // Get all extensions for the feature
                meta
                    .extensions(name)
                    .forEach((declaration) => {
                    steps.push(Object.assign({ component: constructor }, declaration));
                });
        });
        return { name, steps, scope, caller: component };
    }
    /**
     * This method returns a constructor params to create a new feature
     *
     * @param scope
     * @returns
     */
    static abstractionDefinition(component, abstraction, scope) {
        const instance = this.getInstance();
        const name = `${component.constructor.name}.${abstraction}`;
        let metaKey;
        switch (true) {
            case component instanceof A_Entity_class_1.A_Entity:
                metaKey = A_Entity_types_1.A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container_class_1.A_Container:
                metaKey = A_Container_types_1.A_TYPES__ContainerMetaKey.ABSTRACTIONS;
                break;
            case component instanceof A_Component_class_1.A_Component:
                {
                    metaKey = A_Component_types_1.A_TYPES__ComponentMetaKey.ABSTRACTIONS;
                }
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${component} level`);
        }
        const featureDefinition = this.meta(component)
            .get(metaKey)
            .get(abstraction) || [];
        const steps = [
            ...featureDefinition
        ];
        // We need to get all components that has extensions for the feature in component
        instance.componentsMeta
            .forEach((meta, constructor) => {
            // Just try to make sure that component not only Indexed but also presented in scope
            if (scope.has(constructor))
                // Get all extensions for the feature
                meta
                    .abstractions(name)
                    .forEach((declaration) => {
                    steps.push(Object.assign({ component: constructor }, declaration));
                });
        });
        return { name, steps, scope, caller: component };
    }
    /**
     * This method returns a step-by-step instructions of feature implementation depending on the feature name and the class.
     *
     * @param scope
     * @returns
     */
    static feature(component, feature, scope) {
        const featureConstructor = this.featureDefinition(component, feature, scope);
        const newFeature = new A_Feature_class_1.A_Feature(featureConstructor);
        return newFeature;
    }
    static register(scope, param1) {
        const instance = this.getInstance();
        // if (!instance._root)
        //     instance._root = scope.name;
        switch (true) {
            case param1 instanceof A_Component_class_1.A_Component:
                instance.registry.set(param1, scope);
                break;
            case param1 instanceof A_Container_class_1.A_Container:
                instance.registry.set(param1, scope);
                break;
            case param1 instanceof A_Entity_class_1.A_Entity:
                instance.registry.set(param1, scope);
                break;
            case param1 instanceof A_Fragment_class_1.A_Fragment && !instance.registry.has(param1):
                instance.registry.set(param1, scope);
                break;
            default:
                if (!instance.registry.has(param1))
                    instance.registry.set(param1, scope);
                break;
        }
    }
    /**
     * Resets the Context to its initial state.
     */
    static reset() {
        const instance = A_Context.getInstance();
        instance.containers = new WeakMap();
        instance.features = new WeakMap();
        instance.registry = new WeakMap();
        instance.containersMeta = new Map();
        instance.componentsMeta = new Map();
        instance.entitiesMeta = new Map();
        instance.customMeta = new Map();
        instance._root = new A_Scope_class_1.A_Scope({
            name: process && process.env ? process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE] || 'a-concept' : 'a-concept'
        });
    }
}
exports.A_Context = A_Context;
//# sourceMappingURL=A-Context.class.js.map