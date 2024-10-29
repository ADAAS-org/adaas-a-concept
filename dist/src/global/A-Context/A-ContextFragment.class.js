"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_ContextFragment = void 0;
/**
 * Context Fragments is a set of arguments that can be used to define a Context for the pipeline.
 * In other words it is a dynamic context that will be created on pipeline start and destroyed on pipeline end.
 * During the execution of the pipeline, the Context Fragments can be used to pass the data between the pipeline steps.
 *
 * Or to store the data that is required for the pipeline execution
 *
 */
class A_ContextFragment {
    constructor(...args) {
        this.args = [];
        this.args = args;
    }
}
exports.A_ContextFragment = A_ContextFragment;
//# sourceMappingURL=A-ContextFragment.class.js.map