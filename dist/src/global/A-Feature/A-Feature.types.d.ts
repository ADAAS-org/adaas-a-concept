import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
export type A_TYPES__FeatureIteratorReturn<T extends any = any> = () => Promise<T>;
export type A_TYPES__FeatureCallParams = {
    fragments: Array<A_Fragment>;
    entities: Array<A_Entity<any, any>>;
    components: Array<{
        new (...args: any[]): any;
    }>;
};
export type A_TYPES__FeatureConstructor = {
    /**
     * Name of the A-Feature
     */
    name: string;
    /**
     * Steps that compose the A-Feature
     */
    steps: A_TYPES__A_StageStep[];
    /**
     * Scope in which the A-Feature will be executed
     */
    scope: A_Scope;
};
export declare enum A_TYPES__FeatureState {
    INITIALIZED = "INITIALIZED",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED"
}
