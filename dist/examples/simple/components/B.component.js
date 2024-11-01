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
exports.ComponentB = void 0;
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const Fragment_B_context_1 = require("../context/Fragment_B.context");
const Fragment_A_context_1 = require("../context/Fragment_A.context");
const A_Feature_class_1 = require("../../../src/global/A-Feature/A-Feature.class");
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
const A_Logger_component_1 = require("../../../src/base/A-Logger/A-Logger.component");
let ComponentB = class ComponentB extends A_Component_class_1.A_Component {
    constructor(logger) {
        super();
        this.logger = logger;
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Component B ->  load()');
        });
    }
    method_B(logger) {
        return __awaiter(this, void 0, void 0, function* () {
            logger.log('cyan', 'Component B ->  method_B()');
        });
    }
    someMethod() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('pink', 'Component B ->  method_B() -> someMethod()');
            this.logger.log('Component B ->  method_B() -> someMethod()');
        });
    }
    someMethod2() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.log('yellow', 'Component B ->  method_B() -> someMethod2()');
        });
    }
    someMethod3(context, context2) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('Component B ->  method_A() -> someMethod3()');
        });
    }
};
exports.ComponentB = ComponentB;
__decorate([
    A_Feature_class_1.A_Feature.Extend()
], ComponentB.prototype, "load", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Logger_component_1.A_Logger))
], ComponentB.prototype, "method_B", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend({
        name: 'method_B'
    })
], ComponentB.prototype, "someMethod", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend({
        name: 'method_B'
    })
], ComponentB.prototype, "someMethod2", null);
__decorate([
    A_Feature_class_1.A_Feature.Extend({
        name: 'method_A'
    }),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(Fragment_B_context_1.ContextFragmentB)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(Fragment_A_context_1.ContextFragmentA))
], ComponentB.prototype, "someMethod3", null);
exports.ComponentB = ComponentB = __decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Logger_component_1.A_Logger))
], ComponentB);
//# sourceMappingURL=B.component.js.map