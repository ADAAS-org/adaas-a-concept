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
exports.ENVConfigReader = void 0;
const a_utils_1 = require("@adaas/a-utils");
const ConfigReader_component_1 = require("./ConfigReader.component");
const A_Context_class_1 = require("../../../global/A-Context/A-Context.class");
const env_constants_1 = require("../../../constants/env.constants");
class ENVConfigReader extends ConfigReader_component_1.ConfigReader {
    /**
     * Get the configuration property Name
     * @param property
     */
    getConfigurationProperty_ENV_Alias(property) {
        if (env_constants_1.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.some(p => p === property))
            return a_utils_1.A_CommonHelper.toUpperSnakeCase(property);
        return `${a_utils_1.A_CommonHelper.toUpperSnakeCase(A_Context_class_1.A_Context.root.name)}_${a_utils_1.A_CommonHelper.toUpperSnakeCase(property)}`;
    }
    resolve(property) {
        return process.env[this.getConfigurationProperty_ENV_Alias(property)];
    }
    read() {
        return __awaiter(this, arguments, void 0, function* (variables = []) {
            const config = {};
            variables.forEach(variable => {
                config[variable] = this.resolve(variable);
            });
            return config;
        });
    }
}
exports.ENVConfigReader = ENVConfigReader;
//# sourceMappingURL=ENVConfigReader.component.js.map