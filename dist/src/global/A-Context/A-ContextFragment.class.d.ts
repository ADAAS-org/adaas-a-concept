/**
 * Context Fragments is a set of arguments that can be used to define a Context for the pipeline.
 * In other words it is a dynamic context that will be created on pipeline start and destroyed on pipeline end.
 * During the execution of the pipeline, the Context Fragments can be used to pass the data between the pipeline steps.
 *
 * Or to store the data that is required for the pipeline execution
 *
 */
export declare class A_ContextFragment {
    protected args: any[];
    constructor(...args: any[]);
}
