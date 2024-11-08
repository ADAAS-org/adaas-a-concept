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
const A_Component_class_1 = require("../../../global/A-Component/A-Component.class");
const A_Concept_class_1 = require("../../../global/A-Concept/A_Concept.class");
const A_Config_context_1 = require("../A-Config.context");
/**
 * Config Reader
 */
let ConfigReader = class ConfigReader extends A_Component_class_1.A_Component {
    constructor(scope) {
        super();
        this.scope = scope;
    }
    inject(config) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = this.read(config.CONFIG_PROPERTIES);
            config.set(data);
            const rootDir = yield this.getProjectRoot();
            config.set('CONCEPT_ROOT_FOLDER', rootDir);
        });
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
    /**
     * Finds the root directory of the project by locating the folder containing package.json
     *
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    getProjectRoot() {
        return __awaiter(this, arguments, void 0, function* (startPath = __dirname) {
            // let currentPath = startPath;
            // const fs = await A_Polyfills.fs();
            // while (!fs.existsSync(`${currentPath}/package.json`)) {
            //     const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
            //     if (parentPath === currentPath || parentPath === '') {
            //         // Reached the root of the filesystem without finding package.json
            //         return null;
            //     }
            //     currentPath = parentPath;
            // }
            return process.cwd();
        });
    }
};
exports.ConfigReader = ConfigReader;
__decorate([
    A_Concept_class_1.A_Concept.Load(),
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Config_context_1.A_Config))
], ConfigReader.prototype, "inject", null);
exports.ConfigReader = ConfigReader = __decorate([
    __param(0, (0, A_Inject_decorator_1.A_Inject)(A_Scope_class_1.A_Scope))
], ConfigReader);
//# sourceMappingURL=ConfigReader.component.js.map