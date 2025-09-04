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
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
const A_Stage_types_1 = require("./A-Stage.types");
const A_Container_class_1 = require("../A-Container/A-Container.class");
const A_Scope_class_1 = require("../A-Scope/A-Scope.class");
const A_Stage_error_1 = require("./A-Stage.error");
/**
 * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
 * Each stage may contain one or more functions.
 * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
 *
 * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
 */
class A_Stage {
    constructor(feature, _steps = []) {
        this.name = 'A_Stage';
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.INITIALIZED;
        this.feature = feature;
        this._steps = _steps;
        this.name = `${this.feature.name}::a-stage:[sync:${this
            .syncSteps
            .map(s => s.component.name + '.' + s.handler)
            .join(' -> ')}][async:${this
            .asyncSteps
            .map(s => s.component.name + '.' + s.handler)
            .join(' -> ')}]`;
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
    getStepArgs(step, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise
                .all(A_Context_class_1.A_Context
                .meta(step.component instanceof A_Container_class_1.A_Container
                ? step.component.constructor
                : step.component)
                .injections(step.handler)
                .map((arg) => __awaiter(this, void 0, void 0, function* () {
                if (a_utils_1.A_CommonHelper.isInheritedFrom(arg.target, A_Feature_class_1.A_Feature))
                    return this.feature;
                return scope
                    .resolve(arg.target);
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
    getStepInstance(step) {
        const { component, handler } = step;
        // TODO: probably would be better to do it another way. let's think about it
        const instance = component instanceof A_Container_class_1.A_Container
            ? component
            : this.feature.Scope.resolve(component);
        if (!instance)
            throw new Error(`Unable to resolve component ${component.name}`);
        if (!instance[handler])
            throw new Error(`Handler ${handler} not found in ${instance.constructor.name}`);
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
            const instance = yield this.getStepInstance(step);
            const callArgs = yield this.getStepArgs(step, scope);
            return yield instance[step.handler](...callArgs);
        });
    }
    /**
     * Runs async all the _steps of the stage
     *
     * @returns
     */
    process() {
        return __awaiter(this, arguments, void 0, function* (
        /**
         * Scope to be used to resolve the steps dependencies
         */
        scope = new A_Scope_class_1.A_Scope({}, {}), params) {
            scope = scope.inherit(this.feature.Scope);
            console.log(' -> Init stage processing:', this.name);
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
                                        console.log(' - -> Processing stage step:', step.handler, ' with Regexp: ', step.name);
                                        yield this.callStepHandler(step, scope);
                                        console.log(' - -> Finished processing stage step:', step.handler);
                                    }
                                    return r();
                                }
                                catch (error) {
                                    return j(error);
                                }
                            }))
                        ]);
                        this.completed();
                        console.log(' -> Finished stage processing:', this.name);
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
    /**
     * Skips the stage
     *
     */
    skip() {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.SKIPPED;
        this.feature.next(this);
    }
    // ==========================================
    // ============ Status methods =============
    // ==========================================
    completed() {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.COMPLETED;
        this.feature.next(this);
    }
    failed(error) {
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.FAILED;
        this.feature.failed(new A_Stage_error_1.A_StageError(error));
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
            name: 'A_Stage',
            status: this.status,
        };
    }
}
exports.A_Stage = A_Stage;
//# sourceMappingURL=A-Stage.class.js.map