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
exports.A_Stage = void 0;
const A_Stage_types_1 = require("./A-Stage.types");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Stage_error_1 = require("./A-Stage.error");
const A_Error_class_1 = require("../A-Error/A_Error.class");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
class A_Stage {
    /**
     * A_Stage is a callable A_Function within A_Feature that should be run with specific parameters.
     * [!] Depending on the Stage Definition type sync/async function can be executed correspondingly.
     *
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
     */
    constructor(
    /**
     * The feature that owns this stage
     */
    feature, 
    /**
     * The step definitions of the stage
     */
    step) {
        /**
         * Indicates the current status of the stage
         */
        this._status = A_Stage_types_1.A_TYPES__A_Stage_Status.INITIALIZED;
        this._feature = feature;
        this._definition = step;
    }
    /**
     * Returns the name of the stage
     */
    get name() {
        return this.toString();
    }
    /**
     * Returns the current status of the stage
     */
    get status() {
        return this._status;
    }
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    getStepArgs(scope, step) {
        return __awaiter(this, void 0, void 0, function* () {
            let resolverConstructor;
            switch (true) {
                case A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(step.component):
                    resolverConstructor = step.component.constructor;
                    break;
                case A_TypeGuards_helper_1.A_TypeGuards.isString(step.component):
                    resolverConstructor = scope.resolveConstructor(step.component);
                    break;
                default:
                    resolverConstructor = step.component;
                    break;
            }
            return Promise
                .all(A_Context_class_1.A_Context
                .meta(resolverConstructor)
                .injections(step.handler)
                .map((arg) => __awaiter(this, void 0, void 0, function* () {
                switch (true) {
                    case A_TypeGuards_helper_1.A_TypeGuards.isCallerConstructor(arg.target):
                        return this._feature.caller.component;
                    case A_TypeGuards_helper_1.A_TypeGuards.isScopeConstructor(arg.target):
                        return scope;
                    case A_TypeGuards_helper_1.A_TypeGuards.isFeatureConstructor(arg.target):
                        return this._feature;
                    case A_TypeGuards_helper_1.A_TypeGuards.isEntityConstructor(arg.target) && 'instructions' in arg:
                        return scope.resolve(arg.target, arg.instructions);
                    default:
                        return scope.resolve(arg.target);
                }
            })));
        });
    }
    /**
     * Resolves the component of the step
     *
     * @param step
     * @returns
     */
    getStepComponent(scope, step) {
        const { component, handler } = step;
        let instance;
        switch (true) {
            case A_TypeGuards_helper_1.A_TypeGuards.isContainerInstance(component):
                instance = component;
                break;
            case A_TypeGuards_helper_1.A_TypeGuards.isString(component):
                instance = scope.resolve(component);
                break;
            default:
                instance = scope.resolve(component);
                break;
        }
        if (!instance)
            throw new A_Stage_error_1.A_StageError(A_Stage_error_1.A_StageError.CompileError, `Unable to resolve component ${typeof component === 'string' ? component : component.name} from scope ${scope.name}`);
        if (!instance[handler])
            throw new A_Stage_error_1.A_StageError(A_Stage_error_1.A_StageError.CompileError, `Handler ${handler} not found in ${instance.constructor.name}`);
        return instance;
    }
    /**
     * Calls the handler of the step
     *
     * @param step
     * @returns
     */
    callStepHandler(step, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            // 1) Resolve component
            const component = yield this.getStepComponent(scope, step);
            // 2) Resolve arguments
            const callArgs = yield this.getStepArgs(scope, step);
            // 3) Call handler
            return yield component[step.handler](...callArgs);
        });
    }
    skip() {
        this._status = A_Stage_types_1.A_TYPES__A_Stage_Status.SKIPPED;
    }
    /**
     * This method processes the stage by executing all the steps
     *
     * @param scope - Scope to be used to resolve the steps dependencies
     */
    process(
    /**
     * Scope to be used to resolve the steps dependencies
     */
    scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetScope = A_TypeGuards_helper_1.A_TypeGuards.isScopeInstance(scope)
                ? scope
                : A_Context_class_1.A_Context.scope(this._feature);
            if (!this._processed)
                this._processed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        this._status = A_Stage_types_1.A_TYPES__A_Stage_Status.PROCESSING;
                        if (this._definition.behavior === 'sync') {
                            // in case we have to wait for the result
                            yield this.callStepHandler(this._definition, targetScope);
                        }
                        else {
                            // in case we don't have to wait for the result
                            this.callStepHandler(this._definition, targetScope);
                        }
                        this.completed();
                        return resolve();
                    }
                    catch (error) {
                        const wrappedError = new A_Error_class_1.A_Error(error);
                        this.failed(wrappedError);
                        if (this._definition.throwOnError) {
                            return resolve();
                        }
                        else {
                            return reject(wrappedError);
                        }
                    }
                }));
            return this._processed;
        });
    }
    // ==========================================
    // ============ Status methods =============
    // ==========================================
    completed() {
        this._status = A_Stage_types_1.A_TYPES__A_Stage_Status.COMPLETED;
    }
    failed(error) {
        this._error = error;
        this._status = A_Stage_types_1.A_TYPES__A_Stage_Status.FAILED;
    }
    // ==========================================
    // ============ Serialization ===============
    // ==========================================
    /**
     * Serializes the stage to JSON
     *
     */
    toJSON() {
        return {
            name: this.name,
            status: this.status,
        };
    }
    /**
     * Returns a string representation of the stage
     *
     * @returns
     */
    toString() {
        return `A-Stage(${this._feature.name}::${this._definition.behavior}@${this._definition.handler})`;
    }
}
exports.A_Stage = A_Stage;
//# sourceMappingURL=A-Stage.class.js.map