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

// src/env/env-node.ts
var ENV = {
  A_CONCEPT_ENVIRONMENT: process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ENVIRONMENT] || "production",
  A_CONCEPT_RUNTIME_ENVIRONMENT: "node",
  A_CONCEPT_NAME: process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] || "a-concept",
  A_CONCEPT_ROOT_FOLDER: process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER] || "/app",
  A_CONCEPT_ROOT_SCOPE: process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] || "global",
  A_ERROR_DEFAULT_DESCRIPTION: process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION] || "An error occurred"
};

export { A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY, ENV };
//# sourceMappingURL=chunk-HIVDZ2X6.mjs.map
//# sourceMappingURL=chunk-HIVDZ2X6.mjs.map