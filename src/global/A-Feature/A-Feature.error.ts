import { A_Error } from "../A-Error/A_Error.class";



export class A_FeatureError extends A_Error {

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
}