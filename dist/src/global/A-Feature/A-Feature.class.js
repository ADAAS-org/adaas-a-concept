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
exports.A_Feature = void 0;
const A_Feature_Define_decorator_1 = require("../../decorators/A-Feature/A-Feature-Define.decorator");
const A_Feature_Extend_decorator_1 = require("../../decorators/A-Feature/A-Feature-Extend.decorator");
const A_Feature_types_1 = require("./A-Feature.types");
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const StepsManager_class_1 = require("../../helpers/StepsManager.class");
/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 *
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods
 * across the different, distributed components
 *
 */
class A_Feature {
    /**
     * Define a new A-Feature
     */
    static get Define() {
        return A_Feature_Define_decorator_1.A_Feature_Define;
    }
    /**
     * Extend an existing A-Feature
     */
    static get Extend() {
        return A_Feature_Extend_decorator_1.A_Feature_Extend;
    }
    constructor(params) {
        // protected scope: A_Scope
        this.stages = [];
        this._index = 0;
        this.state = A_Feature_types_1.A_TYPES__FeatureState.INITIALIZED;
        this.SM = new StepsManager_class_1.StepsManager(params.steps);
        this.stages = this.SM.toStages(this);
        this._current = this.stages[0];
        A_Context_class_1.A_Context.allocate(this, params);
    }
    /**
     * Custom iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator]() {
        return {
            // Custom next method
            next: () => {
                if (!this.isDone()) {
                    this._current = this.stages[this._index];
                    return {
                        value: this._current,
                        done: false
                    };
                }
                else {
                    this._current = undefined; // Reset current on end
                    return {
                        value: undefined,
                        done: true
                    };
                }
            }
        };
    }
    /**
     * Returns the current A-Feature Stage
     *
     */
    get stage() {
        return this._current;
    }
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    isDone() {
        return !this.stage
            || this._index >= this.stages.length
            || this.state === A_Feature_types_1.A_TYPES__FeatureState.COMPLETED
            || this.state === A_Feature_types_1.A_TYPES__FeatureState.FAILED;
    }
    /**
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage) {
        const stageIndex = this.stages.indexOf(stage);
        this._index = stageIndex + 1;
        if (this._index >= this.stages.length) {
            this.completed();
        }
    }
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * The result of the feature is a Scope Fragments
     *
     * @param result
     * @returns
     */
    completed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = A_Context_class_1.A_Context.scope(this).toJSON();
            this.state = A_Feature_types_1.A_TYPES__FeatureState.COMPLETED;
            return this.result;
        });
    }
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    failed(error) {
        return __awaiter(this, void 0, void 0, function* () {
            this.error = error;
            this.state = A_Feature_types_1.A_TYPES__FeatureState.FAILED;
            yield this.errorHandler(error);
        });
    }
    /**
     * This method processes the feature by executing all the stages
     *
     */
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = A_Feature_types_1.A_TYPES__FeatureState.PROCESSING;
            for (const stage of this) {
                yield stage.process();
            }
        });
    }
    errorHandler(error) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (true) {
                case error instanceof a_utils_1.A_Error:
                    throw error;
                case error instanceof Error
                    && error.message === 'FEATURE_PROCESSING_INTERRUPTED'
                    && this.state === A_Feature_types_1.A_TYPES__FeatureState.FAILED:
                    throw new a_utils_1.A_Error({
                        message: 'FEATURE_PROCESSING_INTERRUPTED',
                        code: 'FEATURE_PROCESSING_INTERRUPTED',
                        data: {
                            feature: this
                        }
                    });
                case error instanceof Error
                    && error.message === 'FEATURE_PROCESSING_INTERRUPTED'
                    && this.state === A_Feature_types_1.A_TYPES__FeatureState.COMPLETED:
                    // Do nothing
                    break;
                default:
                    throw error;
            }
        });
    }
}
exports.A_Feature = A_Feature;
//# sourceMappingURL=A-Feature.class.js.map