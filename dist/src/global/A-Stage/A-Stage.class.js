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
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
class A_Stage {
    /**
     * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
     * Each stage may contain one or more functions.
     * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
     *
     * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
     */
    constructor(feature, steps = []) {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.INITIALIZED;
        this._feature = feature;
        this._steps = steps;
    }
    get name() {
        return this.toString();
    }
    get before() {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), []);
    }
    get after() {
        return this._steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), []);
    }
    get steps() {
        return this._steps;
    }
    get asyncSteps() {
        return this._steps.filter(step => step.behavior === 'async');
    }
    get syncSteps() {
        return this._steps.filter(step => step.behavior === 'sync');
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
     * Adds a step to the stage
     *
     * @param step
     * @returns
     */
    add(step) {
        this._steps.push(step);
        return this;
    }
    /**
     * Resolves the component of the step
     *
     * @param step
     * @returns
     */
    getStepInstance(scope, step) {
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
            const instance = yield this.getStepInstance(scope, step);
            const callArgs = yield this.getStepArgs(scope, step);
            return yield instance[step.handler](...callArgs);
        });
    }
    skip() {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.SKIPPED;
    }
    process(
    /**
     * Scope to be used to resolve the steps dependencies
     */
    param1, 
    /**
     * Extra parameters to control the steps processing
     */
    param2) {
        return __awaiter(this, void 0, void 0, function* () {
            const scope = A_TypeGuards_helper_1.A_TypeGuards.isScopeInstance(param1)
                ? param1
                : A_Context_class_1.A_Context.scope(this._feature);
            const params = A_TypeGuards_helper_1.A_TypeGuards.isScopeInstance(param1)
                ? param2
                : param1;
            if (!this.processed)
                this.processed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.PROCESSING;
                        if ((params === null || params === void 0 ? void 0 : params.steps) && params.steps.length) {
                            params.steps.forEach(step => this.add(step));
                        }
                        const syncSteps = this.syncSteps.filter((params === null || params === void 0 ? void 0 : params.filter) || (() => true));
                        const asyncSteps = this.asyncSteps.filter((params === null || params === void 0 ? void 0 : params.filter) || (() => true));
                        // Run sync _steps
                        yield Promise
                            .all([
                            // Run async _steps that are independent of each other
                            ...asyncSteps.map(step => this.callStepHandler(step, scope)),
                            // Run sync _steps that are dependent on each other
                            new Promise((r, j) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    for (const step of syncSteps) {
                                        // console.log(' - -> Processing stage step:', step.handler, ' with Regexp: ', step.name);
                                        yield this.callStepHandler(step, scope);
                                        // console.log(' - -> Finished processing stage step:', step.handler);
                                    }
                                    return r();
                                }
                                catch (error) {
                                    return j(error);
                                }
                            }))
                        ]);
                        this.completed();
                        return resolve();
                    }
                    catch (error) {
                        this.failed(error);
                        return reject(error);
                    }
                }));
            return this.processed;
        });
    }
    // ==========================================
    // ============ Status methods =============
    // ==========================================
    completed() {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.COMPLETED;
    }
    failed(error) {
        this._error = error;
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.FAILED;
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
        return [
            this._feature.name,
            '::a-stage:',
            '[sync:',
            this
                .syncSteps
                .map(s => typeof s.component === 'string' ? s.component : s.component.name + '.' + s.handler)
                .join(' -> '),
            ']',
            '[async:',
            this
                .asyncSteps
                .map(s => typeof s.component === 'string' ? s.component : s.component.name + '.' + s.handler)
                .join(' -> '),
            ']'
        ].join('');
    }
}
exports.A_Stage = A_Stage;
//# sourceMappingURL=A-Stage.class.js.map