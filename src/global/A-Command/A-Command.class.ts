import { A_TYPES__Command_Constructor, A_TYPES__Command_Listener, A_TYPES__Command_Serialized } from "./A-Command.types";
import { A_CommonHelper, A_Error, ASEID } from "@adaas/a-utils";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_CommandContext } from "./context/A_Command.context";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status } from "./A-Command.constants";
import { A_Context } from "../A-Context/A-Context.class";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";


export class A_Command<
    InvokeType extends A_TYPES__Command_Constructor = A_TYPES__Command_Constructor,
    ResultType extends Record<string, any> = Record<string, any>
> {

    // ====================================================================
    // ================== Static A-Command Information ====================
    // ====================================================================

    /**
     * Command Identifier that corresponds to the class name
     */
    static get code(): string {
        return A_CommonHelper.toKebabCase(this.name);
    }

    /**
     * DEFAULT Namespace of the command from environment variable A_CONCEPT_NAMESPACE
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get namespace(): string {
        return A_Context.root.name;
    }

    /**
     * DEFAULT Scope of the command from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group commands together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope(): string {
        return process && process.env ? process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_DEFAULT_SCOPE] || 'core' : 'core';
    }

    // ====================================================================
    // ================ Instance A-Command Information ====================
    // ====================================================================

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
    aseid!: ASEID;

    protected _result?: ResultType;
    protected _errors?: Set<A_Error>;

    protected _params!: InvokeType;
    protected _status!: A_CONSTANTS__A_Command_Status

    protected _listeners: Map<A_CONSTANTS__A_Command_Event, Set<A_TYPES__Command_Listener<ResultType>>> = new Map();

    protected _startTime?: Date;
    protected _endTime?: Date

    /**
     * Execution Duration in milliseconds
     */
    get Duration() {
        return this._endTime && this._startTime
            ? this._endTime.getTime() - this._startTime.getTime()
            : this._startTime
                ? new Date().getTime() - this._startTime.getTime()
                : undefined;
    }


    /**
     * Command Execution A-Scope that inherits from scope where command was created
     * 
     * Command execution context is stored in A_CommandContext fragment within this scope
     */
    get Scope(): A_Scope {
        return A_Context.scope(this);
    }

    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     * 
     */
    get Code(): string {
        return (this.constructor as typeof A_Command).code;
    }
    /**
     * Current status of the command
     */
    get Status(): A_CONSTANTS__A_Command_Status {
        return this._status;
    }
    /**
     * Start time of the command execution
     */
    get StartedAt(): Date | undefined {
        return this._startTime;
    }
    /**
     * End time of the command execution
     */
    get EndedAt(): Date | undefined {
        return this._endTime;
    }
    /**
     * Result of the command execution stored in the context
     */
    get Result(): ResultType | undefined {
        return this._result;
    }
    /**
     * Errors encountered during the command execution stored in the context
     */
    get Errors(): Set<A_Error> | undefined {
        return this._errors;
    }
    /**
     * Parameters used to invoke the command
     */
    get Params(): InvokeType {
        return this._params;
    }


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
        params: InvokeType | A_TYPES__Command_Serialized<ResultType>
    ) {
        if (params && typeof params === 'object' && 'aseid' in params) {
            this.fromJSON(params);
        } else {
            this.fromNew(params);
        }
    }

    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id(): string | number {
        return this.aseid.id;
    }

    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace(): string {
        return this.aseid.namespace
    }

    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope(): string {
        return this.aseid.scope;
    }

    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     * 
     */
    get entity(): string {
        return this.aseid.entity;
    }


    // --------------------------------------------------------------------------
    // A-Command Core Features
    // --------------------------------------------------------------------------


    /**
     * Executes the command logic.
     */
    async execute(): Promise<any> {
        this._status = A_CONSTANTS__A_Command_Status.IN_PROGRESS;
        this._startTime = new Date();

        try {
            await this.call('execute');
            await this.complete();

        } catch (error) {
            await this.fail();
        }
    }

    /**
     * Marks the command as completed
     */
    async complete() {
        this._status = A_CONSTANTS__A_Command_Status.COMPLETED;
        this._endTime = new Date();
        this._result = this.Scope.resolve(A_CommandContext).toJSON() as ResultType;

        this.call('complete');
    }


    /**
     * Marks the command as failed
     */
    async fail() {
        this._status = A_CONSTANTS__A_Command_Status.FAILED;
        this._endTime = new Date();
        this._errors = this.Scope.resolve(A_CommandContext).Errors;

        this.call('fail');
    }


    // --------------------------------------------------------------------------   
    // A-Command Event-Emitter methods
    // --------------------------------------------------------------------------

    /**
     * Registers an event listener for a specific event
     * 
     * @param event 
     * @param listener 
     */
    on(event: A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<ResultType>) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event)!.add(listener);
    }
    /**
     * Removes an event listener for a specific event
     * 
     * @param event 
     * @param listener 
     */
    off(event: A_CONSTANTS__A_Command_Event, listener: A_TYPES__Command_Listener<ResultType>) {
        this._listeners.get(event)?.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     * 
     * @param event 
     */
    emit(event: A_CONSTANTS__A_Command_Event) {
        this._listeners.get(event)?.forEach(listener => {
            listener(this);
        });
    }


    // --------------------------------------------------------------------------
    // A-Entity Base Class Overrides
    // --------------------------------------------------------------------------
    // Serialization / Deserialization
    // -------------------------------------------------------------------------


    /**
     * Allows to create a Command instance from new data
     * 
     * @param newEntity 
     */
    fromNew(newEntity: InvokeType): void {

        this.aseid = new ASEID({
            namespace: (this.constructor as typeof A_Command).namespace,
            scope: (this.constructor as typeof A_Command).scope,
            entity: (this.constructor as typeof A_Command).code,
            id: `${new Date().getTime().toString()}-${Math.floor(Math.random() * 10000000).toString()}`,
        });

        A_Context.allocate(this, {
            name: `a-command-scope::${this.id}`,
            fragments: [
                new A_CommandContext<ResultType>()
            ]
        });

        this._params = newEntity;

        this._status = A_CONSTANTS__A_Command_Status.INITIALIZED;
    }



    /**
     * Allows to convert serialized data to Command instance
     * 
     * [!] By default it omits params as they are not stored in the serialized data
     * 
     * @param serialized 
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<ResultType>): void {
        this.aseid = new ASEID(serialized.aseid);
        const context = new A_CommandContext<ResultType>();

        A_Context.allocate(this, {
            name: `a-command-scope::${this.id}`,
            fragments: [
                context
            ]
        });

        if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);



        // Restore result and errors in the context
        if (serialized.result) {
            Object.entries(serialized.result).forEach(([key, value]) => {
                context.save(key, value);
            });
        }

        if (serialized.errors) {
            serialized.errors.forEach(err => {
                context.error(new A_Error(err));
            });
        }

        this._status = serialized.status || A_CONSTANTS__A_Command_Status.INITIALIZED;
    }


    /**
     * Converts the Command instance to a plain object
     * 
     * @returns 
     */
    toJSON(): A_TYPES__Command_Serialized<ResultType> {
        return {
            aseid: this.aseid.toString(),
            code: this.Code,
            status: this._status,
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            duration: this.Duration,
            result: this.Result,
            errors: this.Errors ? Array.from(this.Errors).map(err => err.toJSON()) : undefined
        }
    };



    /**
     * Call a feature of the component with the provided scope
     * 
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     * 
     * @param lifecycleMethod 
     * @param args 
     */
    async call(
        feature: string,
        scope: A_Scope = this.Scope
    ) {
        if (scope && !scope.isInheritedFrom(this.Scope)) {
            scope = scope.inherit(this.Scope);
        }

        const newFeature = A_Context.feature(this, feature, scope);

        return await newFeature.process();
    }

}
