"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_TYPES__ModuleTypes = exports.A_TYPES__ModuleState = void 0;
var A_TYPES__ModuleState;
(function (A_TYPES__ModuleState) {
    A_TYPES__ModuleState["INIT"] = "INIT";
    A_TYPES__ModuleState["LOADING"] = "LOADING";
    A_TYPES__ModuleState["READY"] = "READY";
    A_TYPES__ModuleState["FAILED"] = "FAILED";
})(A_TYPES__ModuleState || (exports.A_TYPES__ModuleState = A_TYPES__ModuleState = {}));
var A_TYPES__ModuleTypes;
(function (A_TYPES__ModuleTypes) {
    /**
     * Custom module type allows additional external control over the module
     */
    A_TYPES__ModuleTypes["CUSTOM"] = "CUSTOM";
    /**
     * Default module type is a module that is used by default and has no additional control.
     */
    A_TYPES__ModuleTypes["DEFAULT"] = "DEFAULT";
})(A_TYPES__ModuleTypes || (exports.A_TYPES__ModuleTypes = A_TYPES__ModuleTypes = {}));
//# sourceMappingURL=A_Module.types.js.map