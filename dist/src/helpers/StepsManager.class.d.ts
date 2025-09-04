import { A_Feature } from "../global/A-Feature/A-Feature.class";
import { A_Stage } from "../global/A-Stage/A-Stage.class";
import { A_TYPES__A_StageStep } from "../global/A-Stage/A-Stage.types";
export declare class StepsManager {
    entities: A_TYPES__A_StageStep[];
    graph: Map<string, Set<string>>;
    visited: Set<string>;
    tempMark: Set<string>;
    sortedEntities: string[];
    constructor(entities: A_TYPES__A_StageStep[]);
    private ID;
    private buildGraph;
    private matchEntities;
    private visit;
    toStages(feature: A_Feature): Array<A_Stage>;
}
export declare class A_TmpStage {
    readonly name: string;
    private readonly _steps;
    constructor(_steps?: A_TYPES__A_StageStep[]);
    get before(): string[];
    get after(): string[];
    get steps(): A_TYPES__A_StageStep[];
    get asyncSteps(): A_TYPES__A_StageStep[];
    get syncSteps(): A_TYPES__A_StageStep[];
    /**
     * Adds a step to the stage
     *
     * @param step
     * @returns
     */
    add(step: A_TYPES__A_StageStep): this;
}
