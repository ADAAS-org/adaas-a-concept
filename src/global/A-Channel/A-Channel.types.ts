

export type A_TYPES__A_DependencyReferenceConstructor = {
    /**
     * The name of the dependency 
     */
    name: string
    /**
     * The version of the module 
     * By default it is 1.0.0
     */
    version: string
    /**
     * The dependencies of the module 
     * Could be:
     * - other Modules
     * - other Contexts
     * 
     */
    // dependencies: Array<typeof A_Namespace>
    /**
     * The source of the dependency 
     * Could be:
     * - a string representing the path to the module
     * - a module class  (in case when config should be provided via the module constructor)
     * - a module class constructor
     * - a context class (in case when config should be provided via the context constructor)
     * - a context class constructor
     * 
     */
    // source: A_Module | A_Context | typeof A_Module | typeof A_Context | string
    // source: A_Namespace
}


export type A_TYPES__A_DependencyReferenceConstructorConfig = {
    /**
     * Sync  - blocks A-Express Application initialization until module is ready 
     * Async - allows to initialize module after A-Express Application initialization
     */
    behavior: 'async' | 'sync',

    /**
     * Allows to define a scheme of retries
     */
    retries: {
        /**
         * The number of retries
         * Default is 3
         */
        n: number,
        /**
         * The timeout between retries
         * Multiplied by the number of retries 
         * So after each retry the timeout is increased e.g. 1000ms * 1, 1000ms * 2, 1000ms * 3
         * Default is 1000
         */
        timeout: number
    }
}
