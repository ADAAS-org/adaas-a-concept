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
const A_Feature_types_1 = require("./A-Feature.types");
const A_Feature_Define_decorator_1 = require("./A-Feature-Define.decorator");
const A_Feature_Extend_decorator_1 = require("./A-Feature-Extend.decorator");
const A_StepsManager_class_1 = require("../../helpers/A_StepsManager.class");
const A_TypeGuards_helper_1 = require("../../helpers/A_TypeGuards.helper");
const A_Feature_error_1 = require("./A-Feature.error");
const A_Context_class_1 = require("../A-Context/A-Context.class");
const A_Caller_class_1 = require("../A-Caller/A_Caller.class");
const A_Scope_class_1 = require("../A-Scope/A-Scope.class");
const A_Component_class_1 = require("../A-Component/A-Component.class");
/**
 * A_Feature is representing a feature that can be executed across multiple components
 * This class stores the steps of the feature and executes them in order of appearance
 *
 * Using A_Feature.Define and A_Feature.Extend decorators to define and extend the feature methods
 * across the different, distributed components
 *
 */
class A_Feature {
    // =============================================================================
    // --------------------------- Static Methods ---------------------------------
    // =============================================================================
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
    /**
     * A-Feature is a pipeline distributed by multiple components that can be easily attached or detached from the scope.
     * Feature itself does not have scope, but attached to the caller who dictates how feature should be processed.
     *
     * Comparing to A-Command Feature does not store any state except statuses for better analysis.
     *
     * [!] Note: If A-Feature should have result use A-Fragment
     *
     * @param params
     */
    constructor(
    /**
     * Feature Initialization parameters
     */
    params) {
        /**
         * List of stages that are part of this Feature
         */
        this._stages = [];
        /**
         * Actual Index of the current Stage being processed
         */
        this._index = 0;
        /**
         * The current state of the Feature
         */
        this._state = A_Feature_types_1.A_TYPES__FeatureState.INITIALIZED;
        this.validateParams(params);
        const initializer = this.getInitializer(params);
        // the returned initializer is already bound to `this` (we used .bind(this)),
        // so calling it will run the appropriate logic on this instance:
        initializer.call(this, params);
    }
    /**
     * The name of the Feature
     */
    get name() { return this._name; }
    /**
     * The error that caused the Feature to be interrupted
     */
    get error() { return this._error; }
    /**
     * The current state of the Feature
     */
    get state() { return this._state; }
    /**
     * Sets the current state of the Feature
     */
    get index() { return this._index; }
    /**
     * Returns the current A-Feature Stage
     */
    get stage() { return this._current; }
    /**
     * The Caller that initiated the Feature call
     */
    get caller() { return this._caller; }
    /**
     * The Scope allocated for the Feature Execution
     */
    get scope() { return A_Context_class_1.A_Context.scope(this); }
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone() {
        return !this.stage
            || this._index >= this._stages.length
            || this.state === A_Feature_types_1.A_TYPES__FeatureState.COMPLETED
            || this.state === A_Feature_types_1.A_TYPES__FeatureState.INTERRUPTED;
    }
    /**
     * Iterator to iterate over the steps of the feature
     *
     * @returns
     */
    [Symbol.iterator]() {
        return {
            next: () => {
                if (!this.isDone) {
                    this._current = this._stages[this._index];
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
    // ============================================================================
    // ------------------------ Initialization Methods ----------------------------
    // ============================================================================
    /**
     * Validates the provided parameters for A-Feature initialization
     *
     * @param params
     */
    validateParams(params) {
        if (!params || typeof params !== 'object') {
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureInitializationError, `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`);
        }
    }
    /**
     * Returns the appropriate initializer method based on the provided parameters
     *
     * @param params
     * @returns
     */
    getInitializer(params) {
        switch (true) {
            case !('template' in params):
                return this.fromComponent;
            case 'template' in params:
                return this.fromTemplate;
            default:
                throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureInitializationError, `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`);
        }
    }
    /**
     * Initializes the A-Feature from the provided template
     *
     * @param params
     */
    fromTemplate(params) {
        if (!params.template || !Array.isArray(params.template)) {
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureInitializationError, `Invalid A-Feature template provided of type: ${typeof params.template} with value: ${JSON.stringify(params.template).slice(0, 100)}...`);
        }
        if (!params.component && (!params.scope || !(params.scope instanceof A_Scope_class_1.A_Scope))) {
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureInitializationError, `Invalid A-Feature scope provided of type: ${typeof params.scope} with value: ${JSON.stringify(params.scope).slice(0, 100)}...`);
        }
        // 1) save feature name
        this._name = params.name;
        // 2) get scope from where feature is called
        const componentScope = params.component
            ? A_Context_class_1.A_Context.scope(params.component)
            : params.scope;
        // 3) create caller wrapper for the simple injection of the caller component
        //   - Just to prevent issues with undefined caller in features without component
        //   - TODO: maybe would be better to allow passing caller in params?
        this._caller = new A_Caller_class_1.A_Caller(params.component || new A_Component_class_1.A_Component());
        // 4) allocate new scope for the feature
        const scope = A_Context_class_1.A_Context.allocate(this);
        // 5) ensure that the scope of the caller component is inherited by the feature scope
        scope.inherit(componentScope);
        // 6) create steps manager to organize steps into stages
        this._SM = new A_StepsManager_class_1.A_StepsManager(params.template);
        // 7) create stages from the steps
        this._stages = this._SM.toStages(this);
        // 8) set the first stage as current
        this._current = this._stages[0];
    }
    /**
     * Initializes the A-Feature from the provided component
     *
     * @param params
     */
    fromComponent(params) {
        if (!params.component || !A_TypeGuards_helper_1.A_TypeGuards.isAllowedForFeatureDefinition(params.component)) {
            throw new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.FeatureInitializationError, `Invalid A-Feature component provided of type: ${typeof params.component} with value: ${JSON.stringify(params.component).slice(0, 100)}...`);
        }
        // 1) save feature name
        this._name = params.name;
        // 2) get scope from where feature is called
        const componentScope = A_Context_class_1.A_Context.scope(params.component);
        // 3) create caller wrapper for the simple injection of the caller component
        this._caller = new A_Caller_class_1.A_Caller(params.component);
        // 4) allocate new scope for the feature
        const scope = A_Context_class_1.A_Context.allocate(this);
        // 5) ensure that the scope of the caller component is inherited by the feature scope
        scope.inherit(componentScope);
        // 6) retrieve the template from the context
        const template = A_Context_class_1.A_Context.featureTemplate(this._name, this._caller.component, scope);
        // 7) create steps manager to organize steps into stages
        this._SM = new A_StepsManager_class_1.A_StepsManager(template);
        // 8) create stages from the steps
        this._stages = this._SM.toStages(this);
        // 9) set the first stage as current
        this._current = this._stages[0];
    }
    // ============================================================================
    // ----------------------- Main Processing Methods ----------------------------
    // ============================================================================
    /**
     * This method processes the feature by executing all the stages
     *
     */
    process(
    /**
     * Optional scope to be used to resolve the steps dependencies
     * If not provided, the scope of the caller component will be used
     */
    scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isDone)
                return;
            this._state = A_Feature_types_1.A_TYPES__FeatureState.PROCESSING;
            for (const stage of this._stages) {
                yield stage.process(scope);
            }
            return yield this.completed();
        });
    }
    /**
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage) {
        const stageIndex = this._stages.indexOf(stage);
        this._index = stageIndex + 1;
        if (this._index >= this._stages.length) {
            this.completed();
        }
    }
    /**
     * This method marks the feature as completed and returns the result
     * Uses to interrupt or end the feature processing
     *
     * @param result
     * @returns
     */
    completed() {
        return __awaiter(this, void 0, void 0, function* () {
            this._state = A_Feature_types_1.A_TYPES__FeatureState.COMPLETED;
        });
    }
    /**
     * This method marks the feature as failed and throws an error
     * Uses to interrupt or end the feature processing
     *
     * @param error
     */
    interrupt(
    /**
     * The reason of feature interruption
     */
    reason) {
        return __awaiter(this, void 0, void 0, function* () {
            switch (true) {
                case A_TypeGuards_helper_1.A_TypeGuards.isString(reason):
                    this._error = new A_Feature_error_1.A_FeatureError(A_Feature_error_1.A_FeatureError.Interruption, reason);
                    break;
                case A_TypeGuards_helper_1.A_TypeGuards.isErrorInstance(reason):
                    this._error = new A_Feature_error_1.A_FeatureError({
                        code: A_Feature_error_1.A_FeatureError.Interruption,
                        title: reason.title,
                        description: reason.description,
                        originalError: reason
                    });
                    break;
                default:
                    break;
            }
            this._state = A_Feature_types_1.A_TYPES__FeatureState.INTERRUPTED;
        });
    }
}
exports.A_Feature = A_Feature;
//# sourceMappingURL=A-Feature.class.js.map