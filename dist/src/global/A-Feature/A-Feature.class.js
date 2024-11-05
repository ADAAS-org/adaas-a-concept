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
        this.steps = [];
        this._index = 0;
        this.state = A_Feature_types_1.A_TYPES__FeatureState.INITIALIZED;
        // this.scope = params.scope;
        this.steps = params.steps;
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
                if (this._index < this.steps.length) {
                    if (this.state === A_Feature_types_1.A_TYPES__FeatureState.FAILED
                        ||
                            this.state === A_Feature_types_1.A_TYPES__FeatureState.COMPLETED) {
                        throw new Error('FEATURE_PROCESSING_INTERRUPTED');
                    }
                    this._current = this.steps[this._index];
                    const { component, handler, args } = this._current;
                    const instance = A_Context_class_1.A_Context.scope(this).resolve(component);
                    return {
                        value: () => __awaiter(this, void 0, void 0, function* () {
                            if (instance[handler]) {
                                const callArgs = A_Context_class_1.A_Context.scope(this).resolve(args.map(arg => arg.target));
                                yield instance[handler](...callArgs);
                            }
                            this._index++;
                        }),
                        done: false
                    };
                }
                else {
                    this._current = undefined; // Reset current on end
                    return { value: undefined, done: true };
                }
            }
        };
    }
    // Access the current element
    get current() {
        return this._current;
    }
    // Custom end strategy or stop condition (could be expanded if needed)
    isDone() {
        return this.current === null;
    }
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * @param result
     * @returns
     */
    completed(...result) {
        return __awaiter(this, void 0, void 0, function* () {
            this.result = result;
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
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.state = A_Feature_types_1.A_TYPES__FeatureState.PROCESSING;
                for (const step of this) {
                    yield step();
                }
                yield this.completed();
            }
            catch (error) {
                console.log('[!] Feature processing error:', error);
                yield this.failed(error);
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