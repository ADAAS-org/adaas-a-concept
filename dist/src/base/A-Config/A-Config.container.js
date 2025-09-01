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
const A_Inject_decorator_1 = require("../../decorators/A-Inject/A-Inject.decorator");
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const FileConfigReader_component_1 = require("./components/FileConfigReader.component");
const ENVConfigReader_component_1 = require("./components/ENVConfigReader.component");
const A_Scope_class_1 = require("../../global/A-Scope/A-Scope.class");
const A_Concept_class_1 = require("../../global/A-Concept/A_Concept.class");
const A_Config_context_1 = require("./A-Config.context");
class A_ConfigLoader extends A_Container_class_1.A_Container {
    constructor(params) {
        super(Object.assign(Object.assign({}, params), { name: params.name || 'a-config-loader' }));
    }
    prepare(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const fs = yield a_utils_1.A_Polyfills.fs();
            switch (true) {
                case A_Context_class_1.A_Context.environment === 'server' && !!fs.existsSync(`${this.Scope.name}.conf.json`):
                    this.reader = this.Scope.resolve(FileConfigReader_component_1.FileConfigReader);
                    break;
                case A_Context_class_1.A_Context.environment === 'server':
                    !fs.existsSync(`${this.Scope.name}.conf.json`);
                    this.reader = this.Scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                    break;
                case A_Context_class_1.A_Context.environment === 'browser':
                    this.reader = this.Scope.resolve(ENVConfigReader_component_1.ENVConfigReader);
                    break;
                default:
                    throw new Error(`Environment ${A_Context_class_1.A_Context.environment} is not supported`);
            }
        });
    }
    readVariables(config, scope) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.reader.inject(config);
        });
    }
}
exports.A_ConfigLoader = A_ConfigLoader;
__decorate([
    A_Concept_class_1.A_Concept.Load(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Config_context_1.A_Config))
], A_ConfigLoader.prototype, "prepare", null);
__decorate([
    A_Concept_class_1.A_Concept.Load(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Config_context_1.A_Config)),
    __param(1, (0, A_Inject_decorator_1.A_Inject)(A_Scope_class_1.A_Scope))
], A_ConfigLoader.prototype, "readVariables", null);
const foo = new A_ConfigLoader({});
//# sourceMappingURL=A-Config.container.js.map