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
exports.A_ConfigLoader = void 0;
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const A_Logger_component_1 = require("../A-Logger/A-Logger.component");
const A_Inject_decorator_1 = require("../../decorators/A-Inject/A-Inject.decorator");
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const FileConfigReader_component_1 = require("./components/FileConfigReader.component");
const ENVConfigReader_component_1 = require("./components/ENVConfigReader.component");
const A_Scope_class_1 = require("../../global/A-Scope/A-Scope.class");
class A_ConfigLoader extends A_Container_class_1.A_Container {
    identifyReader(scope, logger) {
        return __awaiter(this, void 0, void 0, function* () {
            // OR Inject the logger by calling Context Provider
            // const logger2 = await this.CP.resolve(A_LoggerContext);
            const fs = yield a_utils_1.A_Polyfills.fs();
            switch (true) {
                case A_Context_class_1.A_Context.environment === 'server' && !!fs.existsSync(`${scope.name}.conf.json`):
                    this.reader = scope.resolve(FileConfigReader_component_1.FileConfigReader);
                    break;
                case A_Context_class_1.A_Context.environment === 'server':
                    !fs.existsSync(`${scope.name}.conf.json`);
                    this.reader = scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                    break;
                case A_Context_class_1.A_Context.environment === 'browser':
                    this.reader = scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                    break;
                default:
                    throw new Error(`Environment ${A_Context_class_1.A_Context.environment} is not supported`);
            }
        });
    }
    readVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            // const config = await this.reader.read(this.namespace.CONFIG_PROPERTIES);
        });
    }
}
exports.A_ConfigLoader = A_ConfigLoader;
__decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Scope_class_1.A_Scope)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Logger_component_1.A_Logger))
], A_ConfigLoader.prototype, "identifyReader", null);
const foo = new A_ConfigLoader({});
//# sourceMappingURL=A-Config.container.js.map