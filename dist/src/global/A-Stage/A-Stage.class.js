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
/**
 * A_Stage is a set of A_Functions within A_Feature that should be run in a specific order.
 * Each stage may contain one or more functions.
 * [!] That always run in parallel (in NodeJS asynchronously), independently of each other.
 *
 * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition.
 */
class A_Stage {
    constructor(feature, steps = []) {
        this.feature = feature;
        this.steps = steps;
        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.INITIALIZED;
    }
    get before() {
        return this.steps.reduce((acc, step) => ([
            ...acc,
            ...step.before
        ]), []);
    }
    get after() {
        return this.steps.reduce((acc, step) => ([
            ...acc,
            ...step.after
        ]), []);
    }
    /**
     * Resolves the arguments of the step
     *
     * @param step
     * @returns
     */
    getStepArgs(step) {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise
                .all(A_Context_class_1.A_Context
                .meta(step.component instanceof A_Container_class_1.A_Container
                ? step.component.constructor
                : step.component)
                .injections(step.handler)
                .map((arg) => __awaiter(this, void 0, void 0, function* () {
                // In case if the target is a feature step then pass the current feature
                return a_utils_1.A_CommonHelper.isInheritedFrom(arg.target, A_Feature_class_1.A_Feature)
                    ? this.feature
                    : A_Context_class_1.A_Context.scope(this.feature).resolve(arg.target);
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
        this.steps.push(step);
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
            : A_Context_class_1.A_Context.scope(this.feature).resolve(component);
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
    callStepHandler(step) {
        return __awaiter(this, void 0, void 0, function* () {
            const instance = yield this.getStepInstance(step);
            const callArgs = yield this.getStepArgs(step);
            return instance[step.handler](...callArgs);
        });
    }
    /**
     * Runs async all the steps of the stage
     *
     * @returns
     */
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.processed)
                this.processed = new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                    try {
                        this.status = A_Stage_types_1.A_TYPES__A_Stage_Status.PROCESSING;
                        const syncSteps = this.steps.filter(step => step.behavior === 'sync');
                        const asyncSteps = this.steps.filter(step => step.behavior === 'async');
                        // Run sync steps
                        yield Promise
                            .all([
                            // Run async steps that are independent of each other
                            ...asyncSteps.map(step => this.callStepHandler(step)),
                            // Run sync steps that are dependent on each other
                            new Promise((r, j) => __awaiter(this, void 0, void 0, function* () {
                                try {
                                    for (const step of syncSteps) {
                                        yield this.callStepHandler(step);
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
        this.feature.failed(error);
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