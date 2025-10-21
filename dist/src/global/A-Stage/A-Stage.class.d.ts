import { A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status, A_TYPES__A_StageStep, A_TYPES__A_StageStepProcessingExtraParams } from "./A-Stage.types";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Error } from "../A-Error/A_Error.class";
import { A_TYPES__ScopeResolvableComponents } from "../A-Scope/A-Scope.types";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
export declare class A_Stage {
    private readonly _feature;
    private readonly _steps;
    private _error?;
    /**
     * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
     * Each stage may contain one or more functions.
     * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
     *
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
     */
    constructor(feature: A_Feature, steps?: A_TYPES__A_StageStep[]);
    status: A_TYPES__A_Stage_Status;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;
    get name(): string;
    get before(): string[];
    get after(): string[];
    get steps(): A_TYPES__A_StageStep[];
    get asyncSteps(): A_TYPES__A_StageStep[];
    get syncSteps(): A_TYPES__A_StageStep[];
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    protected getStepArgs(scope: A_Scope, step: A_TYPES__A_StageStep): Promise<(import("../A-Component/A-Component.class").A_Component | import("../A-Container/A-Container.class").A_Container | import("../A-Entity/A-Entity.class").A_Entity<any, import("../A-Entity/A-Entity.types").A_TYPES__Entity_Serialized> | A_Scope<A_TYPES__Component_Constructor[], import("../A-Error/A_Error.types").A_TYPES__Error_Constructor[], import("../A-Entity/A-Entity.types").A_TYPES__Entity_Constructor[], import("../A-Fragment/A-Fragment.class").A_Fragment<any>[]> | import("../A-Fragment/A-Fragment.class").A_Fragment<any> | A_Feature<import("../A-Feature/A-Feature.types").A_TYPES__FeatureAvailableComponents> | A_TYPES__ScopeResolvableComponents[])[]>;
    /**
     * Adds a step to the stage
     *
     * @param step
     * @returns
     */
    add(step: A_TYPES__A_StageStep): this;
    /**
     * Resolves the component of the step
     *
     * @param step
     * @returns
     */
    protected getStepInstance(scope: A_Scope, step: A_TYPES__A_StageStep): A_TYPES__ScopeResolvableComponents;
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
    process(
    /**
     * Extra parameters to control the steps processing
     */
    params?: Partial<A_TYPES__A_StageStepProcessingExtraParams>): Promise<void>;
    protected completed(): void;
    protected failed(error: Error | A_Error | any): void;
    /**
     * Serializes the stage to JSON
     *
     */
    toJSON(): A_TYPES__A_Stage_JSON;
    /**
     * Returns a string representation of the stage
     *
     * @returns
     */
    toString(): string;
}
