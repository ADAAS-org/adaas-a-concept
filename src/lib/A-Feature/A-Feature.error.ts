import { A_Error } from "@adaas/a-concept/a-error";
import { A_Stage } from "@adaas/a-concept/a-stage";
import {
    A_TYPES__FeatureError_Init,
    A_TYPES__FeatureError_Serialized,
} from "./A-Feature.types";



export class A_FeatureError extends A_Error<A_TYPES__FeatureError_Init, A_TYPES__FeatureError_Serialized> {

    /**
     * Indicates that the Feature has been interrupted
     */
    static readonly Interruption = 'Feature Interrupted';
    /**
     * Indicates that there was an error initializing the Feature
     * 
     * Failed during the A-Feature initialization process
     */
    static readonly FeatureInitializationError = 'Unable to initialize A-Feature';
    /**
     * Indicates that there was an error processing the Feature
     * 
     * Failed during the A-Feature processing
     */
    static readonly FeatureProcessingError = 'Error occurred during A-Feature processing';

    // =======================================================================
    // ---------------------- Decorator Errors -----------------------------
    // =======================================================================
    /**
     * Indicates that there was an error defining the Feature
     * 
     * Failed during the @A_Feature.Define() decorator execution
     */
    static readonly FeatureDefinitionError = 'Unable to define A-Feature';
    /**
     * Indicates that there was an error extending the Feature
     * 
     * Failed during the @A_Feature.Extend() decorator execution
     */
    static readonly FeatureExtensionError = 'Unable to extend A-Feature';


    // =======================================================================
    // ---------------------- Structured Context ---------------------------
    // =======================================================================
    /**
     * Live stage reference (when available). Convenience for in-process
     * inspection. NOT serialized — use the string fields below for that.
     */
    stage?: A_Stage;
    /**
     * Name of the feature that failed (e.g. "_A_FRAME_STORAGE_SAVE_KNOWLEDGE").
     * Serialized.
     */
    featureName?: string;
    /**
     * Stage path: `A-Stage(<feature>::<behavior>@<handler>)`. Serialized.
     */
    stageName?: string;
    /**
     * Handler method name on the component (e.g. "saveKnowledgeToDisk").
     * Serialized.
     */
    handler?: string;
    /**
     * Component class name that owns the failing handler (e.g.
     * "A_FrameNodeStorage"). Serialized.
     */
    component?: string;


    protected fromConstructor(params: A_TYPES__FeatureError_Init): void {
        super.fromConstructor(params);

        this.stage = params.stage;
        this.featureName = params.featureName ?? params.stage?.feature?.name;
        this.stageName = params.stageName ?? params.stage?.name;
        // Derive handler/component from the live stage when not provided.
        const def = params.stage?.definition as any;
        this.handler = params.handler ?? (def?.handler as string | undefined);
        this.component = params.component
            ?? (def?.dependency?.target as Function | undefined)?.name
            ?? (def?.dependency?.name as string | undefined);
    }

    /**
     * Serialize the structured stage context alongside the base A_Error fields.
     * The live `stage` reference is intentionally dropped (circular and not
     * portable); the string projections are sufficient for logs / transport.
     */
    toJSON(): A_TYPES__FeatureError_Serialized {
        return {
            ...super.toJSON(),
            featureName: this.featureName,
            stageName: this.stageName,
            handler: this.handler,
            component: this.component,
        };
    }
}


/**
 * Distinct error subclass for operator-driven interruption.
 *
 * Lets caller code do `err instanceof A_FeatureInterruption` instead of
 * inspecting the error code string. Treated as a NORMAL termination by
 * dashboards/log sinks that filter on the class hierarchy rather than on
 * the generic `A_FeatureError` (which now implies an actual failure).
 */
export class A_FeatureInterruption extends A_FeatureError { }