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
exports.A_Component = void 0;
const A_Feature_class_1 = require("../A-Feature/A-Feature.class");
/**
 * A-Component is a primary "extendable" object in the system
 * A unique combination of Components creates completely new functionality
 *
 * The most important thing is that A-Component is STATELESS, it means that it doesn't store any state in itself
 *
 *
 * [!] Every A-Component is a singleton, so if you need to create multiple instances of the same logic - use A-Container
 * [!] So one scope can have only one instance of the same A-Component
 * [!] Every A-Component can be extended by features and extensions
 * [!] ONLY A-Component can have A-Feature extensions
 *
 */
class A_Component {
    /**
     * Calls the feature with the given name in the given scope
     *
     * [!] Note: This method creates a new instance of the feature every time it is called
     *
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
    /**
     * Name of the feature to call
     */
    feature, 
    /**
     * Scope in which the feature will be executed
     */
    scope) {
        return __awaiter(this, void 0, void 0, function* () {
            const newFeature = new A_Feature_class_1.A_Feature({
                name: feature,
                component: this
            });
            return yield newFeature.process(scope);
        });
    }
}
exports.A_Component = A_Component;
//# sourceMappingURL=A-Component.class.js.map