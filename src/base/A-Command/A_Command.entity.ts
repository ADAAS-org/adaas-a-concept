import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Command_Constructor, A_TYPES__Command_Listener, A_TYPES__Command_Serialized } from "./A_Command.types";
import { A_Error } from "@adaas/a-utils";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_CommandContext } from "./context/A_Command.context";
import { A_CONSTANTS__A_Command_Event, A_CONSTANTS__A_Command_Status, A_CONSTANTS_A_Command_Features } from "./A_Command.constants";


export class A_Command<
    InvokeType extends A_TYPES__Command_Constructor = A_TYPES__Command_Constructor,
    ResultType extends Record<string, any> = Record<string, any>
> extends A_Entity<
    InvokeType,
    A_TYPES__Command_Serialized<ResultType>
> {

    protected _scope!: A_Scope;
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
        return this._scope;
    }

    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     * 
     */
    get Code(): string {
        return (this.constructor as typeof A_Command).name;
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
        super(params as any);
    }


    // --------------------------------------------------------------------------
    // A-Command Core Features
    // --------------------------------------------------------------------------


    /**
     * Executes the command logic.
     */
    @A_Feature.Define()
    async [A_CONSTANTS_A_Command_Features.EXECUTE](): Promise<any> {
        this._status = A_CONSTANTS__A_Command_Status.IN_PROGRESS;
        this._startTime = new Date();
        try {
            await this.call('execute', this._scope);
            await this.complete();
        } catch (error) {
            await this.fail();
        }
    }

    /**
     * Marks the command as completed
     */
    @A_Feature.Define()
    async [A_CONSTANTS_A_Command_Features.COMPLETE]() {
        this._status = A_CONSTANTS__A_Command_Status.COMPLETED;
        this._endTime = new Date();
        this._result = this.Scope.resolve(A_CommandContext).toJSON() as ResultType;

        this.call('complete', this._scope);
    }


    /**
     * Marks the command as failed
     */
    @A_Feature.Define()
    async [A_CONSTANTS_A_Command_Features.FAIL]() {
        this._status = A_CONSTANTS__A_Command_Status.FAILED;
        this._endTime = new Date();
        this._errors = this.Scope.resolve(A_CommandContext).Errors;

        this.call('fail', this._scope);
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
        super.fromNew(newEntity);


        this._params = newEntity;

        this._status = A_CONSTANTS__A_Command_Status.INITIALIZED;

        this._scope = new A_Scope({
            name: `a-command-scope::${this.id}`,
            fragments: [
                new A_CommandContext<ResultType>()
            ]
        });
    }



    /**
     * Allows to convert serialized data to Command instance
     * 
     * [!] By default it omits params as they are not stored in the serialized data
     * 
     * @param serialized 
     */
    fromJSON(serialized: A_TYPES__Command_Serialized<ResultType>): void {
        super.fromJSON(serialized);
        if (serialized.startedAt) this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt) this._endTime = new Date(serialized.endedAt);


        const context = new A_CommandContext<ResultType>();

        this._scope = new A_Scope({
            name: `a-command-scope::${this.id}`,
            fragments: [
                context
            ]
        })
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
            ...super.toJSON(),
            code: this.Code,
            status: this._status,
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            duration: this.Duration,
            result: this.Result,
            errors: this.Errors ? Array.from(this.Errors).map(err => err.toJSON()) : undefined
        }
    };

}
