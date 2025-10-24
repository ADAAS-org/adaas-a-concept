import { A_TYPES__A_Stage_Status, A_TYPES__A_StageStep, A_TYPES__Stage_Serialized } from "./A-Stage.types";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Error } from "../A-Error/A_Error.class";
import { A_TYPES__ScopeResolvableComponents } from "../A-Scope/A-Scope.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
export declare class A_Stage {
    /**
     * The feature that owns this stage
     */
    private readonly _feature;
    /**
     * Initial Instructions to process the stage
     */
    private readonly _definition;
    /**
     * Possible errors during stage processing
     */
    private _error?;
    /**
     * Indicates the current status of the stage
     */
    private _status;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    private _processed;
    /**
     * A_Stage is a callable A_Function within A_Feature that should be run with specific parameters.
     * [!] Depending on the Stage Definition type sync/async function can be executed correspondingly.
     *
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
     */
    constructor(
    /**
     * The feature that owns this stage
     */
    feature: A_Feature, 
    /**
     * The step definitions of the stage
     */
    step: A_TYPES__A_StageStep);
    /**
     * Returns the name of the stage
     */
    get name(): string;
    /**
     * Returns the definition of the stage
     */
    get definition(): A_TYPES__A_StageStep;
    /**
     * Returns the current status of the stage
     */
    get status(): A_TYPES__A_Stage_Status;
    /**
     * Returns the feature that owns this stage
     */
    get feature(): A_Feature;
    /**
     * Returns true if the stage is processed (completed, failed, or skipped)
     */
    get isProcessed(): boolean;
    /**
     * Returns the error of the stage
     */
    get error(): A_Error | undefined;
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    protected getStepArgs(scope: A_Scope, step: A_TYPES__A_StageStep): Promise<(import("../A-Component/A-Component.class").A_Component | import("../A-Container/A-Container.class").A_Container | import("../A-Entity/A-Entity.class").A_Entity<any, import("../A-Entity/A-Entity.types").A_TYPES__Entity_Serialized> | A_Scope<A_TYPES__Component_Constructor[], import("../A-Error/A_Error.types").A_TYPES__Error_Constructor[], import("../A-Entity/A-Entity.types").A_TYPES__Entity_Constructor[], import("../A-Fragment/A-Fragment.class").A_Fragment<any>[]> | import("../A-Fragment/A-Fragment.class").A_Fragment<any> | A_Feature<import("../A-Feature/A-Feature.types").A_TYPES__FeatureAvailableComponents> | A_TYPES__ScopeResolvableComponents[])[]>;
    /**
     * Resolves the component of the step
     *
     * @param step
     * @returns
     */
    protected getStepComponent(scope: A_Scope, step: A_TYPES__A_StageStep): A_TYPES__ScopeResolvableComponents;
    /**
     * Calls the handler of the step
     *
     * @param step
     * @returns
     */
    protected callStepHandler(step: A_TYPES__A_StageStep, scope: A_Scope): Promise<any>;
    skip(): void;
    /**
     * This method processes the stage by executing all the steps
     *
     * @param scope - Scope to be used to resolve the steps dependencies
     */
    process(
    /**
     * Scope to be used to resolve the steps dependencies
     */
    scope?: A_Scope): Promise<void>;
    protected completed(): void;
    protected failed(error: Error | A_Error | any): void;
    /**
     * Serializes the stage to JSON
     *
     */
    toJSON(): A_TYPES__Stage_Serialized;
    /**
     * Returns a string representation of the stage
     *
     * @returns
     */
    toString(): string;
}
