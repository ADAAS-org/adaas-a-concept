"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Command = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Command_context_1 = require("./context/A_Command.context");
const A_Command_constants_1 = require("./A-Command.constants");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const env_constants_1 = require("../../constants/env.constants");
class A_Command {
    // ====================================================================
    // ================== Static A-Command Information ====================
    // ====================================================================
    /**
     * Command Identifier that corresponds to the class name
     */
    static get code() {
        return a_utils_1.A_CommonHelper.toKebabCase(this.name);
    }
    /**
     * DEFAULT Namespace of the command from environment variable A_CONCEPT_NAMESPACE
     * [!] If environment variable is not set, it will default to 'a-concept'
     */
    static get namespace() {
        return A_Context_class_1.A_Context.root.name;
    }
    /**
     * DEFAULT Scope of the command from environment variable A_CONCEPT_DEFAULT_SCOPE
     * [!] If environment variable is not set, it will default to 'core'
     * [!] Scope is an application specific identifier that can be used to group commands together
     * [!] e.g. 'default', 'core', 'public', 'internal', etc
     */
    static get scope() {
        return process && process.env ? process.env[env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_DEFAULT_SCOPE] || 'core' : 'core';
    }
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
    get Scope() {
        return A_Context_class_1.A_Context.scope(this);
    }
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get Code() {
        return this.constructor.code;
    }
    /**
     * Current status of the command
     */
    get Status() {
        return this._status;
    }
    /**
     * Start time of the command execution
     */
    get StartedAt() {
        return this._startTime;
    }
    /**
     * End time of the command execution
     */
    get EndedAt() {
        return this._endTime;
    }
    /**
     * Result of the command execution stored in the context
     */
    get Result() {
        return this._result;
    }
    /**
     * Errors encountered during the command execution stored in the context
     */
    get Errors() {
        return this._errors;
    }
    /**
     * Parameters used to invoke the command
     */
    get Params() {
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
    params) {
        this._listeners = new Map();
        if (params && typeof params === 'object' && 'aseid' in params) {
            this.fromJSON(params);
        }
        else {
            this.fromNew(params);
        }
    }
    /**
     * Extracts the ID from the ASEID
     * ID is the unique identifier of the entity
     */
    get id() {
        return this.aseid.id;
    }
    /**
     * Extracts the namespace from the ASEID
     * namespace is an application specific identifier from where the entity is coming from
     */
    get namespace() {
        return this.aseid.namespace;
    }
    /**
     * Extracts the scope from the ASEID
     * scope is the scope of the entity from Application Namespace
     */
    get scope() {
        return this.aseid.scope;
    }
    /**
     * Extracts the entity from the ASEID
     * entity is the name of the entity from Application Namespace
     *
     */
    get entity() {
        return this.aseid.entity;
    }
    // --------------------------------------------------------------------------
    // A-Command Core Features
    // --------------------------------------------------------------------------
    /**
     * Executes the command logic.
     */
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.IN_PROGRESS;
            this._startTime = new Date();
            try {
                yield this.call('execute');
                yield this.complete();
            }
            catch (error) {
                yield this.fail();
            }
        });
    }
    /**
     * Marks the command as completed
     */
    complete() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.COMPLETED;
            this._endTime = new Date();
            this._result = this.Scope.resolve(A_Command_context_1.A_CommandContext).toJSON();
            this.call('complete');
        });
    }
    /**
     * Marks the command as failed
     */
    fail() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.FAILED;
            this._endTime = new Date();
            this._errors = this.Scope.resolve(A_Command_context_1.A_CommandContext).Errors;
            this.call('fail');
        });
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
    on(event, listener) {
        if (!this._listeners.has(event)) {
            this._listeners.set(event, new Set());
        }
        this._listeners.get(event).add(listener);
    }
    /**
     * Removes an event listener for a specific event
     *
     * @param event
     * @param listener
     */
    off(event, listener) {
        var _a;
        (_a = this._listeners.get(event)) === null || _a === void 0 ? void 0 : _a.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event) {
        var _a;
        (_a = this._listeners.get(event)) === null || _a === void 0 ? void 0 : _a.forEach(listener => {
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
    fromNew(newEntity) {
        this.aseid = new a_utils_1.ASEID({
            namespace: this.constructor.namespace,
            scope: this.constructor.scope,
            entity: this.constructor.code,
            id: `${new Date().getTime().toString()}-${Math.floor(Math.random() * 10000000).toString()}`,
        });
        A_Context_class_1.A_Context.allocate(this, {
            name: `a-command-scope::${this.id}`,
            fragments: [
                new A_Command_context_1.A_CommandContext()
            ]
        });
        this._params = newEntity;
        this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.INITIALIZED;
    }
    /**
     * Allows to convert serialized data to Command instance
     *
     * [!] By default it omits params as they are not stored in the serialized data
     *
     * @param serialized
     */
    fromJSON(serialized) {
        this.aseid = new a_utils_1.ASEID(serialized.aseid);
        const context = new A_Command_context_1.A_CommandContext();
        A_Context_class_1.A_Context.allocate(this, {
            name: `a-command-scope::${this.id}`,
            fragments: [
                context
            ]
        });
        if (serialized.startedAt)
            this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt)
            this._endTime = new Date(serialized.endedAt);
        // Restore result and errors in the context
        if (serialized.result) {
            Object.entries(serialized.result).forEach(([key, value]) => {
                context.save(key, value);
            });
        }
        if (serialized.errors) {
            serialized.errors.forEach(err => {
                context.error(new a_utils_1.A_Error(err));
            });
        }
        this._status = serialized.status || A_Command_constants_1.A_CONSTANTS__A_Command_Status.INITIALIZED;
    }
    /**
     * Converts the Command instance to a plain object
     *
     * @returns
     */
    toJSON() {
        return {
            aseid: this.aseid.toString(),
            code: this.Code,
            status: this._status,
            startedAt: this._startTime ? this._startTime.toISOString() : undefined,
            endedAt: this._endTime ? this._endTime.toISOString() : undefined,
            duration: this.Duration,
            result: this.Result,
            errors: this.Errors ? Array.from(this.Errors).map(err => err.toJSON()) : undefined
        };
    }
    ;
    /**
     * Call a feature of the component with the provided scope
     *
     * [!] If the provided scope is not inherited from the entity scope, it will be inherited
     *
     * @param lifecycleMethod
     * @param args
     */
    call(feature_1) {
        return __awaiter(this, arguments, void 0, function* (feature, scope = this.Scope) {
            if (scope && !scope.isInheritedFrom(this.Scope)) {
                scope = scope.inherit(this.Scope);
            }
            const newFeature = A_Context_class_1.A_Context.feature(this, feature, scope);
            return yield newFeature.process();
        });
    }
}
exports.A_Command = A_Command;
//# sourceMappingURL=A-Command.class.js.map