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
exports.A_Abstraction = void 0;
const A_Abstraction_Extend_decorator_1 = require("../../decorators/A-Abstraction/A-Abstraction-Extend.decorator");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
const A_Abstraction_types_1 = require("./A-Abstraction.types");
class A_Abstraction {
    /**
     * Define a new A-Abstraction
     */
    static get Extend() {
        return A_Abstraction_Extend_decorator_1.A_Abstraction_Extend;
    }
    constructor(
    /**
     * Parameters to define the A-Abstraction
     */
    params) {
        this.features = [];
        this._index = 0;
        this.state = A_Abstraction_types_1.A_TYPES__AbstractionState.INITIALIZED;
        this.name = params.name;
        this.features = params.features.map(def => new A_Feature_class_1.A_Feature(def));
        this._current = this.features[0];
    }
    get feature() {
        return this._current;
    }
    [Symbol.iterator]() {
        return {
            // Custom next method
            next: () => {
                if (!this.isDone()) {
                    this._current = this.features[this._index];
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
     * This method moves the feature to the next stage
     *
     * @param stage
     */
    next(stage) {
        const stageIndex = this.features.indexOf(stage);
        this._index = stageIndex + 1;
        if (this._index >= this.features.length) {
            this.completed();
        }
    }
    completed() {
        return __awaiter(this, void 0, void 0, function* () {
            this.state = A_Abstraction_types_1.A_TYPES__AbstractionState.COMPLETED;
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
            this.state = A_Abstraction_types_1.A_TYPES__AbstractionState.FAILED;
        });
    }
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    isDone() {
        return !this.feature
            || this._index >= this.features.length
            || this.state === A_Abstraction_types_1.A_TYPES__AbstractionState.COMPLETED
            || this.state === A_Abstraction_types_1.A_TYPES__AbstractionState.FAILED;
    }
    process() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isDone())
                return;
            try {
                this.state = A_Abstraction_types_1.A_TYPES__AbstractionState.PROCESSING;
                for (const feature of this.features) {
                    yield feature.process();
                }
                yield this.completed();
            }
            catch (error) {
                yield this.failed(error);
            }
        });
    }
}
exports.A_Abstraction = A_Abstraction;
//# sourceMappingURL=A-Abstraction.class.js.map