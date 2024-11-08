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
exports.A_Config = void 0;
const a_utils_1 = require("@adaas/a-utils");
const A_Fragment_class_1 = require("../../global/A-Fragment/A-Fragment.class");
class A_Config extends A_Fragment_class_1.A_Fragment {
    constructor(config) {
        super(config);
        // Custom properties
        this.VARIABLES = new Map();
        this.CONFIG_PROPERTIES = [];
        this.DEFAULT_ALLOWED_TO_READ_PROPERTIES = [
            'CONFIG_SDK_VALIDATION',
            'CONFIG_VERBOSE',
            'CONFIG_IGNORE_ERRORS',
        ];
        this.config = a_utils_1.A_CommonHelper.deepCloneAndMerge(config, {
            name: this.name,
            strict: false,
            defaults: {},
            variables: []
        });
        this.CONFIG_PROPERTIES = this.config.variables ? this.config.variables : [];
    }
    onInit() {
        return __awaiter(this, void 0, void 0, function* () {
            this.config.variables.forEach((variable) => {
                this.VARIABLES.set(variable, this.config.defaults[variable]);
            });
        });
    }
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get(property) {
        if (this.CONFIG_PROPERTIES.includes(property)
            || this.DEFAULT_ALLOWED_TO_READ_PROPERTIES.includes(property)
            || !(this.config.strict))
            return this.VARIABLES.get(property);
        throw new Error('Property not exists or not allowed to read');
        // return this.concept.Errors.throw(A_SDK_CONSTANTS__ERROR_CODES.CONFIGURATION_PROPERTY_NOT_EXISTS_OR_NOT_ALLOWED_TO_READ) as never;
    }
    set(property, value) {
        var _a;
        const array = Array.isArray(property)
            ? property
            : typeof property === 'string'
                ? [{ property, value }]
                : Object
                    .keys(property)
                    .map((key) => ({
                    property: key,
                    value: property[key]
                }));
        for (const { property, value } of array) {
            let targetValue = value
                ? value
                : ((_a = this.config) === null || _a === void 0 ? void 0 : _a.defaults)
                    ? this.config.defaults[property]
                    : undefined;
            this.VARIABLES.set(property, targetValue);
        }
    }
}
exports.A_Config = A_Config;
//# sourceMappingURL=A-Config.context.js.map