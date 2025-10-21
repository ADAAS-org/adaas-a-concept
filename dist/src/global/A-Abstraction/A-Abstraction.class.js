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
const A_Abstraction_Extend_decorator_1 = require("./A-Abstraction-Extend.decorator");
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
class A_Abstraction {
    /**
     * Allows to extends A-Abstraction with additional methods
     */
    static get Extend() {
        return A_Abstraction_Extend_decorator_1.A_Abstraction_Extend;
    }
    /**
     * A-Abstraction is an object that is common for any application.
     * By providing components and creating abstraction extensions it's possible to create a unique behavior of the whole solution.
     *
     * Every application has basic abstractions like 'start', 'stop', 'deploy', 'test', etc.
     * They can be easily extended with additional logic from both containers and components.
     *
     *
     * @param params
     */
    constructor(
    /**
     * Parameters to define the A-Abstraction
     */
    params) {
        /**
         * List of features that are part of this Abstraction
         */
        this._features = [];
        /**
         * Actual Index of the current Feature being processed
         */
        this._index = 0;
        this._name = params.name;
        this._features = params.containers.map(container => {
            return new A_Feature_class_1.A_Feature({ name: this._name, component: container, });
        });
        this._current = this._features[0];
    }
    /**
     * Returns the name of the Abstraction
     */
    get name() { return this._name; }
    /**
     * Returns the current Feature being processed
     */
    get feature() {
        return this._current;
    }
    /**
     * This method checks if the A-Feature is done
     *
     * @returns
     */
    get isDone() {
        return !this.feature
            || this._index >= this._features.length;
    }
    [Symbol.iterator]() {
        return {
            // Custom next method
            next: () => {
                if (!this.isDone) {
                    this._current = this._features[this._index];
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
     * This method moves the Abstraction processing to the next Feature in the list
     *
     * @param stage
     */
    next(stage) {
        if (this._index >= this._features.length) {
            return;
        }
        const stageIndex = this._features.indexOf(stage);
        this._index = stageIndex + 1;
    }
    /**
     * Allows to process all stages of the Abstraction
     *
     * @returns
     */
    process(
    /**
     * Allows to override the scope in which the Abstraction will be processed
     *
     */
    scope) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.isDone)
                return;
            for (const feature of this._features) {
                yield feature.process(scope);
            }
        });
    }
}
exports.A_Abstraction = A_Abstraction;
//# sourceMappingURL=A-Abstraction.class.js.map