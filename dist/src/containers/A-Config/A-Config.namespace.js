"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_Config = void 0;
const A_Namespace_class_1 = require("@adaas/a-concept/global/A-Namespace/A_Namespace.class");
class A_Config extends A_Namespace_class_1.A_Namespace {
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
        const targetConfig = config;
        this.CONFIG_PROPERTIES = targetConfig.variables ? targetConfig.variables : [];
    }
    /**
     * This method is used to get the configuration property by name
     *
     * @param property
     * @returns
     */
    get(property) {
        if (this.CONFIG_PROPERTIES.includes(property))
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
//# sourceMappingURL=A-Config.namespace.js.map