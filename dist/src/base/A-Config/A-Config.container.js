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
exports.A_ConfigLoader = void 0;
const A_Container_class_1 = require("../../global/A-Container/A-Container.class");
const a_utils_1 = require("@adaas/a-utils");
const A_Context_class_1 = require("../../global/A-Context/A-Context.class");
const FileConfigReader_component_1 = require("./components/FileConfigReader.component");
const ENVConfigReader_component_1 = require("./components/ENVConfigReader.component");
class A_ConfigLoader extends A_Container_class_1.A_Container {
    identifyReader() {
        return __awaiter(this, void 0, void 0, function* () {
            // OR Inject the logger by calling Context Provider
            // const logger2 = await this.CP.resolve(A_LoggerContext);
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
    readVariables() {
        return __awaiter(this, void 0, void 0, function* () {
            // const config = await this.reader.read(this.namespace.CONFIG_PROPERTIES);
        });
    }
}
exports.A_ConfigLoader = A_ConfigLoader;
const foo = new A_ConfigLoader({});
//# sourceMappingURL=A-Config.container.js.map