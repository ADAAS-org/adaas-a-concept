import { A_TYPES__Command_Constructor, A_TYPES__Command_Listener, A_TYPES__Command_Serialized } from "./A-Command.types";
import { A_Error, ASEID } from "@adaas/a-utils";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status } from "./A-Command.constants";
export declare class A_Command<InvokeType extends A_TYPES__Command_Constructor = A_TYPES__Command_Constructor, ResultType extends Record<string, any> = Record<string, any>> {
    /**
     * Command Identifier that corresponds to the class name
     */
    static get code(): string;
    /**
     * DEFAULT Namespace of the command from environment variable A_CONCEPT_NAMESPACE
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get namespace(): string;
    /**
     * DEFAULT Scope of the command from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group commands together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string;
    /**
     * ASEID is a command identifier that is unique across the system
     * A - A_Concept or Application
     * S - System or Scope
     * E - Entity
     * ID - Identifier
     *
     * [!] ASEID is immutable and should not be changed after the entity is created
     *
     * [!] ASEID is composed of the following parts:
     * - namespace: an application specific identifier from where the command is coming from
     * - scope: the scope of the command from Application Namespace
     * - entity: the name of the command from Application Namespace
     * - id: the unique identifier of the command
     *
     * [!] For more information about ASEID, please refer to the ASEID class documentation
     */
    aseid: ASEID;
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
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number;
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string;
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string;
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     *
     */
    get entity(): string;
    /**
     * Executes the command logic.
     */
    execute(): Promise<any>;
    /**
     * Marks the command as completed
     */
    complete(): Promise<void>;
    /**
     * Marks the command as failed
     */
    fail(): Promise<void>;
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
    /**
     * Call a feature of the component with the provided scope
     *
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature: string, scope?: A_Scope): Promise<any>;
}
