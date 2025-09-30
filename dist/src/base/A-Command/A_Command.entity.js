"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Command = void 0;
const A_Entity_class_1 = require("../../global/A-Entity/A-Entity.class");
const a_utils_1 = require("@adaas/a-utils");
const A_Scope_class_1 = require("../../global/A-Scope/A-Scope.class");
const A_Feature_class_1 = require("../../global/A-Feature/A-Feature.class");
const A_Command_context_1 = require("./context/A_Command.context");
const A_Command_constants_1 = require("./A_Command.constants");
class A_Command extends A_Entity_class_1.A_Entity {
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
        return this._scope;
    }
    /**
     * Unique code identifying the command type
     * Example: 'user.create', 'task.complete', etc.
     *
     */
    get Code() {
        return this.constructor.name;
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
        super(params);
        this._listeners = new Map();
    }
    // --------------------------------------------------------------------------
    // A-Command Core Features
    // --------------------------------------------------------------------------
    /**
     * Executes the command logic.
     */
    [_a = A_Command_constants_1.A_CONSTANTS_A_Command_Features.EXECUTE]() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.IN_PROGRESS;
            this._startTime = new Date();
            try {
                yield this.call('execute', this._scope);
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
    [_b = A_Command_constants_1.A_CONSTANTS_A_Command_Features.COMPLETE]() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.COMPLETED;
            this._endTime = new Date();
            this._result = this.Scope.resolve(A_Command_context_1.A_CommandContext).toJSON();
            this.call('complete', this._scope);
        });
    }
    /**
     * Marks the command as failed
     */
    [_c = A_Command_constants_1.A_CONSTANTS_A_Command_Features.FAIL]() {
        return __awaiter(this, void 0, void 0, function* () {
            this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.FAILED;
            this._endTime = new Date();
            this._errors = this.Scope.resolve(A_Command_context_1.A_CommandContext).Errors;
            this.call('fail', this._scope);
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
        var _d;
        (_d = this._listeners.get(event)) === null || _d === void 0 ? void 0 : _d.delete(listener);
    }
    /**
     * Emits an event to all registered listeners
     *
     * @param event
     */
    emit(event) {
        var _d;
        (_d = this._listeners.get(event)) === null || _d === void 0 ? void 0 : _d.forEach(listener => {
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
        super.fromNew(newEntity);
        this._params = newEntity;
        this._status = A_Command_constants_1.A_CONSTANTS__A_Command_Status.INITIALIZED;
        this._scope = new A_Scope_class_1.A_Scope({
            name: `a-command-scope::${this.id}`,
            fragments: [
                new A_Command_context_1.A_CommandContext()
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
    fromJSON(serialized) {
        super.fromJSON(serialized);
        if (serialized.startedAt)
            this._startTime = new Date(serialized.startedAt);
        if (serialized.endedAt)
            this._endTime = new Date(serialized.endedAt);
        const context = new A_Command_context_1.A_CommandContext();
        this._scope = new A_Scope_class_1.A_Scope({
            name: `a-command-scope::${this.id}`,
            fragments: [
                context
            ]
        });
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
        return Object.assign(Object.assign({}, super.toJSON()), { code: this.Code, status: this._status, startedAt: this._startTime ? this._startTime.toISOString() : undefined, endedAt: this._endTime ? this._endTime.toISOString() : undefined, duration: this.Duration, result: this.Result, errors: this.Errors ? Array.from(this.Errors).map(err => err.toJSON()) : undefined });
    }
    ;
}
exports.A_Command = A_Command;
__decorate([
    A_Feature_class_1.A_Feature.Define()
], A_Command.prototype, _a, null);
__decorate([
    A_Feature_class_1.A_Feature.Define()
], A_Command.prototype, _b, null);
__decorate([
    A_Feature_class_1.A_Feature.Define()
], A_Command.prototype, _c, null);
//# sourceMappingURL=A_Command.entity.js.map