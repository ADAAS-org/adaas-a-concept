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
const A_Concept_class_1 = require("../A-Concept/A_Concept.class");
const A_Entity_class_1 = require("../A-Entity/A-Entity.class");
const A_Entity_meta_1 = require("../A-Entity/A-Entity.meta");
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
         * A set of globally registered concepts.
         */
        this.concepts = new WeakMap();
        /**
         * Uses to store the scope of every element in the program.
         */
        this.registry = new WeakMap();
        /**
         * A set of allocated scopes per every element in the program.
         */
        // protected scopes: WeakMap<A_Container<any> | A_Feature | A_Component | any, A_Scope> = new WeakMap();
        this.conceptsMeta = new Map();
        this.containersMeta = new Map();
        this.componentsMeta = new Map();
        this.entitiesMeta = new Map();
        // uses to allow to store custom meta data
        this.customMeta = new Map();
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
        const newScope = new A_Scope_class_1.A_Scope(param2, param2);
        switch (true) {
            case param1 instanceof A_Container_class_1.A_Container:
                instance.containers.set(param1, newScope);
                break;
            case param1 instanceof A_Feature_class_1.A_Feature:
                instance.features.set(param1, newScope);
                break;
            case param1 instanceof A_Concept_class_1.A_Concept:
                instance.concepts.set(param1, newScope);
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
            case param1 instanceof A_Container_class_1.A_Container: {
                metaStorage = instance.containersMeta;
                property = param1.constructor;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Container_class_1.A_Container): {
                metaStorage = instance.containersMeta;
                property = param1;
                metaType = A_Container_meta_1.A_ContainerMeta;
                break;
            }
            case param1 instanceof A_Component_class_1.A_Component: {
                metaStorage = instance.componentsMeta;
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Component_class_1.A_Component): {
                metaStorage = instance.componentsMeta;
                property = param1;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            case param1 instanceof A_Entity_class_1.A_Entity: {
                metaStorage = instance.entitiesMeta;
                property = param1.constructor;
                metaType = A_Component_meta_1.A_ComponentMeta;
                break;
            }
            case a_utils_1.A_CommonHelper.isInheritedFrom(param1, A_Entity_class_1.A_Entity): {
                metaStorage = instance.entitiesMeta;
                property = param1;
                metaType = A_Entity_meta_1.A_EntityMeta;
                break;
            }
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
            case param1 instanceof A_Concept_class_1.A_Concept:
                return instance.concepts.get(param1);
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
    static feature(param1, param2, param3) {
        const instance = this.getInstance();
        const component = param1;
        const feature = param2;
        const config = param3 || {};
        // TODO:  have no idea why it's not working because of that "any"
        const scope = this.scope(component);
        const steps = [];
        // Now we need to resolve the method from all registered components 
        // We need to get all components that has extensions for the feature in component
        instance.componentsMeta
            .forEach((meta, constructor) => {
            try {
                // Just try to make sure that component not only Indexed but also presented in scope
                scope.resolve(constructor);
                // Get all extensions for the feature
                meta
                    .extensions(feature)
                    .forEach(({ handler, args }) => {
                    steps.push({
                        component: constructor,
                        handler,
                        args
                    });
                });
            }
            catch (error) {
                // do nothing
            }
        });
        const newFeature = new A_Feature_class_1.A_Feature({
            name: `${component.constructor.name}.${feature}`,
            fragments: config.fragments,
            components: config.components,
            steps,
            parent: component instanceof A_Container_class_1.A_Container ? this.scope(component) : undefined
        });
        return newFeature;
    }
    static register(scope, param1) {
        const instance = this.getInstance();
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
            case param1 instanceof A_Fragment_class_1.A_Fragment:
                instance.registry.set(param1, scope);
                break;
            default:
                instance.registry.set(param1, scope);
        }
        // if (param1 instanceof A_Fragment) {
        //     const instance = this.getInstance();
        //     let fragment: A_Fragment;
        //     let name: string;
        //     if (typeof param2 === 'string') {
        //         name = param2;
        //         fragment = param1;
        //     } else {
        //         fragment = param1 as A_Fragment;
        //         name = fragment.name;
        //     }
        //     /**
        //      * If the namespace is not provided, then use the root namespace.
        //      * If the root namespace is not provided, then use the default namespace.
        //      */
        //     if (!name)
        //         name = this.root
        //             || process.env.ADAAS_NAMESPACE
        //             || process.env.A_NAMESPACE
        //             || process.env.ADAAS_APP_NAMESPACE
        //             || 'a-concept'
        //     if (!this.root)
        //         instance._root = name;
        //     // instance.namedFragments.set(namespace, Namespace);
        //     return name;
    }
}
exports.A_Context = A_Context;
//# sourceMappingURL=A-Context.class.js.map