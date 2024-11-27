import { A_Error } from "@adaas/a-utils";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_Stage_JSON, A_TYPES__A_Stage_Status, A_TYPES__A_StageStep } from "./A-Stage.types";
import { A_Container } from "../A-Container/A-Container.class";
/**
 * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
 * Each stage may contain one or more functions.
 * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
 *
 * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
 */
export declare class A_Stage {
    private feature;
    private steps;
    constructor(feature: A_Feature, steps?: A_TYPES__A_StageStep[]);
    status: A_TYPES__A_Stage_Status;
    /**
     * Promise that will be resolved when the stage is Processed
     */
    processed: Promise<void> | undefined;
    get before(): string[];
    get after(): string[];
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    protected getStepArgs(step: A_TYPES__A_StageStep): Promise<Promise<import("../A-Fragment/A-Fragment.class").A_Fragment | import("../A-Component/A-Component.class").A_Component<any> | import("../A-Scope/A-Scope.class").A_Scope | A_Container<any> | import("../A-Entity/A-Entity.class").A_Entity<any, any, any> | A_Feature | this>[]>;
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
    protected getStepInstance(step: A_TYPES__A_StageStep): import("../A-Component/A-Component.class").A_Component<any> | A_Container<any>;
    /**
     * Calls the handler of the step
     *
     * @param step
     * @returns
     */
    protected getStepHandler(step: A_TYPES__A_StageStep): Promise<any>;
    /**
     * Runs async all the steps of the stage
     *
     * @returns
     */
    process(): Promise<void>;
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
