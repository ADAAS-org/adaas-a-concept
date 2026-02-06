// src/constants/env.constants.ts
var A_CONSTANTS__DEFAULT_ENV_VARIABLES = {
  // ----------------------------------------------------------
  // A-Concept Core Environment Variables
  // ----------------------------------------------------------
  // These environment variables are used by A-Concept core to configure the application
  // ----------------------------------------------------------
  /**
   * Name of the application
   * 
   * DEFAULT value is 'a-concept'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  A_CONCEPT_NAME: "A_CONCEPT_NAME",
  /**
   * Root scope of the application
   * 
   * DEFAULT value is 'root'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  A_CONCEPT_ROOT_SCOPE: "A_CONCEPT_ROOT_SCOPE",
  /**
   * Environment of the application e.g. development, production, staging
   */
  A_CONCEPT_ENVIRONMENT: "A_CONCEPT_ENVIRONMENT",
  /**
   * Runtime environment of the application e.g. browser, node
   */
  A_CONCEPT_RUNTIME_ENVIRONMENT: "A_CONCEPT_RUNTIME_ENVIRONMENT",
  /**
   * Root folder of the application
   * [!] Automatically set by A-Concept when the application starts
   */
  A_CONCEPT_ROOT_FOLDER: "A_CONCEPT_ROOT_FOLDER",
  /**
   * Allows to define a default error description for errors thrown without a description
   */
  A_ERROR_DEFAULT_DESCRIPTION: "A_ERROR_DEFAULT_DESCRIPTION"
};
var A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = [
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME,
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE,
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ENVIRONMENT,
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_RUNTIME_ENVIRONMENT,
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER,
  A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION
];

// src/env/env.base.ts
var A_CONCEPT_BASE_ENV = class {
  // ----------------------------------------------------------
  // A-Concept Core Environment Variables
  // ----------------------------------------------------------
  // These environment variables are used by A-Concept core to configure the application
  // ----------------------------------------------------------
  /**
   * Name of the application
   * 
   * DEFAULT value is 'a-concept'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  static get A_CONCEPT_NAME() {
    return "a-concept";
  }
  /**
   * Root scope of the application
   * 
   * DEFAULT value is 'root'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  static get A_CONCEPT_ROOT_SCOPE() {
    return "root";
  }
  /**
   * Environment of the application e.g. development, production, staging
   */
  static get A_CONCEPT_ENVIRONMENT() {
    return "production";
  }
  /**
   * Runtime environment of the application e.g. browser, node
   */
  static get A_CONCEPT_RUNTIME_ENVIRONMENT() {
    return "unknown";
  }
  /**
   * Root folder of the application
   * [!] Automatically set by A-Concept when the application starts
   */
  static get A_CONCEPT_ROOT_FOLDER() {
    return "/app";
  }
  /**
   * Allows to define a default error description for errors thrown without a description
   */
  static get A_ERROR_DEFAULT_DESCRIPTION() {
    return "If you see this error please let us know.";
  }
};

// src/env/env-node.ts
var ENV = class extends A_CONCEPT_BASE_ENV {
  // ----------------------------------------------------------
  // A-Concept Core Environment Variables
  // ----------------------------------------------------------
  // These environment variables are used by A-Concept core to configure the application
  // ----------------------------------------------------------
  /**
   * Name of the application
   * 
   * DEFAULT value is 'a-concept'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  static get A_CONCEPT_NAME() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] || super.A_CONCEPT_NAME;
  }
  /**
   * Root scope of the application
   * 
   * DEFAULT value is 'root'
   * 
   * [!] Provided name will be used for all aseids in the application by default
   */
  static get A_CONCEPT_ROOT_SCOPE() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || super.A_CONCEPT_ROOT_SCOPE;
  }
  /**
   * Environment of the application e.g. development, production, staging
   */
  static get A_CONCEPT_ENVIRONMENT() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ENVIRONMENT] || super.A_CONCEPT_ENVIRONMENT;
  }
  /**
   * Runtime environment of the application e.g. browser, node
   */
  static get A_CONCEPT_RUNTIME_ENVIRONMENT() {
    return "server";
  }
  /**
   * Root folder of the application
   * [!] Automatically set by A-Concept when the application starts
   */
  static get A_CONCEPT_ROOT_FOLDER() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER] || super.A_CONCEPT_ROOT_FOLDER;
  }
  /**
   * Allows to define a default error description for errors thrown without a description
   */
  static get A_ERROR_DEFAULT_DESCRIPTION() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION] || super.A_ERROR_DEFAULT_DESCRIPTION;
  }
};

export { A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, ENV };
//# sourceMappingURL=chunk-LKQAYXTD.mjs.map
//# sourceMappingURL=chunk-LKQAYXTD.mjs.map