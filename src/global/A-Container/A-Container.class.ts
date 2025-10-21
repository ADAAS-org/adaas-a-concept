import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__Container_Init } from "./A-Container.types";



export class A_Container {

    /**
     * Configuration of the container that will be used to run it.
     */
    protected readonly config!: Partial<A_TYPES__Container_Init>;
    /**
     * Name of the container
     */
    get name() {
        return this.config.name || this.constructor.name;
    }
    /**
     * Returns the scope where the container is registered
     */
    get scope(): A_Scope {
        return A_Context.scope(this);
    }


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
     * 
     * @param config - Configuration of the container that will be used to run it.
     */
    constructor(
        /**
         * Configuration of the container that will be used to run it.
         */
        config: Partial<A_TYPES__Container_Init>
    ) {
        this.config = config;

        A_Context.allocate(this, this.config);
    }


    /**
     * Calls the feature with the given name in the given scope
     * 
     * [!] Note: This method creates a new instance of the feature every time it is called
     * 
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    async call(
        /**
         * Name of the feature to call
         */
        feature: string,
        /**
         * scope in which the feature will be executed
         */
        scope?: A_Scope
    ) {
        const newFeature = new A_Feature({
            name: feature,
            component: this
        });

        return await newFeature.process(scope);
    }
}