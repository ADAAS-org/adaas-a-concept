import { A_TYPES__FragmentConstructor } from "./A-Fragment.types";
/**
 * A-Fragment = Context Fragments is a set of arguments that can be used to define a Context for the pipeline.
 * In other words it is a dynamic context that will be created on pipeline start and destroyed on pipeline end.
 * During the execution of the pipeline, the Context Fragments can be used to pass the data between the pipeline steps.
 *
 * Or to store the data that is required for the pipeline execution
 *
 */
export declare class A_Fragment {
    name: string;
    /**
     * Indicates that Context Fragment is ready to use
     */
    ready: Promise<void>;
    constructor(params?: Partial<A_TYPES__FragmentConstructor>);
    private hasInherited;
    /**
     * Initializes the Namespace or can be used to reinitialize the Namespace
     */
    private init;
    /**
     *  Before init hook to be used in inherited classes
     *
     * @returns
     */
    protected onBeforeInit(): Promise<void>;
    /**
     * Main initialization method for the SDK
     */
    protected onInit(): Promise<void>;
    /**
     *  After init hook to be used in inherited classes
     *
     * @returns
     */
    protected onAfterInit(): Promise<void>;
    /**
     * Returns the JSON representation of the Fragment
     *
     * @returns
     */
    toJSON(): {
        name: string;
    };
}
