export type A_TYPES__A_DependencyReferenceConstructor = {
    /**
     * The name of the dependency
     */
    name: string;
    /**
     * The version of the module
     * By default it is 1.0.0
     */
    version: string;
};
export type A_TYPES__A_DependencyReferenceConstructorConfig = {
    /**
     * Sync  - blocks A-Express Application initialization until module is ready
     * Async - allows to initialize module after A-Express Application initialization
     */
    behavior: 'async' | 'sync';
    /**
     * Allows to define a scheme of retries
     */
    retries: {
        /**
         * The number of retries
         * Default is 3
         */
        n: number;
        /**
         * The timeout between retries
         * Multiplied by the number of retries
         * So after each retry the timeout is increased e.g. 1000ms * 1, 1000ms * 2, 1000ms * 3
         * Default is 1000
         */
        timeout: number;
    };
};
