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
exports.ConfigReader = void 0;
const A_Component_class_1 = require("../../../global/A-Component/A-Component.class");
/**
 * Config Reader
 */
class ConfigReader extends A_Component_class_1.A_Component {
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve(property) {
        return property;
    }
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read() {
        return __awaiter(this, arguments, void 0, function* (variables = []) {
            return {};
        });
    }
}
exports.ConfigReader = ConfigReader;
//# sourceMappingURL=ConfigReader.component.js.map