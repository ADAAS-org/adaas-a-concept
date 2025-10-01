import { A_Error } from "@adaas/a-utils";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status, A_TYPES__A_StageStep, A_TYPES__A_StageStepProcessingExtraParams } from "./A-Stage.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
/**
 * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
 * Each stage may contain one or more functions.
 * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
 *
 * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
 */
export declare class A_Stage {
    readonly name: string;
    private readonly feature;
    private readonly _steps;
    constructor(feature: A_Feature, _steps?: A_TYPES__A_StageStep[]);
    status: A_TYPES__A_Stage_Status;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;
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
    protected getStepArgs(step: A_TYPES__A_StageStep, scope: A_Scope): Promise<(import("../A-Component/A-Component.class").A_Component | A_Container | A_Entity<any, import("../A-Entity/A-Entity.types").A_TYPES__Entity_JSON> | A_Feature | A_Entity<any, import("../A-Entity/A-Entity.types").A_TYPES__Entity_JSON>[] | import("../A-Command/A-Command.class").A_Command<import("../A-Command/A-Command.types").A_TYPES__Command_Constructor, Record<string, any>>)[]>;
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
    protected getStepInstance(step: A_TYPES__A_StageStep): any;
    /**
     * Calls the handler of the step
     *
     * @param step
     * @returns
     */
    protected callStepHandler(step: A_TYPES__A_StageStep, scope: A_Scope): Promise<any>;
    /**
     * Runs async all the _steps of the stage
     *
     * @returns
     */
    process(
    /**
     * Scope to be used to resolve the steps dependencies
     */
    scope?: A_Scope, params?: Partial<A_TYPES__A_StageStepProcessingExtraParams>): Promise<void>;
    /**
     * Skips the stage
     *
     */
    skip(): void;
    protected completed(): void;
    protected failed(error: Error | A_Error | unknown): void;
    /**
     * Serializes the stage to JSON
     *
     */
    toJSON(): A_TYPES__A_Stage_JSON;
}
