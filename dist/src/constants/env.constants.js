"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES = void 0;
exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES = {
    // ----------------------------------------------------------
    // A-Concept Core Environment Variables
    // ----------------------------------------------------------
    // These environment variables are used by A-Concept core to configure the application
    // ----------------------------------------------------------
    /**
     * Namespace of the application
     * [!] Provided name will be used for all aseids in the application by default
     */
    A_CONCEPT_NAMESPACE: 'A_CONCEPT_NAMESPACE',
    /**
     * Default scope of the application
     * [!] Provided name will be used for all aseids in the application by default
     */
    A_CONCEPT_DEFAULT_SCOPE: 'A_CONCEPT_DEFAULT_SCOPE',
    /**
     * Environment of the application e.g. development, production, staging
     */
    A_CONCEPT_ENVIRONMENT: 'A_CONCEPT_ENVIRONMENT',
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    A_CONCEPT_ROOT_FOLDER: 'A_CONCEPT_ROOT_FOLDER',
    CONFIG_SDK_VALIDATION: 'CONFIG_SDK_VALIDATION',
    CONFIG_VERBOSE: 'CONFIG_VERBOSE',
    CONFIG_IGNORE_ERRORS: 'CONFIG_IGNORE_ERRORS',
};
exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = [
    exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE,
    exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ENVIRONMENT,
    exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER,
    exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES.CONFIG_VERBOSE,
    exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES.CONFIG_IGNORE_ERRORS,
];
//# sourceMappingURL=env.constants.js.map