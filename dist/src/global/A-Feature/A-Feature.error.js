"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_FeatureError = void 0;
const A_Error_class_1 = require("../A-Error/A_Error.class");
class A_FeatureError extends A_Error_class_1.A_Error {
}
exports.A_FeatureError = A_FeatureError;
/**
 * Indicates that the Feature has been interrupted
 */
A_FeatureError.Interruption = 'Feature Interrupted';
/**
 * Indicates that there was an error initializing the Feature
 *
 * Failed during the A-Feature initialization process
 */
A_FeatureError.FeatureInitializationError = 'Unable to initialize A-Feature';
// =======================================================================
// ---------------------- Decorator Errors -----------------------------
// =======================================================================
/**
 * Indicates that there was an error defining the Feature
 *
 * Failed during the @A_Feature.Define() decorator execution
 */
A_FeatureError.FeatureDefinitionError = 'Unable to define A-Feature';
/**
 * Indicates that there was an error extending the Feature
 *
 * Failed during the @A_Feature.Extend() decorator execution
 */
A_FeatureError.FeatureExtensionError = 'Unable to extend A-Feature';
//# sourceMappingURL=A-Feature.error.js.map