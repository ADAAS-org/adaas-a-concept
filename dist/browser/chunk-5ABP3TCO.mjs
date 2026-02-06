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

export { A_CONCEPT_BASE_ENV };
//# sourceMappingURL=chunk-5ABP3TCO.mjs.map
//# sourceMappingURL=chunk-5ABP3TCO.mjs.map