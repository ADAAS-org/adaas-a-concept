import { A_TYPES__ContainerConstructor } from "./A-Container.types";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__FeatureCallParams, A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";



/**
 * This class should combine Components to achieve the goal withing Concept
 * 
 * Container is a direct container that should be "run" to make Concept work. 
 * So because of that Container can be:
 * - HTTP Server
 * - BASH Script
 * - Database Connection
 * - Microservice
 * - etc.
 */
export class A_Container {
    // scope!: A_Scope

    protected readonly config!: Partial<A_TYPES__ContainerConstructor<any>>;

    /**
     * Promise that will be resolved when the container is ready to be used.
     */
    ready!: Promise<void>;

    get name() {
        return this.config.name || this.constructor.name;
    }

    get Scope(): A_Scope {
        return A_Context.scope(this);
    }


    constructor(
        /**
         * Configuration of the container that will be used to run it.
         */
        config: Partial<A_TYPES__ContainerConstructor<any>>
    ) {
        this.config = config;

        A_Context.allocate(this, {
            name: this.name,
            ...config
        });
    }


    async call(
        feature: string,
        scope: A_Scope = this.Scope
    ) {

        if (scope && !scope.isInheritedFrom(this.Scope)) {
            scope = scope.inherit(this.Scope);
        }


        const newFeature = A_Context.feature(this, feature, scope);

        return await newFeature.process();
    }


    /**
     * This method allows to get a feature Definition for the future reuse with custom Feature classes
     * 
     * @param feature 
     */
    feature(
        feature: string,
        scope: A_Scope = this.Scope
    ) {

        if (scope && !scope.isInheritedFrom(this.Scope)) {
            scope = scope.inherit(this.Scope);
        }

        return A_Context.featureDefinition(this, feature, scope);
    }


    // ==============================================================
    // ======================= HOOKS ================================
    // ==============================================================

    /**
     *  Before init hook to be used in inherited classes
     * 
     * @returns 
     */
    protected async onBeforeInit() {
        return;
    }

    /**
     * Main initialization method for the Container
     */
    protected async onInit() {
        return;
    }

    /**
     *  After init hook to be used in inherited classes
     * 
     * @returns 
     */
    protected async onAfterInit() {
        return;
    }

}