import { A_TYPES__ContainerCallParams, A_TYPES__ContainerConstructor } from "./A-Container.types";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Scope } from "../A-Scope/A-Scope.class";



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
export class A_Container<
    _FeatureNames extends Array<string>
> {
    // scope!: A_Scope

    protected readonly config!: Partial<A_TYPES__ContainerConstructor<_FeatureNames>>;

    /**
     * Promise that will be resolved when the container is ready to be used.
     */
    ready!: Promise<void>;

    get exports(): _FeatureNames {
        return this.config.exports || [] as any;
    }

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
        config: Partial<A_TYPES__ContainerConstructor<_FeatureNames>>
    ) {
        this.config = config;

        const components = config.components || [];
        const fragments = config.fragments || [];

        A_Context.allocate(this, config);

        /**
         * Run Async Initialization
         */
        this.init();
    }


    protected hasInherited(cl: { new(...args: any[]) }): boolean {
        return this.constructor === cl
            ? false
            : true
    }


    /**
     * Initializes the Namespace or can be used to reinitialize the Namespace
     */
    private async init() {
        if (!this.ready)
            this.ready = new Promise(async (resolve, reject) => {
                try {
                    await this.onBeforeInit();

                    await this.onInit();

                    await this.onAfterInit();


                    return resolve();
                } catch (error) {
                    return reject(error);
                }
            });
        else
            await this.ready;
    }





    /**
     * This method allows to call the lifecycle method of the container as well as any other Feature defined for it
     * 
     * @param lifecycleMethod 
     * @param args 
     */
    async call(
        /**
         * A-Feature method name to be called
         */
        feature: _FeatureNames[number],
    ): Promise<any>
    async call(
        /**
         * A-Feature name to be called
         */
        params: A_TYPES__Required<Partial<A_TYPES__ContainerCallParams<_FeatureNames[number]>>, ['name']>,
    ): Promise<any>

    async call(
        /**
        * A-Feature method name to be called
        */
        feature: _FeatureNames[number],
        /**
         * Parameters to provide additional data to the feature
         */
        params: Partial<A_TYPES__ContainerCallParams<_FeatureNames[number]>>,
    ): Promise<any>

    async call(
        param1: _FeatureNames[number] | A_TYPES__Required<Partial<A_TYPES__ContainerCallParams<_FeatureNames[number]>>, ['name']>,
        param2?: Partial<A_TYPES__ContainerCallParams<_FeatureNames[number]>>
    ): Promise<any> {

        const feature: string = typeof param1 === 'string'
            ? param1
            : param1.name;
        const params: Partial<A_TYPES__ContainerCallParams<_FeatureNames[number]>> = typeof param1 === 'string'
            ? param2 || {}
            : param1;

        const newFeature = A_Context.feature(this, feature, params);

        return await newFeature.process();
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