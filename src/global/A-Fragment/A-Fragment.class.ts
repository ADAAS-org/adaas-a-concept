import { A_Context } from "../A-Context/A-Context.class";
import { A_TYPES__FragmentConstructor } from "./A-Fragment.types";


/**
 * A-Fragment = Context Fragments is a set of arguments that can be used to define a Context for the pipeline. 
 * In other words it is a dynamic context that will be created on pipeline start and destroyed on pipeline end.
 * During the execution of the pipeline, the Context Fragments can be used to pass the data between the pipeline steps. 
 * 
 * Or to store the data that is required for the pipeline execution
 * 
 */
export class A_Fragment {

    name: string;


    /**
     * Indicates that Context Fragment is ready to use
     */
    ready!: Promise<void>;


    constructor(params: Partial<A_TYPES__FragmentConstructor> = {}) {

        this.name = params.name || this.constructor.name;

        /**
         * Register the Namespace in the global Namespace provider
         */
        this.name = params.name || this.constructor.name;

        /**
         * Run Async Initialization
         */
        this.init();
    }




    private hasInherited(cl: { new(...args: any[]) }): boolean {
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
     * Main initialization method for the SDK
     */
    protected async onInit() {
        // global logger configuration
        if (A_Context.environment === 'server' && !this.hasInherited(A_Fragment)) {
            // eslint-disable-next-line no-use-before-define
            // process.on('uncaughtException', (error) => {
            //     // log only in case of A_AUTH_Error
            //     if (error instanceof A_Error)
            //         this.Logger.error(error);
            // });
            // // eslint-disable-next-line no-use-before-define
            // process.on('unhandledRejection', (error) => {
            //     if (error instanceof A_Error)
            //         this.Logger.error(error);
            // });
        }
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