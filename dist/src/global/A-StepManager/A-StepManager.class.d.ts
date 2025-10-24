import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__FeatureDefineDecoratorTemplateItem } from "../A-Feature/A-Feature.types";
import { A_Stage } from "../A-Stage/A-Stage.class";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
export declare class A_StepsManager {
    entities: A_TYPES__A_StageStep[];
    graph: Map<string, Set<string>>;
    visited: Set<string>;
    tempMark: Set<string>;
    sortedEntities: string[];
    private _isBuilt;
    constructor(entities: Array<A_TYPES__FeatureDefineDecoratorTemplateItem>);
    private prepareSteps;
    private ID;
    private buildGraph;
    private matchEntities;
    private visit;
    toSortedArray(): Array<string>;
    toStages(feature: A_Feature): Array<A_Stage>;
}
