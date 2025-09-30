import { A_TYPES__Entity_JSON } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_CommandContext } from "./context/A_Command.context";
import { A_Command } from "./A_Command.entity";
import { A_CONSTANTS__A_Command_Status } from "./A_Command.constants";
import { A_Error, A_TYPES__Error } from "@adaas/a-utils";



export type A_TYPES__Command_Constructor = {
}



export type A_TYPES__Command_Serialized<
    ResultType extends Record<string, any> = Record<string, any>
> = {
    code: string;
    status: A_CONSTANTS__A_Command_Status;

    startedAt?: string;
    endedAt?: string;
    duration?: number;

    result?: ResultType;
    errors?: Array<A_TYPES__Error>;

} & A_TYPES__Entity_JSON




export type A_TYPES__Command_Listener<
    T extends Record<string, any> = Record<string, any>
> = (command?: A_Command<any, T>) => void;