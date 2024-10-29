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
exports.ConfigReader = void 0;
const A_Scope_class_1 = require("../../../global/A-Scope/A-Scope.class");
const A_Inject_decorator_1 = require("../../../decorators/A-Inject/A-Inject.decorator");
/**
 * Config Reader
 */
let ConfigReader = class ConfigReader {
    constructor(scope) {
        this.scope = scope;
    }
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
};
exports.ConfigReader = ConfigReader;
exports.ConfigReader = ConfigReader = __decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Scope_class_1.A_Scope))
], ConfigReader);
//# sourceMappingURL=ConfigReader.component.js.map