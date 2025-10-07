import { A_Command } from "./A-Command.class";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status } from "./A-Command.constants";
import { A_TYPES__Error } from "@adaas/a-utils";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__A_DefineDecorator_Meta, A_TYPES__A_ExtendDecorator_Meta } from "../../decorators/A-Feature/A-Feature.decorator.types";
export type A_TYPES__Command_Constructor = {};
export type A_TYPES__Command_Serialized<ResultType extends Record<string, any> = Record<string, any>> = {
    aseid: string;
    code: string;
    status: A_CONSTANTS__A_Command_Status;
    startedAt?: string;
    endedAt?: string;
    duration?: number;
    result?: ResultType;
    errors?: Array<A_TYPES__Error>;
};
export type A_TYPES__Command_Listener<InvokeType extends A_TYPES__Command_Constructor = A_TYPES__Command_Constructor, ResultType extends Record<string, any> = Record<string, any>, LifecycleEvents extends string = A_CONSTANTS__A_Command_Event> = (command?: A_Command<InvokeType, ResultType, LifecycleEvents>) => void;
export type A_TYPES__CommandMeta = {
    [A_TYPES__CommandMetaKey.EXTENSIONS]: A_Meta<{
        /**
         * Where Key the regexp for what to apply the extension
         * A set of container names or a wildcard, or a regexp
         *
         *
         * Where value is the extension instructions
         */
        [Key: string]: A_TYPES__A_ExtendDecorator_Meta[];
    }>;
    case: any;
    [A_TYPES__CommandMetaKey.FEATURES]: A_Meta<{
        /**
         * Where Key is the name of the feature
         *
         * Where value is the list of features
         */
        [Key: string]: A_TYPES__A_DefineDecorator_Meta;
    }>;
};
export declare enum A_TYPES__CommandMetaKey {
    EXTENSIONS = "a-command-extensions",
    FEATURES = "a-command-features",
    ABSTRACTIONS = "a-command-abstractions"
}
