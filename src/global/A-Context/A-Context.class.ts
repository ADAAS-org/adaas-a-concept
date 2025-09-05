import {
    A_CommonHelper,
    A_Polyfills,
    A_TYPES__Required,
} from "@adaas/a-utils";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_ComponentMeta } from "../A-Component/A-Component.meta";
import { A_ContainerMeta } from "../A-Container/A-Container.meta";
import { A_TYPES__EntityBaseMethod, A_TYPES__EntityMetaKey } from "../A-Entity/A-Entity.types";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_EntityMeta } from "../A-Entity/A-Entity.meta";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_TYPES__ContainerMetaKey } from "../A-Container/A-Container.types";
import { A_TYPES__ComponentMetaKey } from "../A-Component/A-Component.types";
import { A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
import { A_TYPES__A_DefineDecorator_Meta } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";



/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *  
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 * 
 */
export class A_Context {

    static instance: A_Context;

    /**
     * A set of globally registered containers.
     */
    protected containers: WeakMap<A_Container, A_Scope> = new WeakMap();

    /**
     * A set of globally registered features.
     */
    protected features: WeakMap<A_Feature, A_Scope> = new WeakMap();


    /**
     * Uses to store the scope of every element in the program. 
     */
    protected registry: WeakMap<
        A_Container |
        A_Feature |
        A_Component |
        A_Fragment |
        A_Entity,
        A_Scope
    > = new WeakMap();




    /**
     * A set of allocated scopes per every element in the program.
     */
    protected containersMeta: Map<typeof A_Container.constructor, A_ContainerMeta> = new Map();
    protected componentsMeta: Map<typeof A_Component, A_ComponentMeta> = new Map();
    protected entitiesMeta: Map<typeof A_Entity.constructor, A_EntityMeta> = new Map();

    // uses to allow to store custom meta data
    protected customMeta: Map<typeof A_Container.constructor, A_Meta<any>> = new Map();


    /**
     * Root Namespace is a Namespace that is used to run the program.
     */
    private _root!: A_Scope


    private constructor() {
        this._root = new A_Scope({
            name: 'root'
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

    static get root(): A_Scope {
        return this.getInstance()._root;
    }

    static get environment(): 'server' | 'browser' {
        return A_Polyfills.env;
    }



    static allocate(
        component: any,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        component: any,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig> | A_Scope
    ): A_Scope
    static allocate(
        feature: A_Feature,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        feature: A_Feature,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig> | A_Scope
    ): A_Scope
    static allocate(
        container: A_Container,
        importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>
    ): A_Scope
    static allocate(
        container: A_Container,
        importing: A_Scope
    ): A_Scope
    static allocate(
        param1: A_Container | A_Feature | A_Component | any,
        param2: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig> | A_Scope
    ): A_Scope {

        const instance = this.getInstance();

        const newScope = param2 instanceof A_Scope ? param2 : new A_Scope(param2, param2);

        switch (true) {
            case param1 instanceof A_Container:
                instance.containers.set(param1, newScope);

                break;

            case param1 instanceof A_Feature:
                instance.features.set(param1, newScope);

                break;

            default:
                throw new Error(`[!] A-Concept Context: Unknown type of the parameter.`);
        }


        return newScope;
    }




    static meta(
        container: typeof A_Container,
    ): A_ContainerMeta
    static meta(
        container: A_Container,
    ): A_ContainerMeta
    static meta(
        entity: A_Entity,
    ): A_ContainerMeta
    static meta(
        entity: typeof A_Entity,
    ): A_ContainerMeta
    static meta(
        component: typeof A_Component,
    ): A_ComponentMeta
    static meta(
        component: A_Component,
    ): A_ComponentMeta
    static meta<T extends Record<string, any>>(
        constructor: typeof A_Component | typeof A_Container | A_Container
            | A_Component
            | A_Entity
            | typeof A_Entity
            | { new(...args: any[]): any }
    ): A_Meta<T>
    static meta<T extends Record<string, any>>(
        param1: typeof A_Component | typeof A_Container | A_Container
            | A_Component
            | A_Entity
            | typeof A_Entity
            | { new(...args: any[]): any }
    ): A_ContainerMeta | A_ComponentMeta | A_Meta<T> {


        const instance = this.getInstance();

        let metaStorage: WeakMap<typeof A_Container.constructor, A_Meta<any>>;
        let property: Function;
        let metaType: typeof A_Meta<T> | typeof A_ContainerMeta | typeof A_ComponentMeta | typeof A_EntityMeta


        switch (true) {
            case param1 instanceof A_Container: {

                metaStorage = instance.containersMeta;
                property = param1.constructor;
                metaType = A_ContainerMeta;

                break;
            }

            case A_CommonHelper.isInheritedFrom(param1, A_Container): {
                metaStorage = instance.containersMeta;
                property = param1 as typeof A_Container;
                metaType = A_ContainerMeta;

                break;
            }

            case param1 instanceof A_Component: {
                metaStorage = instance.componentsMeta;
                property = param1.constructor;
                metaType = A_ComponentMeta;

                break;
            }

            case A_CommonHelper.isInheritedFrom(param1, A_Component): {
                metaStorage = instance.componentsMeta;
                property = param1 as typeof A_Component;
                metaType = A_ComponentMeta;

                break;
            }

            case param1 instanceof A_Entity: {
                metaStorage = instance.entitiesMeta;
                property = param1.constructor;
                metaType = A_ComponentMeta;

                break;
            }

            case A_CommonHelper.isInheritedFrom(param1, A_Entity): {
                metaStorage = instance.entitiesMeta;
                property = param1 as typeof A_Entity;
                metaType = A_EntityMeta;
                break;
            }


            default: {
                metaStorage = instance.customMeta;
                property = typeof (param1 as any) === 'function' ? param1 : param1.constructor;
                metaType = A_Meta;

                break;
            }
        }


        if (!metaStorage.has(property)) {
            const inheritMeta = metaStorage.get(Object.getPrototypeOf(property)) || new metaType();
            metaStorage.set(property, new metaType().from(inheritMeta as any));
        }


        return metaStorage.get(property)!;
    }



    static scope(
        entity: A_Entity
    ): A_Scope
    static scope(
        component: A_Component
    ): A_Scope
    static scope(
        container: A_Container
    ): A_Scope
    static scope(
        feature: A_Fragment
    ): A_Scope
    static scope(
        feature: A_Feature
    ): A_Scope
    static scope(
        param1: A_Feature | A_Container | A_Component | A_Entity | A_Fragment
    ): A_Scope | undefined {

        const instance = this.getInstance();

        switch (true) {
            case param1 instanceof A_Container:
                return instance.containers.get(param1);

            case param1 instanceof A_Feature:
                return instance.features.get(param1);

            case param1 instanceof A_Entity:
                return instance.registry.get(param1);

            case param1 instanceof A_Component:
                return instance.registry.get(param1);

            case param1 instanceof A_Fragment:
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
    static component(
        meta: A_ComponentMeta
    ): typeof A_Component {
        const instance = this.getInstance();

        let component: typeof A_Component | undefined;

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
    static featureDefinition(
        component: A_Component | A_Container | A_Entity,
        feature: string | RegExp,
        scope: A_Scope
    ): A_TYPES__FeatureConstructor {
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
            case component instanceof A_Entity:
                metaKey = A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.FEATURES
                break;
            case component instanceof A_Component: {
                metaKey = A_TYPES__ComponentMetaKey.FEATURES
            }
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${component} level`);
        }

        const featureDefinition: A_TYPES__A_DefineDecorator_Meta | undefined = this
            .meta(component)
            ?.get(metaKey)
            ?.get(feature);


        const steps: A_TYPES__A_StageStep[] = [
            ...(featureDefinition?.template || [])
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
                            steps.push({
                                component: constructor,
                                ...declaration
                            });
                        });
            });



        return { name, steps, scope };
    }

    /**
     * This method returns a constructor params to create a new feature
     * 
     * @param scope 
     * @returns 
     */
    static abstractionDefinition(
        component: A_Component | A_Container | A_Entity,
        abstraction: A_TYPES__ConceptStage,
        scope: A_Scope
    ): A_TYPES__FeatureConstructor {
        const instance = this.getInstance();

        const name = `${component.constructor.name}.${abstraction}`;

        let metaKey;

        switch (true) {
            case component instanceof A_Entity:
                metaKey = A_TYPES__EntityMetaKey.FEATURES;
                break;
            case component instanceof A_Container:
                metaKey = A_TYPES__ContainerMetaKey.ABSTRACTIONS
                break;
            case component instanceof A_Component: {
                metaKey = A_TYPES__ComponentMetaKey.ABSTRACTIONS
            }
                break;
            default:
                throw new Error(`A-Feature cannot be defined on the ${component} level`);
        }

        const featureDefinition = this.meta(component)
            .get(metaKey)
            .get(abstraction) || []


        const steps: A_TYPES__A_StageStep[] = [
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
                            steps.push({
                                component: constructor,
                                ...declaration
                            });
                        });
            });


        return { name, steps, scope };
    }

    /**
     * This method returns a step-by-step instructions of feature implementation depending on the feature name and the class.
     * 
     * @param scope 
     * @returns 
     */
    static feature<T extends Array<string>>(
        component: A_Component | A_Container | A_Entity<any, any>,
        feature: string | T[number] | RegExp,
        scope: A_Scope
    ): A_Feature {
        const featureConstructor = this.featureDefinition(component, feature, scope);

        const newFeature = new A_Feature(featureConstructor);

        return newFeature;
    }



    /**
     * Register a Namespace in the provider.
     * @param Namespace 
     */
    static register(
        scope: A_Scope,
        container: A_Container
    )
    static register(
        scope: A_Scope,
        entity: A_Entity
    )
    static register(
        scope: A_Scope,
        component: A_Component
    )
    static register(
        scope: A_Scope,
        fragment: A_Fragment
    )
    static register(
        scope: A_Scope,
        param1: A_Fragment | A_Container | A_Entity | A_Component
    ) {
        const instance = this.getInstance();

        // if (!instance._root)
        //     instance._root = scope.name;

        switch (true) {
            case param1 instanceof A_Component:
                instance.registry.set(param1, scope);
                break;

            case param1 instanceof A_Container:
                instance.registry.set(param1, scope);
                break;

            case param1 instanceof A_Entity:
                instance.registry.set(param1, scope);
                break;

            case param1 instanceof A_Fragment && !instance.registry.has(param1):
                instance.registry.set(param1, scope);
                break;

            default:
                if (!instance.registry.has(param1))
                    instance.registry.set(param1, scope);

                break;
        }
    }
}