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
exports.A_Logger = void 0;
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Load_decorator_1 = require("../../decorators/A-ConceptLifecycle/A-Load/A-Load.decorator");
const Logger_component_1 = require("./components/Logger.component");
const A_Inject_decorator_1 = require("../../decorators/A-Inject/A-Inject.decorator");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const A_Config_namespace_1 = require("../A-Config/A-Config.namespace");
class A_Logger extends A_Container_class_1.A_Container {
    init(config) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.namespace.ready;
            this.namespace.Logger = A_Context_class_1.A_Context.resolve(Logger_component_1.Logger);
        });
    }
}
exports.A_Logger = A_Logger;
__decorate([
    (0, A_Load_decorator_1.A_Load)({}),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Config_namespace_1.A_Config))
], A_Logger.prototype, "init", null);
//# sourceMappingURL=A-Logger.container.js.map