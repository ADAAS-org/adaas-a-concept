import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__ScopeConfig, A_TYPES__ScopeConstructor } from "../A-Scope/A-Scope.types";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_ComponentMeta } from "../A-Component/A-Component.meta";
import { A_ContainerMeta } from "../A-Container/A-Container.meta";
import { A_TYPES__EntityBaseMethod } from "../A-Entity/A-Entity.types";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_EntityMeta } from "../A-Entity/A-Entity.meta";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__ConceptStage } from "../A-Concept/A_Concept.types";
/**
 * Namespace Provider is responsible for providing the Namespace to the Containers and other Namespaces.
 * This class stores all Namespaces across the Program.
 *
 * Namespace provider is a singleton class that is used to store all the Namespaces in the program.
 *
 */
export declare class A_Context {
    static instance: A_Context;
    /**
     * A set of globally registered containers.
     */
    protected containers: WeakMap<A_Container, A_Scope>;
    /**
     * A set of globally registered features.
     */
    protected features: WeakMap<A_Feature, A_Scope>;
    /**
     * Uses to store the scope of every element in the program.
     */
    protected registry: WeakMap<A_Container | A_Feature | A_Component | A_Fragment | A_Entity, A_Scope>;
    /**
     * A set of allocated scopes per every element in the program.
     */
    protected containersMeta: Map<typeof A_Container.constructor, A_ContainerMeta>;
    protected componentsMeta: Map<typeof A_Component, A_ComponentMeta>;
    protected entitiesMeta: Map<typeof A_Entity.constructor, A_EntityMeta>;
    protected customMeta: Map<typeof A_Container.constructor, A_Meta<any>>;
    /**
     * Root Namespace is a Namespace that is used to run the program.
     */
    private _root;
    private constructor();
    /**
     * Get the instance of the Namespace Provider.
     *
     * @returns
     */
    static getInstance(): A_Context;
    static get root(): A_Scope;
    static get environment(): 'server' | 'browser';
    static allocate(component: any, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static allocate(feature: A_Feature, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static allocate(container: A_Container, importing: Partial<A_TYPES__ScopeConstructor & A_TYPES__ScopeConfig>): A_Scope;
    static meta(container: typeof A_Container): A_ContainerMeta;
    static meta(container: A_Container): A_ContainerMeta;
    static meta(entity: A_Entity): A_ContainerMeta;
    static meta(entity: typeof A_Entity): A_ContainerMeta;
    static meta(component: typeof A_Component): A_ComponentMeta;
    static meta(component: A_Component): A_ComponentMeta;
    static scope(entity: A_Entity): A_Scope;
    static scope(component: A_Component): A_Scope;
    static scope(container: A_Container): A_Scope;
    static scope(feature: A_Fragment): A_Scope;
    static scope(feature: A_Feature): A_Scope;
    /**
     * This method returns a component by its meta.
     *
     * @param meta
     * @returns
     */
    static component(meta: A_ComponentMeta): typeof A_Component;
    /**
     * This method returns a constructor params to create a new feature
     *
     * @param scope
     * @returns
     */
    static featureDefinition(scope: A_Scope, entity: A_Entity, feature: A_TYPES__EntityBaseMethod | string | RegExp, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    static featureDefinition(scope: A_Scope, container: A_Container, feature: string, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    static featureDefinition(scope: A_Scope, component: A_Component, feature: string, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    /**
     * This method returns a constructor params to create a new feature
     *
     * @param scope
     * @returns
     */
    static abstractionDefinition(scope: A_Scope, entity: A_Entity, feature: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    static abstractionDefinition(scope: A_Scope, container: A_Container, feature: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    static abstractionDefinition(scope: A_Scope, component: A_Component, feature: A_TYPES__ConceptStage, params?: Partial<A_TYPES__ScopeConstructor>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    /**
     * This method returns a step-by-step instructions of feature implementation depending on the feature name and the class.
     *
     * @param scope
     * @returns
     */
    static feature<T extends Array<string>>(scope: A_Scope, entity: A_Entity<any, any>, feature: A_TYPES__EntityBaseMethod | string | T[number] | RegExp, params?: Partial<A_TYPES__ScopeConstructor>): A_Feature;
    static feature<T extends Array<string>>(scope: A_Scope, container: A_Container, feature: T[number], params?: Partial<A_TYPES__ScopeConstructor>): A_Feature;
    static feature(scope: A_Scope, component: A_Component, feature: string, params?: Partial<A_TYPES__ScopeConstructor>): A_Feature;
    /**
     * Register a Namespace in the provider.
     * @param Namespace
     */
    static register(scope: A_Scope, container: A_Container): any;
    static register(scope: A_Scope, entity: A_Entity): any;
    static register(scope: A_Scope, component: A_Component): any;
    static register(scope: A_Scope, fragment: A_Fragment): any;
}
