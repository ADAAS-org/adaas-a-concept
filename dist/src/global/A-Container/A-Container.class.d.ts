import { A_TYPES__ContainerConstructor } from "./A-Container.types";
import { A_TYPES__Required } from "@adaas/a-utils";
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
export declare class A_Container {
    protected readonly config: Partial<A_TYPES__ContainerConstructor<any>>;
    /**
     * Promise that will be resolved when the container is ready to be used.
     */
    ready: Promise<void>;
    get name(): string;
    get Scope(): A_Scope;
    constructor(
    /**
     * Configuration of the container that will be used to run it.
     */
    config: Partial<A_TYPES__ContainerConstructor<any>>);
    call(feature: string, params?: Partial<A_TYPES__FeatureCallParams>): Promise<any>;
    /**
     * This method allows to get a feature Definition for the future reuse with custom Feature classes
     *
     * @param feature
     */
    feature(feature: string, params?: Partial<A_TYPES__FeatureCallParams>): A_TYPES__Required<Partial<A_TYPES__FeatureConstructor>, ['steps', 'fragments', 'name', 'components']>;
    /**
     *  Before init hook to be used in inherited classes
     *
     * @returns
     */
    protected onBeforeInit(): Promise<void>;
    /**
     * Main initialization method for the Container
     */
    protected onInit(): Promise<void>;
    /**
     *  After init hook to be used in inherited classes
     *
     * @returns
     */
    protected onAfterInit(): Promise<void>;
}
