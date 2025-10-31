import { A_Error } from "../A-Error/A_Error.class";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { A_TYPES__FeatureError_Init } from "./A-Feature.types";



export class A_FeatureError extends A_Error<A_TYPES__FeatureError_Init> {

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

    
    /**
     * Stage where the error occurred
     */
    stage?: A_Stage


    protected fromConstructor(params: A_TYPES__FeatureError_Init): void {
        super.fromConstructor(params);

        this.stage = params.stage;
    }
}