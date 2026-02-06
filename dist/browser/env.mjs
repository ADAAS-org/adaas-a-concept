import { A_CONCEPT_BASE_ENV } from './chunk-5ABP3TCO.mjs';

// src/env/env-browser.ts
var ENV = class extends A_CONCEPT_BASE_ENV {
  static get A_CONCEPT_ENVIRONMENT() {
    return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_CONCEPT_ENVIRONMENT || super.A_CONCEPT_ENVIRONMENT;
  }
  static get A_CONCEPT_RUNTIME_ENVIRONMENT() {
    return "browser";
  }
  static get A_CONCEPT_NAME() {
    return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_CONCEPT_NAME || super.A_CONCEPT_NAME;
  }
  static get A_CONCEPT_ROOT_FOLDER() {
    return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_CONCEPT_ROOT_FOLDER || super.A_CONCEPT_ROOT_FOLDER;
  }
  static get A_CONCEPT_ROOT_SCOPE() {
    return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_CONCEPT_ROOT_SCOPE || super.A_CONCEPT_ROOT_SCOPE;
  }
  static get A_ERROR_DEFAULT_DESCRIPTION() {
    return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_ERROR_DEFAULT_DESCRIPTION || super.A_ERROR_DEFAULT_DESCRIPTION;
  }
};

export { ENV };
//# sourceMappingURL=env.mjs.map
//# sourceMappingURL=env.mjs.map