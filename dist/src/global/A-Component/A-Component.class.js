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
const A_Context_class_1 = require("../A-Context/A-Context.class");
/**
 * This element only contains the specific code
 *
 */
class A_Component {
    constructor(params) {
        console.log('A-Component instance created', this);
    }
    call(feature_1) {
        return __awaiter(this, arguments, void 0, function* (feature, params = {}) {
            const newFeature = A_Context_class_1.A_Context.feature(A_Context_class_1.A_Context.scope(this), this, feature, params);
            return yield newFeature.process();
        });
    }
}
exports.A_Component = A_Component;
//# sourceMappingURL=A-Component.class.js.map