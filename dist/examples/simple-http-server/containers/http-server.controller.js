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
exports.HttpServerController = void 0;
const A_Load_decorator_1 = require("@adaas/a-concept/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator");
const A_Container_class_1 = require("../../../src/global/A-Container/A-Container.class");
const A_Inject_decorator_1 = require("../../../src/decorators/A-Inject/A-Inject.decorator");
const A_Config_namespace_1 = require("src/containers/A-Config/A-Config.namespace");
class HttpServerController extends A_Container_class_1.A_Container {
    create(concept, config) {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.HttpServerController = HttpServerController;
__decorate([
    (0, A_Load_decorator_1.A_Load)(),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Config_namespace_1.A_Config))
], HttpServerController.prototype, "create", null);
//# sourceMappingURL=http-server.controller.js.map