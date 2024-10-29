import { A_Scope } from "../A-Scope/A-Scope.class";
export type A_TYPES__ContextExecutionPipeline = {
    scope: A_Scope;
    steps: A_TYPES__ContextExecutionPipelineStep[];
};
export type A_TYPES__ContextExecutionPipelineStep = {
    component: {
        new (...args: any[]): any;
    };
    handler: string;
    args: any[];
};
