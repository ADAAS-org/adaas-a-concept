"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.ComponentA = void 0;
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
const Fragment_A_context_1 = require("../context/Fragment_A.context");
const Fragment_B_context_1 = require("../context/Fragment_B.context");
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
const A_Logger_component_1 = require("../../../src/base/A-Logger/A-Logger.component");
class ComponentA extends A_Component_class_1.A_Component {
    load() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    method_A(fragmentA, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('red', 'Component A ->  method_A()');
            fragmentA.decrement();
        });
    }
    someMethod(fragmentB) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Component A ->  method_A() -> someMethod()');
            fragmentB.increment();
        });
    }
}
exports.ComponentA = ComponentA;
__decorate([
    A_Feature_class_1.A_Feature.Extend()
], ComponentA.prototype, "load", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(Fragment_A_context_1.ContextFragmentA)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Logger_component_1.A_Logger))
], ComponentA.prototype, "method_A", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend({
        name: 'method_A'
    }),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(Fragment_B_context_1.ContextFragmentB))
], ComponentA.prototype, "someMethod", null);
//# sourceMappingURL=A.component.js.map