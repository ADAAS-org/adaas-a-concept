import { A_Entity } from "../../global/A-Entity/A-Entity.class";
import { A_TYPES__Command_Constructor, A_TYPES__Command_Listener, A_TYPES__Command_Serialized } from "./A_Command.types";
import { A_Error } from "@adaas/a-utils";
import { A_Scope } from "../../global/A-Scope/A-Scope.class";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status, A_CONSTANTS_A_Command_Features } from "./A_Command.constants";
export declare class A_Command<InvokeType extends A_TYPES__Command_Constructor = A_TYPES__Command_Constructor, ResultType extends Record<string, any> = Record<string, any>> extends A_Entity<InvokeType, A_TYPES__Command_Serialized<ResultType>> {
    protected _scope: A_Scope;
    protected _result?: ResultType;
    protected _errors?: Set<A_Error>;
    protected _params: InvokeType;
    protected _status: A_CONSTANTS__A_Command_Status;
    protected _listeners: Map<A_CONSTANTS__A_Command_Event, Set<A_TYPES__Command_Listener<ResultType>>>;
    protected _startTime?: Date;
    protected _endTime?: Date;
    /**
     * Execution Duration in milliseconds
     */
    get Duration(): number | undefined;
    /**
     * Command Execution A-Scope that inherits from scope where command was created
     *
     * Command execution context is stored in A_CommandContext fragment within this scope
     */
    get Scope(): A_Scope;
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get Code(): string;
    /**
     * Current status of the command
     */
    get Status(): A_CONSTANTS__A_Command_Status;
    /**
     * Start time of the command execution
     */
    get StartedAt(): Date | undefined;
    /**
     * End time of the command execution
     */
    get EndedAt(): Date | undefined;
    /**
     * Result of the command execution stored in the context
     */
    get Result(): ResultType | undefined;
    /**
     * Errors encountered during the command execution stored in the context
     */
    get Errors(): Set<A_Error> | undefined;
    /**
     * Parameters used to invoke the command
     */
    get Params(): InvokeType;
    /**
     *
     * A-Command represents an executable command with a specific code and parameters.
     * It can be executed within a given scope and stores execution results and errors.
     *
     *
     * A-Command should be context independent and execution logic should be based on attached components
     *
     * @param code
     * @param params
     */
    constructor(
    /**
     * Command invocation parameters
     */
    params: InvokeType | A_TYPES__Command_Serialized<ResultType>);
    /**
     * Executes the command logic.
     */
    [A_CONSTANTS_A_Command_Features.EXECUTE](): Promise<any>;
    /**
     * Marks the command as completed
     */
    [A_CONSTANTS_A_Command_Features.COMPLETE](): Promise<void>;
    /**
     * Marks the command as failed
     */
    [A_CONSTANTS_A_Command_Features.FAIL](): Promise<void>;
    /**
     * Registers an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    on(event: A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<ResultType>): void;
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event: A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<ResultType>): void;
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event: A_CONSTANTS__A_Command_Event): void;
    /**
     * Allows to create a Command instance from new data
     *
     * @param newEntity
     */
    fromNew(newEntity: InvokeType): void;
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<ResultType>): void;
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON(): A_TYPES__Command_Serialized<ResultType>;
}
