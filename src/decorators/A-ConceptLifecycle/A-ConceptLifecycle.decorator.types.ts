

export type A_TYPES__ConceptLifecycle_MethodDeclarationConfig = {
    /**
     * The name of the method. If not provided, the name of the function will be used. 
     * The name is connected to the class name. 
     * e.g. 'YourClass.yourMethod'
     */
    name: string,
    
    /**
     * Allows to override the method with a new implementation.
     * The methods listed will not be called.
     * e.g. ['YourClass.yourMethod']
     */
    override: Array<string> | string | Function,

    /**
     * Defines a flexible dependency management mechanism to enable pipeline-like behavior.
     * The target method will be called before the methods listed.
     * e.g. ['YourClass.yourMethod']
     */
    before: Array<string> | string | Function,

    /**
     * Defines a flexible dependency management mechanism to enable pipeline-like behavior.
     * The target method will be called after the methods listed.
     * e.g. ['YourClass.yourMethod']
     */
    after: Array<string> | string | Function,


    /**
     * Allows to define a behavior of the method 
     * Sync  - blocks other Concept Lifecycle methods until the method is ready
     * Async - allows to initialize method after Concept Lifecycle initialization
     */
    behavior: 'sync' | 'async',
    type: 'extension' | 'pipe'
}




export type A_TYPES__ConceptLifecycle_MethodDeclarationStorage = {
}