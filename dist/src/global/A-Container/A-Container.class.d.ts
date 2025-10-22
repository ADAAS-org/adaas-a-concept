import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_TYPES__Container_Init } from "./A-Container.types";
export declare class A_Container {
    /**
     * Configuration of the container that will be used to run it.
     */
    protected readonly config: Partial<A_TYPES__Container_Init>;
    /**
     * Name of the container
     */
    get name(): string;
    /**
     * Returns the scope where the container is registered
     */
    get scope(): A_Scope;
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
    config?: Partial<A_TYPES__Container_Init>);
    /**
     * Calls the feature with the given name in the given scope
     *
     * [!] Note: This method creates a new instance of the feature every time it is called
     *
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
    /**
     * Name of the feature to call
     */
    feature: string, 
    /**
     * scope in which the feature will be executed
     */
    scope?: A_Scope): Promise<void>;
}
