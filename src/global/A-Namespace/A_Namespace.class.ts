import { A_Polyfills } from '@adaas/a-utils';
import {
    A_TYPES__NamespaceConstructor,
    A_TYPES__INamespace,
} from './A_Namespace.types';
import { A_Context } from '../A-Context/A-Context.class';


/**
 * A_Namespace is a base class for all Namespaces in the A
 * 
 * Namespace is a shared object within some environment, service or Application. 
 * It is used to share some data, configuration, dependencies, etc. between different parts of the application.
 * 
 * Namespace allow to :
 * - share some data between different parts of the application, 
 * - share some configuration between different parts of the application,
 * - share some dependencies between different parts of the application,
 * - extend the capabilities of the application by adding new features or modifying existing ones into base classes
 *
 */
export class A_Namespace<
    _ConstructorConfigType extends A_TYPES__NamespaceConstructor = any
> implements A_TYPES__INamespace {

    /**
     * Namespace namespace
     */
    name!: string;

    /**
     * Ready Promise to ensure the SDK is ready to use
     */
    ready!: Promise<void>;

    constructor(
        protected config?: _ConstructorConfigType
    ) {
        /**
         * Register the Namespace in the global Namespace provider
         */
        this.name = A_Context
            .register(
                this,
                config?.name
            );

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
    protected async init() {
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
        if (A_Context.environment === 'server' && !this.hasInherited(A_Namespace)) {
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