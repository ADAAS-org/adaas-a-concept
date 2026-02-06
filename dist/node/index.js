'use strict';

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

// src/global/A-Feature/A-Feature.types.ts
var A_TYPES__FeatureState = /* @__PURE__ */ ((A_TYPES__FeatureState2) => {
  A_TYPES__FeatureState2["INITIALIZED"] = "INITIALIZED";
  A_TYPES__FeatureState2["PROCESSING"] = "PROCESSING";
  A_TYPES__FeatureState2["COMPLETED"] = "COMPLETED";
  A_TYPES__FeatureState2["INTERRUPTED"] = "INTERRUPTED";
  A_TYPES__FeatureState2["FAILED"] = "FAILED";
  return A_TYPES__FeatureState2;
})(A_TYPES__FeatureState || {});

// src/global/A-Meta/A-Meta.decorator.ts
function A_MetaDecorator(constructor) {
  return function(target) {
    A_Context.setMeta(target, new constructor());
    return target;
  };
}

// src/global/A-Meta/A-Meta.class.ts
var A_Meta = class _A_Meta {
  constructor() {
    this.meta = /* @__PURE__ */ new Map();
  }
  /**
   * Allows to set a custom meta class for the Component or Container or Entity, or anything else. 
   * 
   * @param target 
   * @returns 
   */
  static Define(target) {
    return A_MetaDecorator(target);
  }
  /**
   * Method to get the iterator for the meta object
   * 
   * @returns 
   */
  [Symbol.iterator]() {
    const iterator = this.meta.entries();
    return {
      next: () => iterator.next()
    };
  }
  // ===================================================================================================
  // ================================ META OPERATIONS ==================================================
  // ===================================================================================================
  /**
   * Allows to replicate received meta object by replacing internal meta to the received one
   * 
   * @param meta 
   * @returns 
   */
  from(meta) {
    this.meta = new Map(meta.meta);
    return this;
  }
  /**
   * Method to set values in the map
   * 
   * @param key 
   * @param value 
   */
  set(key, value) {
    const inheritedValue = this.meta.get(key) || Array.isArray(value) ? [] : value instanceof Map ? /* @__PURE__ */ new Map() : {};
    this.meta.get(key) || Array.isArray(value) ? [
      ...inheritedValue
    ] : value instanceof Map ? new Map(inheritedValue) : { ...inheritedValue };
    this.meta.set(key, value);
  }
  /**
   * Method to get values from the map
   * 
   * @param key 
   * @returns 
   */
  get(key) {
    return this.meta.get(key);
  }
  /**
   * Method to delete values from the map
   * 
   * @param key 
   * @returns 
   */
  delete(key) {
    return this.meta.delete(key);
  }
  /**
   * Method to get the size of the map
   * 
   * @returns 
   */
  size() {
    return this.meta.size;
  }
  /**
   * This method is needed to convert the key to a regular expression and cover cases like: 
   * 
   * simple * e.g. "a*" instead of "a.*"
   * 
   * simple ? e.g. "a?" instead of "a."
   * 
   * etc. 
   * 
   * @param key 
   * @returns 
   */
  convertToRegExp(key) {
    return key instanceof RegExp ? key : new RegExp(key);
  }
  /**
   * Method to find values in the map by name.
   * 
   * Converts the Key in Map to a regular expression and then compares to the name
   * 
   * @param name 
   * @returns 
   */
  find(name) {
    const results = [];
    for (const [key, value] of this.meta.entries()) {
      if (this.convertToRegExp(String(key)).test(name)) {
        results.push([key, value]);
      }
    }
    return results;
  }
  /**
   * Method to find values in the map by regular expression
   * 
   * Compares Map Key to the input regular expression
   * 
   * @param regex 
   * @returns 
   */
  findByRegex(regex) {
    const results = [];
    for (const [key, value] of this.meta.entries()) {
      if (regex.test(String(key))) {
        results.push([key, value]);
      }
    }
    return results;
  }
  /**
   * Method to check if the map has a specific key
   * 
   * @param key 
   * @returns 
   */
  has(key) {
    return this.meta.has(key);
  }
  /**
   * Method to get the size of the map
   * 
   * @returns 
   */
  entries() {
    return this.meta.entries();
  }
  /**
   * Method to clear the map
   */
  clear() {
    this.meta.clear();
  }
  toArray() {
    return Array.from(this.meta.entries());
  }
  recursiveToJSON(value) {
    switch (true) {
      case value instanceof _A_Meta:
        return value.toJSON();
      case value instanceof Map:
        const obj = {};
        for (const [k, v] of value.entries()) {
          obj[String(k)] = this.recursiveToJSON(v);
        }
        return obj;
      case Array.isArray(value):
        return value.map((item) => this.recursiveToJSON(item));
      case (!!value && typeof value === "object"):
        const res = {};
        for (const [k, v] of Object.entries(value)) {
          res[k] = this.recursiveToJSON(v);
        }
        return res;
      default:
        return value;
    }
  }
  /**
   * Serializes the meta to a JSON object
   * Uses internal storage to convert to JSON
   * 
   * @returns 
   */
  toJSON() {
    const json = {};
    for (const [key, value] of this.meta.entries()) {
      json[String(key)] = this.recursiveToJSON(value);
    }
    return json;
  }
};

// src/global/A-Entity/A-Entity.constants.ts
var A_TYPES__EntityMetaKey = /* @__PURE__ */ ((A_TYPES__EntityMetaKey2) => {
  A_TYPES__EntityMetaKey2["EXTENSIONS"] = "a-component-extensions";
  A_TYPES__EntityMetaKey2["FEATURES"] = "a-component-features";
  A_TYPES__EntityMetaKey2["ABSTRACTIONS"] = "a-component-abstractions";
  A_TYPES__EntityMetaKey2["INJECTIONS"] = "a-component-injections";
  return A_TYPES__EntityMetaKey2;
})(A_TYPES__EntityMetaKey || {});
var A_TYPES__EntityFeatures = /* @__PURE__ */ ((A_TYPES__EntityFeatures2) => {
  A_TYPES__EntityFeatures2["SAVE"] = "save";
  A_TYPES__EntityFeatures2["DESTROY"] = "destroy";
  A_TYPES__EntityFeatures2["LOAD"] = "load";
  return A_TYPES__EntityFeatures2;
})(A_TYPES__EntityFeatures || {});

// src/global/A-Container/A-Container.constants.ts
var A_TYPES__ContainerMetaKey = /* @__PURE__ */ ((A_TYPES__ContainerMetaKey2) => {
  A_TYPES__ContainerMetaKey2["FEATURES"] = "a-container-features";
  A_TYPES__ContainerMetaKey2["INJECTIONS"] = "a-container-injections";
  A_TYPES__ContainerMetaKey2["ABSTRACTIONS"] = "a-container-abstractions";
  A_TYPES__ContainerMetaKey2["EXTENSIONS"] = "a-container-extensions";
  return A_TYPES__ContainerMetaKey2;
})(A_TYPES__ContainerMetaKey || {});

// src/global/A-Component/A-Component.constants.ts
var A_TYPES__ComponentMetaKey = /* @__PURE__ */ ((A_TYPES__ComponentMetaKey2) => {
  A_TYPES__ComponentMetaKey2["EXTENSIONS"] = "a-component-extensions";
  A_TYPES__ComponentMetaKey2["FEATURES"] = "a-component-features";
  A_TYPES__ComponentMetaKey2["INJECTIONS"] = "a-component-injections";
  A_TYPES__ComponentMetaKey2["ABSTRACTIONS"] = "a-component-abstractions";
  return A_TYPES__ComponentMetaKey2;
})(A_TYPES__ComponentMetaKey || {});

// src/global/A-Component/A-Component.meta.ts
var A_ComponentMeta = class extends A_Meta {
  /**
   * Allows to get all the injections for a given handler
   * 
   * @param handler 
   * @returns 
   */
  injections(handler) {
    const injections = this.get("a-component-injections" /* INJECTIONS */);
    const args = injections?.get(handler) || [];
    return args;
  }
  /**
   * Allows to get all the extensions for a given feature
   * 
   * @param feature 
   * @returns 
   */
  extensions(feature) {
    const steps = [];
    const extensions = this.get("a-component-extensions" /* EXTENSIONS */);
    extensions?.find(feature).forEach(([handler, extensions2]) => {
      extensions2.forEach((extension) => {
        steps.push({
          // component: constructor,
          name: extension.name,
          handler: extension.handler,
          behavior: extension.behavior,
          before: extension.before || "",
          after: extension.after || "",
          throwOnError: extension.throwOnError || true,
          override: ""
        });
      });
    });
    return steps;
  }
  /**
   * Returns all features defined in the Component
   * 
   * @returns 
   */
  features() {
    const features = this.get("a-component-features" /* FEATURES */);
    return features?.toArray().map(([, feature]) => feature) || [];
  }
  /**
   * Returns a set of instructions to run proper methods in Component during A-Concept Stage
   * 
   * @param stage 
   * @returns 
   */
  abstractions(abstraction) {
    const steps = [];
    const abstractions = this.get("a-component-abstractions" /* ABSTRACTIONS */);
    const injections = this.get("a-component-injections" /* INJECTIONS */);
    abstractions?.find(`CONCEPT_ABSTRACTION::${abstraction}`).forEach(([handler, extensions]) => {
      extensions.forEach((extension) => {
        const args = injections?.get(extension.handler) || [];
        steps.push({
          ...extension,
          // component: constructor,
          args
        });
      });
    });
    return steps;
  }
};

// src/global/A-Container/A-Container.class.ts
var A_Container = class {
  /**
   * Name of the container
   */
  get name() {
    return this.config?.name || this.constructor.name;
  }
  /**
   * Returns the scope where the container is registered
   */
  get scope() {
    return A_Context.scope(this);
  }
  /**
   * This class should combine Components to achieve the goal withing Concept
   * 
   * Container is a direct container that should be "run" to make Concept work. 
   * So because of that Container can be:
   * - HTTP Server
   * - BASH Script
   * - Database Connection
   * - Microservice
   * - etc.
   * 
   * @param config - Configuration of the container that will be used to run it.
   */
  constructor(config = {}) {
    this.config = config;
    A_Context.allocate(this, this.config);
  }
  /**
   * Calls the feature with the given name in the given scope
   * 
   * [!] Note: This method creates a new instance of the feature every time it is called
   * 
   * @param feature - the name of the feature to call
   * @param scope  - the scope in which to call the feature
   * @returns  - void
   */
  async call(feature, scope) {
    const newFeature = new A_Feature({
      name: feature,
      component: this
    });
    return await newFeature.process(scope);
  }
};

// src/global/A-Container/A-Container.meta.ts
var A_ContainerMeta = class extends A_Meta {
  /**
   * Allows to get all the injections for a given handler
   * 
   * @param handler 
   * @returns 
   */
  injections(handler) {
    const injections = this.get("a-container-injections" /* INJECTIONS */);
    const args = injections?.get(handler) || [];
    return args;
  }
  /**
   * Returns all features defined in the Container
   * 
   * @returns 
   */
  features() {
    const features = this.get("a-container-features" /* FEATURES */);
    return features?.toArray().map(([, feature]) => feature) || [];
  }
  /**
   * Returns a set of instructions to run proper methods in Container during A-Concept Stage
   * 
   * @param stage 
   * @returns 
   */
  abstractions(abstraction) {
    const steps = [];
    const abstractions = this.get("a-container-abstractions" /* ABSTRACTIONS */);
    const injections = this.get("a-container-injections" /* INJECTIONS */);
    abstractions?.find(`CONCEPT_ABSTRACTION::${abstraction}`).forEach(([handler, extensions]) => {
      extensions.forEach((extension) => {
        const args = injections?.get(extension.handler) || [];
        steps.push({
          ...extension,
          args
        });
      });
    });
    return steps;
  }
  /**
   * Allows to get all the extensions for a given feature
   * 
   * @param feature 
   * @returns 
   */
  extensions(feature) {
    const steps = [];
    const extensions = this.get("a-container-extensions" /* EXTENSIONS */);
    extensions?.find(feature).forEach(([handler, extensions2]) => {
      extensions2.forEach((extension) => {
        steps.push({
          // component: constructor,
          name: extension.name,
          handler: extension.handler,
          behavior: extension.behavior,
          before: extension.before || "",
          after: extension.after || "",
          throwOnError: extension.throwOnError || true,
          override: ""
        });
      });
    });
    return steps;
  }
};

// src/helpers/A_Formatter.helper.ts
var A_FormatterHelper = class {
  /**
   * Convert string to UPPER_SNAKE_CASE
   * 
   * @param str 
   * @returns 
   */
  static toUpperSnakeCase(str) {
    return str.trim().replace(/([a-z])([A-Z])/g, "$1_$2").replace(/[^a-zA-Z0-9]+/g, "_").replace(/_+/g, "_").replace(/^_|_$/g, "").toUpperCase();
  }
  /**
   * Convert string to camelCase
   * 
   * @param str 
   * @returns 
   */
  static toCamelCase(str) {
    return str.trim().replace(/[^a-zA-Z0-9]+/g, " ").split(" ").filter(Boolean).map((part, index) => {
      if (index === 0) {
        return part.toLowerCase();
      }
      return part.charAt(0).toUpperCase() + part.slice(1).toLowerCase();
    }).join("");
  }
  /**
   * Convert string to PascalCase
   * 
   * @param str 
   * @returns 
   */
  static toPascalCase(str) {
    return str.trim().replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[^a-zA-Z0-9]+/g, " ").split(" ").filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()).join("");
  }
  /**
   * Convert string to kebab-case
   * 
   * @param str 
   * @returns 
   */
  static toKebabCase(str) {
    return str.replace(/[^a-zA-Z0-9]+/g, " ").replace(/([a-z0-9])([A-Z])/g, "$1 $2").trim().replace(/\s+/g, "-").toLowerCase();
  }
};

// src/helpers/A_Identity.helper.ts
var A_IdentityHelper = class {
  /**
  * Generates a short, time-based unique ID.
  * Encodes current time (ms since epoch) and random bits in base36.
  * Example: "mb4f1g-7f9a1c"
  */
  static generateTimeId(parts = { timestamp: /* @__PURE__ */ new Date(), random: Math.random().toString(36).slice(2, 8) }) {
    const time = parts.timestamp.getTime().toString(36);
    const random = parts.random;
    return `${time}-${random}`;
  }
  /**
   * Parses a short ID back into its parts.
   * Returns an object with the original timestamp (as Date) and random string.
   */
  static parseTimeId(id) {
    const [timePart, randomPart] = id.split("-");
    const timestamp = new Date(parseInt(timePart, 36));
    return { timestamp, random: randomPart };
  }
  /**
   *  Format a number with leading zeros to a fixed length
   * 
   * @param number 
   * @param maxZeros 
   * @returns 
   */
  static formatWithLeadingZeros(number, maxZeros = 10) {
    const formattedNumber = String(number).padStart(maxZeros + 1, "0");
    return formattedNumber.slice(-maxZeros);
  }
  /**
   * Remove leading zeros from a formatted number
   */
  static removeLeadingZeros(formattedNumber) {
    return String(Number(formattedNumber));
  }
  /**
   * Generates a simple hash string from the input string.
   * 
   * 
   * @param input 
   * @returns
   */
  static hashString(input) {
    let hash = 0, i, chr;
    if (input.length === 0) return hash.toString();
    for (i = 0; i < input.length; i++) {
      chr = input.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash.toString();
  }
};

// src/global/A-Error/A_Error.constants.ts
var A_CONSTANTS__ERROR_CODES = {
  UNEXPECTED_ERROR: "A-Error Unexpected Error",
  VALIDATION_ERROR: "A-Error Validation Error"
};
var A_CONSTANTS__ERROR_DESCRIPTION = "If you see this error please let us know.";

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
  /**
   * Generic getter for environment variables. This allows to access environment variables dynamically by name. It will return undefined if the variable does not exist.
   * 
   * @param name 
   * @returns 
   */
  static get(name) {
    return this[name];
  }
  /**
   * Generic setter for environment variables. This allows to set environment variables dynamically by name.
   * 
   * @param name 
   * @param value 
   */
  static set(name, value) {
    this[name] = value;
  }
};

// src/env/env-node.ts
var A_CONCEPT_ENV = class extends A_CONCEPT_BASE_ENV {
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
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER] || process.cwd();
  }
  /**
   * Allows to define a default error description for errors thrown without a description
   */
  static get A_ERROR_DEFAULT_DESCRIPTION() {
    return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION] || super.A_ERROR_DEFAULT_DESCRIPTION;
  }
  static get(name) {
    return process.env[name] || this[name];
  }
  static set(name, value) {
    process.env[name] = value;
  }
};

// src/global/A-Error/A_Error.class.ts
var A_Error = class _A_Error extends Error {
  // ====================================================================
  // ================== Static A-Error Information ======================
  // ====================================================================
  /**
   * Error Identifier that corresponds to the class name
   */
  static get entity() {
    return A_FormatterHelper.toKebabCase(this.name);
  }
  /**
   * DEFAULT Namespace of the error from environment variable A_CONCEPT_NAMESPACE
   * 
   * [!] If environment variable is not set, it will default to 'a-concept'
   */
  static get concept() {
    return A_Context.concept;
  }
  /**
   * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
   * 
   * [!] If environment variable is not set, it will default to 'core'
   * [!] Scope is an application specific identifier that can be used to group entities together
   * [!] e.g. 'default', 'core', 'public', 'internal', etc
   */
  static get scope() {
    return A_Context.root.name;
  }
  constructor(param1, param2) {
    switch (true) {
      case param1 instanceof _A_Error:
        return param1;
      case param1 instanceof Error:
        super(param1.message);
        break;
      case A_TypeGuards.isErrorSerializedType(param1):
        super(param1.message);
        break;
      case (A_TypeGuards.isErrorConstructorType(param1) && "description" in param1):
        super(`[${param1.title}]: ${param1.description}`);
        break;
      case (A_TypeGuards.isErrorConstructorType(param1) && !("description" in param1)):
        super(param1.title);
        break;
      case (A_TypeGuards.isString(param1) && !param2):
        super(param1);
        break;
      case (A_TypeGuards.isString(param1) && !!param2):
        super(`[${param1}]: ${param2}`);
        break;
      default:
        super("An unknown error occurred.");
    }
    const initializer = this.getInitializer(param1, param2);
    initializer.call(this, param1, param2);
  }
  // ====================================================================
  // ================== Public A-Error Information ======================
  // ====================================================================
  /**
   * Returns the ASEID of the error instance
   */
  get aseid() {
    return this._aseid;
  }
  /**
   * Returns the title of the error
   * 
   * Example: 'User not found', 'Validation error', 'Unauthorized access', etc.
   * 
   * [!] Note: This title should be short and concise, less than 60 characters
   * [!] Note: If title exceeds 60 characters, there would be an error thrown
   * [!] Note: This title is intended to be human-readable and can be displayed in UI or logs
   */
  get title() {
    return this._title;
  }
  /**
   * Returns an Error message what is a brief title of the error
   * 
   */
  get message() {
    return super.message;
  }
  /**
   * Returns a unique code representing the type of error
   * 
   * If code is not provided, it will generate a kebab-case of the message
   * 
   * Example: 'validation-error', 'not-found', 'user-not-found', 'unauthorized' etc.
   * 
   * [!] Note: It is recommended to use kebab-case for error codes
   * [!] Note: If not provided would be used a kebab-case message of the error
   */
  get code() {
    return this._code || A_FormatterHelper.toKebabCase(this.title);
  }
  /**
   * Returns the type of the error which corresponds to the static entity of the class
   * 
   * Example: 'a-error', 'validation-error', 'not-found-error', 'user-error', etc.
   * 
   * Defaults to the kebab-case of the class name
   * 
   * [!] Note: naming ad separation are fully dependent on the architecture of the application
   * [!] Note: It is recommended to use kebab-case for error types
   * [!] Note: This type is intended to group similar errors together
   */
  get type() {
    return this.constructor.entity;
  }
  /**
   * Returns a link with possible documentation or support page for the error
   * If link is not provided, it will generate a link based on the ASEID of the error that points to the A-Concept support page
   * 
   * Example: https://adaas.support/a-concept/errors/{ASEID}
   * 
   * [!] Note: ASEID is generated based on the static properties of the class (concept, scope, entity) and the code of the error
   */
  get link() {
    if (this._link)
      return this._link;
    const url = new URL(`https://adaas.support/a-concept/errors/${this.aseid.toString()}`);
    return url.toString();
  }
  /**
   * The scope name of the error instance
   * 
   * If scope is not provided, it will use the static scope of the class
   * 
   * [!] Note: Scope is an application specific identifier that can be used to group entities together
   * [!] e.g. 'default', 'core', 'public', 'internal', etc
   */
  get scope() {
    return this._aseid.scope;
  }
  /**
   * A detailed description of the error
   * If description is not provided, it will use the environment variable A_ERROR_DEFAULT_DESCRIPTION or a generic message
   * 
   * Example: 'The user with the given ID was not found.', 'The provided data is invalid.', 'You do not have permission to access this resource.', etc.
   * 
   * [!] Note: This description is intended to provide more context about the error and can be used for debugging or logging purposes
   */
  get description() {
    return this._description || String(A_CONCEPT_ENV.A_ERROR_DEFAULT_DESCRIPTION) || A_CONSTANTS__ERROR_DESCRIPTION;
  }
  /**
   * Returns the original error if any
   * 
   * This can be useful for debugging purposes to see the original stack trace or error message
   * 
   * [!] Note: Original error is optional and may not be present in all cases
   */
  get originalError() {
    return this._originalError;
  }
  /**
   * Determines which initializer method to use based on the type of the first parameter.
   * 
   * @param param1 
   * @returns
   */
  getInitializer(param1, param2) {
    switch (true) {
      case (A_TypeGuards.isString(param1) && !param2):
        return this.fromMessage;
      case (A_TypeGuards.isString(param1) && !!param2):
        return this.fromTitle;
      case param1 instanceof Error:
        return this.fromError;
      case A_TypeGuards.isErrorSerializedType(param1):
        return this.fromJSON;
      case A_TypeGuards.isErrorConstructorType(param1):
        return this.fromConstructor;
      default: {
        throw new _A_Error(
          A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
          "Invalid parameters provided to A_Error constructor"
        );
      }
    }
  }
  /**
   * Initializes the A_Error instance from a standard Error object.
   * 
   * @param error 
   */
  fromError(error) {
    this._title = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
    this._aseid = new ASEID({
      concept: this.constructor.concept,
      scope: this.constructor.scope,
      entity: this.constructor.entity,
      id: this.code
    });
    this._originalError = error;
  }
  /**
   * Initializes the A_Error instance from a message.
   * 
   * @param title 
   * @param description 
   */
  fromMessage(message) {
    this._title = A_CONSTANTS__ERROR_CODES.UNEXPECTED_ERROR;
    this._aseid = new ASEID({
      concept: this.constructor.concept,
      scope: this._scope || this.constructor.scope,
      entity: this.constructor.entity,
      id: this.code
    });
    this._link = void 0;
    this._originalError = void 0;
  }
  /**
   * Initializes the A_Error instance from a serialized object.
   * 
   * @param serialized
   */
  fromJSON(serialized) {
    this._aseid = new ASEID(serialized.aseid);
    super.message = serialized.message;
    this._title = serialized.title;
    this._code = serialized.code;
    this._scope = serialized.scope;
    this._description = serialized.description;
    this._originalError = serialized.originalError ? new _A_Error(serialized.originalError) : void 0;
    this._link = serialized.link;
  }
  fromTitle(title, description) {
    this.validateTitle(title);
    this._title = title;
    this._description = description;
    this._aseid = new ASEID({
      concept: this.constructor.concept,
      scope: this._scope || this.constructor.scope,
      entity: this.constructor.entity,
      id: this.code
    });
    this._link = void 0;
    this._originalError = void 0;
  }
  /**
   * Initializes the A_Error instance from a constructor parameters object.
   * 
   * @param params 
   */
  fromConstructor(params) {
    this.validateTitle(params.title);
    this._title = params.title;
    this._code = params.code;
    this._scope = params.scope ? A_TypeGuards.isScopeInstance(params.scope) ? params.scope.name : params.scope : void 0;
    this._aseid = new ASEID({
      concept: this.constructor.concept,
      scope: this._scope || this.constructor.scope,
      entity: this.constructor.entity,
      id: this.code
    });
    this._description = params.description;
    this._link = params.link;
    if (params.originalError instanceof _A_Error) {
      let rootError = params.originalError;
      while (rootError.originalError instanceof _A_Error) {
        rootError = rootError.originalError;
      }
      this._originalError = rootError.originalError || rootError;
    } else {
      this._originalError = params.originalError;
    }
  }
  /**
   * Serializes the A_Error instance to a plain object.
   * 
   * 
   * @returns 
   */
  toJSON() {
    return {
      aseid: this.aseid.toString(),
      title: this.title,
      code: this.code,
      type: this.type,
      message: this.message,
      link: this.link,
      scope: this.scope,
      description: this.description,
      originalError: this.originalError?.message
    };
  }
  // --------------------------------------------------------------------------
  // ----------------------- PROTECTED HELPERS --------------------------------
  // --------------------------------------------------------------------------
  /**
   * Checks if the provided title exceeds 60 characters.
   * If it does, throws a validation A_Error.
   * 
   * @param title 
   */
  validateTitle(title) {
    if (title.length > 60) {
      throw new _A_Error(
        A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
        "A-Error title exceeds 60 characters limit."
      );
    }
    if (title.length === 0) {
      throw new _A_Error(
        A_CONSTANTS__ERROR_CODES.VALIDATION_ERROR,
        "A-Error title cannot be empty."
      );
    }
  }
};

// src/global/ASEID/ASEID.error.ts
var ASEID_Error = class extends A_Error {
};
ASEID_Error.ASEIDInitializationError = "ASEID Initialization Error";
ASEID_Error.ASEIDValidationError = "ASEID Validation Error";

// src/global/ASEID/ASEID.class.ts
var _ASEID = class _ASEID {
  /**
   * Tests if the identity string is an ASEID
   * 
   * @param identity 
   * @returns 
   */
  static isASEID(identity) {
    return this.regexp.test(identity);
  }
  static compare(aseid1, aseid2) {
    if (!aseid1 || !aseid2) {
      return false;
    }
    if (A_TypeGuards.isString(aseid1) && this.isASEID(aseid1) === false) {
      throw new ASEID_Error(ASEID_Error.ASEIDValidationError, `Invalid ASEID format provided: ${aseid1}`);
    }
    if (A_TypeGuards.isString(aseid2) && this.isASEID(aseid2) === false) {
      throw new ASEID_Error(ASEID_Error.ASEIDValidationError, `Invalid ASEID format provided: ${aseid2}`);
    }
    const aseidObj1 = aseid1 instanceof _ASEID ? aseid1 : new _ASEID(aseid1);
    const aseidObj2 = aseid2 instanceof _ASEID ? aseid2 : new _ASEID(aseid2);
    return aseidObj1.toString() === aseidObj2.toString();
  }
  constructor(param1) {
    this.verifyInput(param1);
    const initializer = this.getInitializer(param1);
    initializer.call(this, param1);
  }
  /**
   * Getters for ASEID components
   */
  get concept() {
    return this._concept || A_Context.concept;
  }
  /**
   * Get the scope of the ASEID
   */
  get scope() {
    return this._scope || A_Context.root.name;
  }
  /**
   * Get the entity of the ASEID
   */
  get entity() {
    return this._entity;
  }
  /**
   * Get the id of the ASEID
   */
  get id() {
    return this._id;
  }
  /**
   * Get the version of the ASEID (if any)
   */
  get version() {
    return this._version;
  }
  /**
   * Get the shard of the ASEID (if any)
   */
  get shard() {
    return this._shard;
  }
  /**
   * Get the hash of the ASEID, Unique identifier based on the ASEID string
   * Useful when aseid details should not be exposed directly
   */
  get hash() {
    return A_IdentityHelper.hashString(this.toString());
  }
  /**
   * get Internal Initializer based on the type of the parameter provided
   * 
   * @param param1 
   * @returns 
   */
  getInitializer(param1) {
    switch (true) {
      case A_TypeGuards.isString(param1):
        return this.fromString;
      case A_TypeGuards.isObject(param1):
        return this.fromObject;
      default:
        throw new ASEID_Error(
          ASEID_Error.ASEIDInitializationError,
          "Invalid parameters provided to ASEID constructor"
        );
    }
  }
  /**
   * Initialize ASEID from string
   * 
   * @param param1 
   */
  fromString(param1) {
    const [concept, body, version] = param1.split("@");
    const [scope, entity, idCandidate] = body.split(":");
    const shard = idCandidate.includes(".") ? idCandidate.split(".")[0] : void 0;
    const id = idCandidate.includes(".") ? idCandidate.split(".")[1] : idCandidate;
    this._concept = concept || A_Context.root.name;
    this._scope = scope || A_Context.root.name;
    this._entity = entity;
    this._id = id;
    this._version = version;
    this._shard = shard;
  }
  /**
   * Initialize ASEID from object
   * 
   * @param param1 
   */
  fromObject(param1) {
    this._concept = param1.concept ? _ASEID.isASEID(param1.concept) ? new _ASEID(param1.concept).id : param1.concept : A_Context.concept;
    this._scope = param1.scope ? A_TypeGuards.isNumber(param1.scope) ? A_IdentityHelper.formatWithLeadingZeros(param1.scope) : _ASEID.isASEID(param1.scope) ? new _ASEID(param1.scope).id : param1.scope : A_Context.root.name;
    this._entity = param1.entity;
    this._id = A_TypeGuards.isNumber(param1.id) ? A_IdentityHelper.formatWithLeadingZeros(param1.id) : param1.id;
    this._version = param1.version;
    this._shard = param1.shard;
  }
  /**
   * String representation of the ASEID
   * 
   * @returns 
   */
  toString() {
    return `${this.concept}@${this.scope}:${this.entity}:${this.shard ? this.shard + "." + this.id : this.id}${this.version ? "@" + this.version : ""}`;
  }
  /**
   * JSON representation of the ASEID
   * 
   * @returns 
   */
  toJSON() {
    return {
      concept: this._concept,
      scope: this._scope,
      entity: this._entity,
      id: this._id,
      version: this._version,
      shard: this._shard
    };
  }
  // --------------------------------------------------------------------------
  // ----------------------- PROTECTED HELPERS --------------------------------
  // --------------------------------------------------------------------------
  verifyInput(param1) {
    switch (true) {
      // 1) check for string and validate it as ASEID
      case (A_TypeGuards.isString(param1) && !_ASEID.isASEID(param1)):
        throw new ASEID_Error(ASEID_Error.ASEIDValidationError, "Invalid ASEID format provided");
      // 2) check for object and validate required fields
      case (A_TypeGuards.isObject(param1) && !param1.id):
        throw new ASEID_Error(ASEID_Error.ASEIDValidationError, "ASEID id is required");
      // 3) check for object and validate required fields
      case (A_TypeGuards.isObject(param1) && !param1.entity):
        throw new ASEID_Error(ASEID_Error.ASEIDValidationError, "ASEID entity is required");
    }
  }
};
//==========================================================================
//============================= STATIC METHODS ===========================
//==========================================================================
/**
 * ASEID Regular Expression
 */
_ASEID.regexp = new RegExp(`^[a-z|A-Z|0-9|-]+@[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|-]+:[a-z|A-Z|0-9|\\.|-]+(@v[0-9|\\.]+|@lts)?$`);
var ASEID = _ASEID;

// src/global/A-Entity/A-Entity.error.ts
var A_EntityError = class extends A_Error {
};
/**
 * Error code for validation errors.
 */
A_EntityError.ValidationError = "A-Entity Validation Error";

// src/global/A-Entity/A-Entity.class.ts
var A_Entity = class {
  // ====================================================================
  // ================== Static A-Entity Information ============================
  // ====================================================================
  /**
   * Entity Identifier that corresponds to the class name
   */
  static get entity() {
    return A_FormatterHelper.toKebabCase(this.name);
  }
  /**
   * DEFAULT Concept Name (Application Name) of the entity from environment variable A_CONCEPT_NAME
   * [!] If environment variable is not set, it will default to 'a-concept'
   */
  static get concept() {
    return A_Context.concept;
  }
  /**
   * DEFAULT Scope of the entity from environment variable A_CONCEPT_DEFAULT_SCOPE
   * [!] If environment variable is not set, it will default to 'core'
   * [!] Scope is an application specific identifier that can be used to group entities together
   * [!] e.g. 'default', 'core', 'public', 'internal', etc
   */
  static get scope() {
    return A_Context.root.name;
  }
  constructor(props) {
    const initializer = this.getInitializer(props);
    initializer.call(this, props);
  }
  // ====================================================================
  // ================== DUPLICATED ASEID Getters ========================
  // ====================================================================
  /**
   * Extracts the ID from the ASEID
   * ID is the unique identifier of the entity
   */
  get id() {
    return this.aseid.id;
  }
  // ====================================================================
  // ================== Constructor Helpers =============================
  // ====================================================================
  // --- Type guards used to classify `props` properly ---
  isStringASEID(x) {
    return typeof x === "string" && ASEID.isASEID(x);
  }
  isASEIDInstance(x) {
    return x instanceof ASEID;
  }
  /**
   * A "serialized" object is considered such if it is a non-null object 
   * and contains an "aseid" property (this mirrors your original check). 
   * 
   * @param x 
   * @returns 
   */
  isSerializedObject(x) {
    return !!x && typeof x === "object" && "aseid" in x;
  }
  /**
   * Constructor-style props = a plain object which does NOT contain "aseid".
   * This is the "create from provided fields" case.
   * 
   * @param x 
   * @returns 
   */
  isConstructorProps(x) {
    return !!x && typeof x === "object" && !("aseid" in x);
  }
  /**
   * Determines the appropriate initializer method based on the type of `props`.
   * The method checks if `props` is:  
   * 1) a string that matches ASEID format -> fromASEID
   * 2) an ASEID instance -> fromASEID
   * 3) a serialized object (has 'aseid') -> fromJSON
   * 4) a plain object with no 'aseid' -> treat as constructor props -> fromNew
   * 
   * [!] If `props` is undefined, it will call fromUndefined method
   * 
   * If none of the above, it throws an error indicating incorrect constructor usage.
   * 
   * 
   * To get a custom initializer, override this method in the child class.
   * Example:
   * ```typescript
   * protected getInitializer(
   *   props?: string | ASEID | _SerializedType | _ConstructorType
   * ): (props: any) => void | (() => void) {
   *   if('customField' in props) {
   *       return this.fromCustomField.bind(this);
   *   }
   *   return super.getInitializer(props);
   * }
   * ```
   * @param props
   * @returns The appropriate initializer method
   */
  getInitializer(props) {
    if (!props) {
      return this.fromUndefined;
    }
    if (this.isStringASEID(props)) {
      return this.fromASEID;
    }
    if (this.isASEIDInstance(props)) {
      return this.fromASEID;
    }
    if (this.isSerializedObject(props)) {
      return this.fromJSON;
    }
    if (this.isConstructorProps(props)) {
      return this.fromNew;
    }
    throw new A_EntityError(A_EntityError.ValidationError, "Unable to determine A-Entity constructor initialization method. Please check the provided parameters.");
  }
  /**
   * Generates a new ASEID for the entity. 
   * It uses class definitions for concept, scope, and entity,
   * and allows overriding any of these values.
   * 
   * @param override 
   * @returns 
   */
  generateASEID(override) {
    return new ASEID({
      concept: override?.concept || this.constructor.concept,
      scope: override?.scope || this.constructor.scope,
      entity: override?.entity || this.constructor.entity,
      id: override?.id || A_IdentityHelper.generateTimeId()
    });
  }
  /**
   * Call a feature of the component with the provided scope
   * 
   * [!] If the provided scope is not inherited from the entity scope, it will be inherited
   * 
   * @param lifecycleMethod 
   * @param args 
   */
  async call(feature, scope) {
    const newFeature = new A_Feature({
      name: feature,
      component: this,
      scope
    });
    return await newFeature.process(scope);
  }
  // ====================================================================
  // ================== Entity Base Methods =============================
  // ====================================================================
  /**
   * The default method that can be called and extended to load entity data.
   */
  async load(scope) {
    return this.call("load", scope);
  }
  /**
   * The default method that can be called and extended to destroy entity data.
   */
  async destroy(scope) {
    return this.call("destroy", scope);
  }
  /**
   * The default method that can be called and extended to save entity data.
   */
  async save(scope) {
    return this.call("save", scope);
  }
  // ====================================================================
  // ================== Entity Serialization ============================
  // ====================================================================
  /**
   * Create a new entity from ASEID string or instance
   * [!] Executed when the constructor is called with a string or ASEID instance that represents the ASEID
   * [!] Executes By Default with new A_Entity('aseid-string') or new A_Entity(new ASEID(...)) if getInitializer has not been overridden
   * 
   * @param aseid 
   */
  fromASEID(aseid) {
    if (aseid instanceof ASEID)
      this.aseid = aseid;
    else
      this.aseid = new ASEID(aseid);
  }
  /**
   * Handles the case when no props are provided to the constructor.
   * This method can be overridden in child classes to set default values or perform specific initialization logic.
   * By default, it does nothing.
   * 
   * 
   * @returns 
   */
  fromUndefined() {
    this.aseid = this.generateASEID();
    return;
  }
  /**
   * Create a new entity from constructor object
   * [!] Executed when the constructor is called with an object that does not contain "aseid" property
   * [!] Executes By Default with new A_Entity({}) if getInitializer has not been overridden
   * 
   * @param newEntity 
   * @returns 
   */
  fromNew(newEntity) {
    this.aseid = this.generateASEID();
    return;
  }
  /**
   * Creates a new entity from serialized object
   * 
   * [!] Executed when the constructor is called with an object that contains "aseid" property
   * [!] Executes By Default with new A_Entity({ aseid: '...' }) if getInitializer has not been overridden
   * 
   * 
   * @param serialized 
   * @returns 
   */
  fromJSON(serialized) {
    this.aseid = new ASEID(serialized.aseid);
    return;
  }
  /**
   * Converts the entity to a JSON object 
   * [!] This method should be extended in the child classes to include all properties of the entity
   * [!] Includes aseid by default 
   * 
   * 
   * @returns 
   */
  toJSON() {
    return {
      aseid: this.aseid.toString()
    };
  }
  /**
   * Returns the string representation of the entity
   * what is basically the ASEID string
   * 
   * @returns 
   */
  toString() {
    return this.aseid ? this.aseid.toString() : this.constructor.name;
  }
};

// src/global/A-Entity/A-Entity.meta.ts
var A_EntityMeta = class extends A_Meta {
  /**
   * Returns all features defined in the Container
   * 
   * @returns 
   */
  features() {
    const features = this.get("a-component-features" /* FEATURES */);
    return features?.toArray().map(([, feature]) => feature) || [];
  }
  /**
   * Allows to get all the injections for a given handler
   * 
   * @param handler 
   * @returns 
   */
  injections(handler) {
    const injections = this.get("a-component-injections" /* INJECTIONS */);
    const args = injections?.get(handler) || [];
    return args;
  }
};

// src/global/A-Fragment/A-Fragment.class.ts
var A_Fragment = class {
  /**
   * Creates a new A_Fragment instance.
   * 
   * A_Fragment implements the singleton pattern for execution contexts, allowing
   * shared state management across different parts of the application pipeline.
   * Each fragment serves as a memory container that can store typed data and be
   * serialized for persistence or transmission.
   * 
   * Key Benefits:
   * - Centralized state management for related operations
   * - Type-safe meta operations with full IntelliSense support
   * - Serialization support for data persistence 
   * - Singleton pattern ensures consistent state within scope
   * 
   * @param params - Initialization parameters
   * @param params.name - Optional custom name for the fragment (defaults to class name)
   * 
   * @example
   * ```typescript
   * const fragment = new A_Fragment<{ userId: string }>({ 
   *   name: 'UserSessionFragment' 
   * });
   * fragment.set('userId', '12345');
   * ```
   */
  constructor(params = {}) {
    this._name = params.name || this.constructor.name;
  }
  /**
   * Gets the fragment's unique name/identifier.
   * 
   * @returns The fragment name
   */
  get name() {
    return this._name;
  }
  /**
   * Serializes the fragment to a JSON-compatible object.
   * 
   * This method combines the fragment's name with all meta data to create
   * a serializable representation. The return type is determined by the
   * _SerializedType generic parameter, allowing for custom serialization formats.
   * 
   * @returns A serialized representation of the fragment
   * 
   * @example
   * ```typescript
   * const fragment = new A_Fragment<{ userId: string, role: string }>({
   *   name: 'UserFragment'
   * });
   * fragment.set('userId', '12345');
   * fragment.set('role', 'admin');
   * 
   * const json = fragment.toJSON();
   * // Result: { name: 'UserFragment', userId: '12345', role: 'admin' }
   * ```
   */
  toJSON() {
    const result = {
      name: this.name
    };
    return result;
  }
};

// src/helpers/A_Common.helper.ts
var A_CommonHelper = class {
  /**
   * A simple promise that resolves immediately.
   * Can be used in async functions to create a resolved promise.
   */
  static resolve() {
    return new Promise((resolve) => resolve());
  }
  /**
   * Check if a class is inherited from another class
   * 
   * @param childClass 
   * @param parentClass 
   * @returns 
   */
  static isInheritedFrom(childClass, parentClass) {
    let current = childClass;
    while (current) {
      if (current === parentClass) {
        return true;
      }
      current = Object.getPrototypeOf(current);
    }
    return false;
  }
  /**
   * Get all parent classes of a given class
   * 
   * @param childClass 
   * @returns 
   */
  static getParentClasses(childClass) {
    let current = typeof childClass === "function" ? Object.getPrototypeOf(childClass) : Object.getPrototypeOf(childClass.constructor);
    const parents = [];
    while (current && current !== Function.prototype) {
      parents.push(current);
      current = Object.getPrototypeOf(current);
    }
    return parents;
  }
  /**
   * Get the class inheritance chain as an array of class names
   * 
   * @param childClass 
   * @returns 
   */
  static getClassInheritanceChain(childClass) {
    let current = typeof childClass === "function" ? Object.getPrototypeOf(childClass) : Object.getPrototypeOf(childClass.constructor);
    const chain = typeof childClass === "function" ? [childClass] : [childClass.constructor];
    while (current && current !== Function.prototype) {
      chain.push(current);
      current = Object.getPrototypeOf(current);
    }
    return chain;
  }
  /**
   * Get the parent class of a given class
   * 
   * @param childClass 
   * @returns 
   */
  static getParentClass(childClass) {
    return Object.getPrototypeOf(childClass);
  }
  /**
   *  Omit properties from an object or array with nested objects
   * 
   * @param input 
   * @param paths 
   * @returns 
   */
  static omitProperties(input, paths) {
    const result = JSON.parse(JSON.stringify(input));
    function removeProperties(target, currPath) {
      const currKey = currPath[0];
      if (currPath.length === 1) {
        delete target[currKey];
      } else if (target[currKey] !== void 0 && typeof target[currKey] === "object") {
        removeProperties(target[currKey], currPath.slice(1));
      }
    }
    paths.forEach((path) => {
      const pathKeys = path.split(".");
      removeProperties(result, pathKeys);
    });
    return result;
  }
  static isObject(item) {
    return item !== null && typeof item === "object" && !Array.isArray(item);
  }
  static deepMerge(target, source, visited = /* @__PURE__ */ new Map()) {
    if (this.isObject(target) && this.isObject(source)) {
      for (const key in source) {
        if (this.isObject(source[key])) {
          if (!target[key]) {
            target[key] = {};
          }
          if (!visited.has(source[key])) {
            visited.set(source[key], {});
            this.deepMerge(target[key], source[key], visited);
          } else {
            target[key] = visited.get(source[key]);
          }
        } else {
          target[key] = source[key];
        }
      }
    }
    return target;
  }
  static deepClone(target) {
    if (target === null || target === void 0) {
      return target;
    }
    if (typeof target !== "object") {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime());
    }
    if (Array.isArray(target)) {
      return target.map((item) => this.deepClone(item));
    }
    if (typeof target === "function") {
      return target;
    }
    if (target instanceof Object) {
      const clone = {};
      for (const key in target) {
        if (target.hasOwnProperty(key)) {
          clone[key] = this.deepClone(target[key]);
        }
      }
      return clone;
    }
    throw new Error("Unable to clone the object. Unsupported type.");
  }
  static deepCloneAndMerge(target, source) {
    if ((source === null || source === void 0) && (target === null || target === void 0))
      return target;
    if ((target === null || target === void 0) && source) {
      return this.deepClone(source);
    }
    if (typeof target !== "object") {
      return target;
    }
    if (target instanceof Date) {
      return new Date(target.getTime());
    }
    if (Array.isArray(target)) {
      return target.map((item) => this.deepCloneAndMerge(item, source));
    }
    if (typeof target === "function") {
      return target;
    }
    if (target instanceof Object) {
      const clone = {};
      for (const key in target) {
        if (source[key] !== null && source[key] !== void 0)
          clone[key] = this.deepCloneAndMerge(target[key], source[key]);
        else
          clone[key] = this.deepClone(target[key]);
      }
      for (const key in source) {
        if (target[key] !== void 0 && target[key] !== null)
          clone[key] = this.deepCloneAndMerge(target[key], source[key]);
        else
          clone[key] = this.deepClone(source[key]);
      }
      return clone;
    }
    throw new Error("Unable to clone the object. Unsupported type.");
  }
  /**
   * Get a readable name for a component (string, class, function, React element, instance, etc.)
   *
   * Covers:
   * - string tags ("div")
   * - symbols (Symbol.for('xxx'))
   * - functions and classes (with name or displayName)
   * - React elements (object with `type`)
   * - component instances (constructor.name)
   * - objects with custom toString returning meaningful info
   *
   * Falls back to sensible defaults ("Unknown" / "Anonymous").
   */
  static getComponentName(component) {
    const UNKNOWN = "Unknown";
    const ANONYMOUS = "Anonymous";
    if (component === null || component === void 0) {
      return UNKNOWN;
    }
    if (typeof component === "string") {
      return component || UNKNOWN;
    }
    if (typeof component === "symbol") {
      try {
        return component.toString();
      } catch {
        return UNKNOWN;
      }
    }
    if (Array.isArray(component)) {
      if (component.length === 0) return UNKNOWN;
      return this.getComponentName(component[0]);
    }
    if (typeof component === "function") {
      const fnAny = component;
      if (fnAny.displayName) return String(fnAny.displayName);
      if (fnAny.name) return String(fnAny.name);
      if (fnAny.constructor && fnAny.constructor.name) {
        return String(fnAny.constructor.name);
      }
      try {
        const src = Function.prototype.toString.call(component);
        const match = src.match(/^(?:class\s+([A-Za-z0-9_$]+)|function\s+([A-Za-z0-9_$]+)|([A-Za-z0-9_$]+)\s*=>)/);
        if (match) {
          return match[1] || match[2] || match[3] || ANONYMOUS;
        }
      } catch {
      }
      return ANONYMOUS;
    }
    if (typeof component === "object") {
      const objAny = component;
      if (objAny.type) {
        return this.getComponentName(objAny.type);
      }
      if (objAny.displayName) return String(objAny.displayName);
      if (objAny.name) return String(objAny.name);
      if (objAny.constructor && objAny.constructor.name && objAny.constructor.name !== "Object") {
        return String(objAny.constructor.name);
      }
      try {
        const s = objAny.toString();
        if (typeof s === "string" && s !== "[object Object]") {
          return s;
        }
      } catch {
      }
      return ANONYMOUS;
    }
    try {
      return String(component);
    } catch {
      return UNKNOWN;
    }
  }
};

// src/global/A-Scope/A-Scope.error.ts
var A_ScopeError = class extends A_Error {
};
A_ScopeError.InitializationError = "A-Scope Initialization Error";
A_ScopeError.ConstructorError = "Unable to construct A-Scope instance";
A_ScopeError.ResolutionError = "A-Scope Resolution Error";
A_ScopeError.RegistrationError = "A-Scope Registration Error";
A_ScopeError.CircularInheritanceError = "A-Scope Circular Inheritance Error";
A_ScopeError.CircularImportError = "A-Scope Circular Import Error";
A_ScopeError.DeregistrationError = "A-Scope Deregistration Error";

// src/global/A-Dependency/A-Dependency.error.ts
var A_DependencyError = class extends A_Error {
};
A_DependencyError.InvalidDependencyTarget = "Invalid Dependency Target";
A_DependencyError.InvalidLoadTarget = "Invalid Load Target";
A_DependencyError.InvalidLoadPath = "Invalid Load Path";
A_DependencyError.InvalidDefaultTarget = "Invalid Default Target";
A_DependencyError.ResolutionParametersError = "Dependency Resolution Parameters Error";

// src/global/A-Dependency/A-Dependency-Default.decorator.ts
function A_Dependency_Default(...args) {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidDefaultTarget,
        `A-Default cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      create: true,
      args
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency-Flat.decorator.ts
function A_Dependency_Flat() {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidDependencyTarget,
        `A-Dependency cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      flat: true
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency-Load.decorator.ts
function A_Dependency_Load() {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidLoadTarget,
        `A-Load cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      load: true
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency-Parent.decorator.ts
function A_Dependency_Parent(layerOffset = -1) {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidDependencyTarget,
        `A-Dependency cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      parent: layerOffset
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency-Require.decorator.ts
function A_Dependency_Require() {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidDependencyTarget,
        `A-Dependency cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      require: true
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency-All.decorator.ts
function A_Dependency_All() {
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_DependencyError(
        A_DependencyError.InvalidDependencyTarget,
        `A-All cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex].resolutionStrategy = {
      pagination: {
        ...paramsArray[parameterIndex].resolutionStrategy.pagination,
        count: -1
      }
    };
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Dependency/A-Dependency.class.ts
var A_Dependency = class {
  /**
   * Class instances allows to identify dependencies by name and use them for better type checking
   * 
   * @param name 
   */
  constructor(name, resolutionStrategy) {
    this._defaultPagination = {
      count: 1,
      from: "start"
    };
    this._defaultResolutionStrategy = {
      require: false,
      load: false,
      parent: 0,
      flat: false,
      create: false,
      args: [],
      query: {},
      pagination: this._defaultPagination
    };
    this._name = typeof name === "string" ? name : A_CommonHelper.getComponentName(name);
    this._target = typeof name === "string" ? void 0 : name;
    this.resolutionStrategy = resolutionStrategy || {};
    this.initCheck();
  }
  /**
   * Allows to indicate which Injected parameter is required
   * 
   * [!] If parameter marked as required is not provided, an error will be thrown
   * 
   * @returns 
   */
  static get Required() {
    return A_Dependency_Require;
  }
  /**
   * Allows to indicate which dependency should be loaded from a specific path
   * 
   * @returns 
   */
  static get Loaded() {
    return A_Dependency_Load;
  }
  /**
   * Allows to indicate which dependency default parameters should be used
   * 
   * @returns 
   */
  static get Default() {
    return A_Dependency_Default;
  }
  /**
   * Allows to indicate which parent dependency should be resolved
   * e.g. from which layer up the parent should be taken
   * 
   * @returns 
   */
  static get Parent() {
    return A_Dependency_Parent;
  }
  /**
   * Allows to indicate that the dependency should be resolved in a flat manner
   * Only in the same scope, without going up to parent scopes
   * 
   * @returns 
   */
  static get Flat() {
    return A_Dependency_Flat;
  }
  /**
   * Allows to indicate that all instances of the dependency should be resolved
   * 
   * @returns
   */
  static get All() {
    return A_Dependency_All;
  }
  get flat() {
    return this._resolutionStrategy.flat;
  }
  get require() {
    return this._resolutionStrategy.require;
  }
  get load() {
    return this._resolutionStrategy.load;
  }
  /**
   * Indicates cases when it's necessary to search across all instances
   */
  get all() {
    return this._resolutionStrategy.pagination.count !== 1 || Object.keys(this._resolutionStrategy.query).length > 0;
  }
  get parent() {
    return this._resolutionStrategy.parent;
  }
  get create() {
    return this._resolutionStrategy.create;
  }
  get args() {
    return this._resolutionStrategy.args;
  }
  get query() {
    return this._resolutionStrategy.query;
  }
  get pagination() {
    return this._resolutionStrategy.pagination;
  }
  /**
   * Gets the dependency name
   * 
   * Can be identifier, url or any string value
   * 
   * @returns 
   */
  get name() {
    return this._name;
  }
  /**
   * Returns the original class of the dependency if provided
   * 
   */
  get target() {
    return this._target;
  }
  /**
   * Gets the dependency resolution strategy
   */
  get resolutionStrategy() {
    return this._resolutionStrategy;
  }
  /**
   * Sets the dependency resolution strategy
   */
  set resolutionStrategy(strategy) {
    this._resolutionStrategy = {
      ...this._defaultResolutionStrategy,
      ...this._resolutionStrategy,
      ...strategy,
      pagination: {
        ...this._defaultPagination,
        ...(this._resolutionStrategy || {}).pagination,
        ...strategy.pagination || {}
      }
    };
  }
  /**
   * Method for the parameters check and all input data before usage
   * 
   * @returns 
   */
  initCheck() {
    if (!this._resolutionStrategy) {
      throw new A_DependencyError(
        A_DependencyError.ResolutionParametersError,
        `Resolution strategy parameters are not provided for dependency: ${this._name}`
      );
    }
    return this;
  }
  /**
   * Serializes the dependency to a JSON object
   * 
   * @returns 
   */
  toJSON() {
    return {
      name: this._name,
      all: this.all,
      require: this.require,
      load: this.load,
      parent: this.parent,
      flat: this.flat,
      create: this.create,
      args: this.args,
      query: this.query,
      pagination: this.pagination
    };
  }
};

// src/global/A-Scope/A-Scope.class.ts
var A_Scope = class {
  constructor(param1, param2) {
    /**
     * Internal meta storage using A_Meta for type-safe key-value operations.
     * This stores all the scope's runtime data that can be accessed and modified
     * throughout the execution pipeline or within running containers.
     */
    this._meta = new A_Meta();
    // ===========================================================================
    // --------------------ALLowed Constructors--------------------------------
    // ===========================================================================
    /**
     * A set of allowed components, A set of constructors that are allowed in the scope
     *      
     */
    this._allowedComponents = /* @__PURE__ */ new Set();
    /**
     * A set of allowed errors, A set of constructors that are allowed in the scope
     */
    this._allowedErrors = /* @__PURE__ */ new Set();
    /**
     * A set of allowed entities, A set of constructors that are allowed in the scope
     */
    this._allowedEntities = /* @__PURE__ */ new Set();
    /**
     * A set of allowed fragments, A set of constructors that are allowed in the scope
     */
    this._allowedFragments = /* @__PURE__ */ new Set();
    // ===========================================================================
    // --------------------Internal Storage--------------------------------
    // ===========================================================================
    /**
     * Storage for the components, should be strong as components are unique per scope
     */
    this._components = /* @__PURE__ */ new Map();
    /**
     * Storage for the errors, should be strong as errors are unique per code
     */
    this._errors = /* @__PURE__ */ new Map();
    /**
     * Storage for the entities, should be strong as entities are unique per aseid
     */
    this._entities = /* @__PURE__ */ new Map();
    /**
     * Storage for the fragments, should be weak as fragments are singletons per scope
     */
    this._fragments = /* @__PURE__ */ new Map();
    /**
     * Storage for imported scopes 
     */
    this._imports = /* @__PURE__ */ new Set();
    const initializer = this.getInitializer(param1);
    initializer.call(this, param1, param2);
  }
  // ===========================================================================
  // --------------------Readonly Allowed Properties----------------------------
  // ===========================================================================
  /**
   * Returns the name of the scope
   */
  get name() {
    return this._name;
  }
  /**
   * Returns the meta object of the scope
   */
  get meta() {
    return this._meta;
  }
  /**
   * Returns a list of Constructors for A-Components that are available in the scope
   */
  get allowedComponents() {
    return this._allowedComponents;
  }
  /**
   * Returns a list of Constructors for A-Entities that are available in the scope
   */
  get allowedEntities() {
    return this._allowedEntities;
  }
  /**
   * Returns a list of Constructors for A-Fragments that are available in the scope
   */
  get allowedFragments() {
    return this._allowedFragments;
  }
  /**
   * Returns a list of Constructors for A-Errors that are available in the scope
   */
  get allowedErrors() {
    return this._allowedErrors;
  }
  // ===========================================================================
  // --------------------Readonly Registered Properties--------------------------
  // ===========================================================================
  /**
   * Returns an Array of entities registered in the scope
   * 
   * [!] One entity per aseid
   */
  get entities() {
    return Array.from(this._entities.values());
  }
  /**
   * Returns an Array of fragments registered in the scope
   * 
   * [!] One fragment per scope
   */
  get fragments() {
    return Array.from(this._fragments.values());
  }
  /**
   * Returns an Array of components registered in the scope
   * 
   * [!] One component instance per scope
   */
  get components() {
    return Array.from(this._components.values());
  }
  /**
   * Returns an Array of errors registered in the scope
   * 
   * [!] One error per code
   */
  get errors() {
    return Array.from(this._errors.values());
  }
  /**
   * Returns an Array of imported scopes
   * [!] Imported scopes are scopes that have been imported into the current scope using the import() method
   */
  get imports() {
    return Array.from(this._imports.values());
  }
  /**
   * Returns the parent scope of the current scope
   * 
   * @param setValue 
   * @returns 
   */
  get parent() {
    return this._parent;
  }
  /**
   * Generator to iterate through all parent scopes
   */
  *parents() {
    let currentParent = this._parent;
    while (currentParent) {
      yield currentParent;
      currentParent = currentParent._parent;
    }
  }
  /**
   * This method is used to retrieve a parent scope at a specific level
   * 
   * [!] Note that if the level is out of bounds, undefined is returned
   * [!!] Uses negative values for levels (e.g. -1 for immediate parent, -2 for grandparent, etc.)
   * 
   * @param level 
   * @returns 
   */
  parentOffset(layerOffset) {
    let parentScope = this;
    while (layerOffset <= -1 && parentScope) {
      parentScope = parentScope.parent;
      layerOffset++;
    }
    return parentScope;
  }
  /**
   * Determines which initializer method to use based on the type of the first parameter.
   * 
   * @param param1 
   * @returns
   */
  getInitializer(param1, param2) {
    switch (true) {
      case (!param1 && !param2):
        return this.defaultInitialized;
      case !!param1:
        return this.defaultInitialized;
      default:
        throw new A_ScopeError(A_ScopeError.ConstructorError, "Invalid parameters provided to A_Scope constructor");
    }
  }
  defaultInitialized(params = {}, config = {}) {
    this._name = params.name || this.constructor.name;
    this.initComponents(params.components);
    this.initErrors(params.errors);
    this.initFragments(params.fragments);
    this.initEntities(params.entities);
    this.initMeta(params.meta);
    if (config.parent) {
      this._parent = config.parent;
    }
  }
  //==========================================================================
  // --------------------Scope Initialization Methods---------------------------
  //==========================================================================
  /**
   * This method is used to initialize the components in the scope
   * To save memory components are initialized only when they are requested
   * 
   * This method only registers the component in the scope in case they are not registered yet
   * 
   * @param _components 
   */
  initComponents(_components) {
    _components?.forEach(this.register.bind(this));
  }
  /**
   * This method is used to initialize the errors in the scope
   * 
   * This method only registers the errors in the scope in case they are not registered yet
   * 
   * @param _errors 
   */
  initErrors(_errors) {
    _errors?.forEach(this.register.bind(this));
  }
  /**
   * This method is used to initialize the entities in the scope
   * 
   * This method only registers the entities in the scope in case they are not registered yet
   * 
   * @param _entities 
   */
  initEntities(_entities) {
    _entities?.forEach((ent) => this.register(ent));
  }
  /**
   * This method is used to initialize the fragments in the scope
   * 
   * This method only registers the fragments in the scope in case they are not registered yet
   * 
   * @param _fragments 
   */
  initFragments(_fragments) {
    _fragments?.forEach(this.register.bind(this));
  }
  /**
   * This method is used to initialize the meta in the scope
   * 
   * This method only sets the meta values in the scope in case they are not set yet
   * 
   * @param _meta 
   */
  initMeta(_meta) {
    if (_meta) {
      Object.entries(_meta).forEach(([key, value]) => {
        this._meta.set(key, value);
      });
    }
  }
  // ==========================================================================
  // --------------------Scope Public Methods-----------------------------------
  // ==========================================================================
  /**
   * This method is used to destroy the scope and all its registered components, fragments and entities
   * 
   * [!] This method deregisters all components, fragments and entities from the A-Context
   * [!] This method also clears all internal registries and collections
   */
  destroy() {
    this._components.forEach((component) => A_Context.deregister(component));
    this._fragments.forEach((fragment) => A_Context.deregister(fragment));
    this._entities.forEach((entity) => A_Context.deregister(entity));
    this._components.clear();
    this._errors.clear();
    this._fragments.clear();
    this._entities.clear();
    this._imports.clear();
    if (this.issuer()) {
      A_Context.deallocate(this);
    }
  }
  /**
   * Retrieves a value from the scope's meta.
   * 
   * @param param - The key to retrieve
   * @returns The value associated with the key, or undefined if not found
   * 
   * @example
   * ```typescript
   * const userId = scope.get('userId');
   * if (userId) {
   *   console.log(`Current user: ${userId}`);
   * }
   * ```
   */
  get(param) {
    return this._meta.get(param);
  }
  /**
   * Stores a value in the scope's meta.
   * 
   * @param param - The key to store the value under
   * @param value - The value to store
   * 
   * @example
   * ```typescript
   * scope.set('userId', '12345');
   * scope.set('role', 'admin');
   * ```
   */
  set(param, value) {
    this._meta.set(param, value);
  }
  /**
   * Returns the issuer of the scope, useful for debugging and tracking purposes
   * 
   * Issuer can be:
   * - A Container that allocated the scope
   * - A Feature that allocated the scope
   * 
   * [!] Note that the issuer is the direct allocator of the scope, so if a Container allocated a Feature that allocated the scope, the issuer will be the Feature
   * 
   * @returns 
   */
  issuer() {
    return A_Context.issuer(this);
  }
  /**
   * This method is used to inherit from a parent scope
   * 
   * [!] This method checks for circular inheritance and throws an error if detected
   * 
   * @param parent 
   * @returns 
   */
  inherit(parent) {
    if (!parent)
      throw new A_ScopeError(
        A_ScopeError.InitializationError,
        `Invalid parent scope provided`
      );
    if (parent === this)
      throw new A_ScopeError(
        A_ScopeError.CircularInheritanceError,
        `Unable to inherit scope ${this.name} from itself`
      );
    if (parent === this._parent)
      return this;
    const circularCheck = this.checkCircularInheritance(parent);
    if (circularCheck)
      throw new A_ScopeError(
        A_ScopeError.CircularInheritanceError,
        `Circular inheritance detected: ${[...circularCheck, parent.name].join(" -> ")}`
      );
    this._parent = parent;
    return this;
  }
  /**
   * This method allows to import other scopes, to make their dependencies available in the current scope
   * 
   * [!] Import doesn't create a parent-child relationship between scopes, it just copies the dependencies from the imported scopes
   * [!] It doesn't change the entities ownership, so entities remain unique to their original scopes
   * 
   * @param scopes 
   * @returns 
   */
  import(...scopes) {
    scopes.forEach((scope) => {
      if (scope === this)
        throw new A_ScopeError(
          A_ScopeError.CircularImportError,
          `Unable to import scope ${this.name} into itself`
        );
      if (this._imports.has(scope))
        return;
      this._imports.add(scope);
    });
    return this;
  }
  /**
   * This method allows to deimport other scopes, to remove their dependencies from the current scope
   * 
   * 
   * @param scopes 
   * @returns 
   */
  deimport(...scopes) {
    scopes.forEach((scope) => {
      if (this._imports.has(scope))
        this._imports.delete(scope);
    });
    return this;
  }
  has(ctor) {
    let found = this.hasFlat(ctor);
    if (!found && !!this._parent)
      try {
        return this._parent.has(ctor);
      } catch (error) {
        return false;
      }
    return found;
  }
  hasFlat(ctor) {
    let found = false;
    switch (true) {
      // 1) Check if it's a Scope. It's always true since it returns itself
      case A_TypeGuards.isScopeConstructor(ctor):
        return true;
      // 2) Check by string name.  
      case A_TypeGuards.isString(ctor): {
        const possibleComponent = Array.from(this.allowedComponents).find((c) => c.name === ctor);
        if (possibleComponent) found = true;
        const possibleFragment = Array.from(this.allowedFragments).find((f) => f.name === ctor);
        if (possibleFragment) found = true;
        const possibleEntity = Array.from(this.allowedEntities).find((e) => e.name === ctor);
        if (possibleEntity) found = true;
        const possibleError = Array.from(this.allowedErrors).find((e) => e.name === ctor);
        if (possibleError) found = true;
        break;
      }
      // 3) Check if it's a Component
      case A_TypeGuards.isComponentConstructor(ctor): {
        found = this.isAllowedComponent(ctor) || !![...this.allowedComponents].find((c) => A_CommonHelper.isInheritedFrom(c, ctor));
        break;
      }
      // 4) Check if it's an Entity
      case A_TypeGuards.isEntityConstructor(ctor): {
        found = this.isAllowedEntity(ctor) || !![...this.allowedEntities].find((e) => A_CommonHelper.isInheritedFrom(e, ctor));
        break;
      }
      // 5) Check if it's a Fragment
      case A_TypeGuards.isFragmentConstructor(ctor): {
        found = this.isAllowedFragment(ctor) || !![...this.allowedFragments].find((f) => A_CommonHelper.isInheritedFrom(f, ctor));
        break;
      }
      // 6) Check if it's an Error
      case A_TypeGuards.isErrorConstructor(ctor): {
        found = this.isAllowedError(ctor) || !![...this.allowedErrors].find((e) => A_CommonHelper.isInheritedFrom(e, ctor));
        break;
      }
      // 7) Check scope issuer
      case (this.issuer() && (this.issuer().constructor === ctor || A_CommonHelper.isInheritedFrom(
        this.issuer().constructor,
        ctor
      ))): {
        found = true;
        break;
      }
    }
    return found;
  }
  /**
   * Allows to resolve a specific dependency 
   * 
   * @param dependency 
   * @returns 
   */
  resolveDependency(dependency) {
    let result = [];
    let targetScope = this.parentOffset(dependency.parent) || this;
    switch (true) {
      // 1) Flat resolution
      case (dependency.flat && !dependency.all): {
        const resolved = targetScope.resolveFlatOnce(dependency.target || dependency.name);
        if (resolved)
          result = [resolved];
        break;
      }
      case (dependency.flat && dependency.all): {
        result = targetScope.resolveFlatAll(dependency.target || dependency.name);
        break;
      }
      case (!dependency.flat && !dependency.all): {
        const resolved = targetScope.resolveOnce(dependency.target || dependency.name);
        if (resolved)
          result = [resolved];
        break;
      }
      case (!dependency.flat && dependency.all): {
        result = targetScope.resolveAll(dependency.target || dependency.name);
        break;
      }
      default:
        result = [];
    }
    if (dependency.create && !result.length && A_TypeGuards.isAllowedForDependencyDefaultCreation(dependency.target)) {
      const newDependency = new dependency.target(...dependency.args);
      targetScope.register(newDependency);
      result.push(newDependency);
    }
    if (dependency.require && !result.length) {
      throw new A_ScopeError(
        A_ScopeError.ResolutionError,
        `Dependency ${dependency.name} is required but could not be resolved in scope ${targetScope.name}`
      );
    }
    if (dependency.query.aseid)
      result = result.filter((dep) => A_TypeGuards.hasASEID(dep) && ASEID.compare(dep.aseid, dependency.query.aseid));
    else if (Object.keys(dependency.query).length > 0)
      result = result.filter((dep) => {
        const query = dependency.query;
        if (!query) return true;
        return Object.entries(query).every(([key, value]) => {
          return dep[key] === value;
        });
      });
    const count = dependency.pagination.count;
    const from = dependency.pagination.from;
    const startSliceIndex = from === "end" ? count === -1 ? 0 : Math.max(result.length - count, 0) : 0;
    const endSliceIndex = from === "end" ? result.length : count === -1 ? result.length : Math.min(count, result.length);
    const slice = result.slice(startSliceIndex, endSliceIndex);
    return slice.length === 1 && count !== -1 ? slice[0] : slice.length ? slice : void 0;
  }
  resolveConstructor(name) {
    const component = Array.from(this.allowedComponents).find(
      (c) => c.name === name || c.name === A_FormatterHelper.toPascalCase(name)
    );
    if (component) return component;
    else {
      const protoComponent = Array.from(this.allowedComponents).find(
        //  it should go rthough prototyopes and check their names to be equal to the provided name
        (c) => {
          let current = c;
          while (current) {
            if (current.name === name || current.name === A_FormatterHelper.toPascalCase(name)) {
              return true;
            }
            current = Object.getPrototypeOf(current);
          }
          return false;
        }
      );
      if (protoComponent) return protoComponent;
    }
    const entity = Array.from(this.allowedEntities).find(
      (e) => e.name === name || e.name === A_FormatterHelper.toPascalCase(name) || e.entity === name || e.entity === A_FormatterHelper.toKebabCase(name)
    );
    if (entity) return entity;
    else {
      const protoEntity = Array.from(this.allowedEntities).find(
        (e) => A_CommonHelper.isInheritedFrom(e, name)
      );
      if (protoEntity) return protoEntity;
    }
    const fragment = Array.from(this.allowedFragments).find(
      (f) => f.name === name || f.name === A_FormatterHelper.toPascalCase(name)
    );
    if (fragment) return fragment;
    else {
      const protoFragment = Array.from(this.allowedFragments).find(
        (f) => A_CommonHelper.isInheritedFrom(f, name)
      );
      if (protoFragment) return protoFragment;
    }
    for (const importedScope of this._imports) {
      const importedConstructor = importedScope.resolveConstructor(name);
      if (importedConstructor) {
        return importedConstructor;
      }
    }
    if (!!this._parent) {
      return this._parent.resolveConstructor(name);
    }
    return void 0;
  }
  resolveAll(param1) {
    const results = /* @__PURE__ */ new Set();
    const currentResults = this.resolveFlatAll(param1);
    currentResults.forEach((result) => results.add(result));
    this._imports.forEach((importedScope) => {
      if (importedScope.has(param1)) {
        const importedResults = importedScope.resolveFlatAll(param1);
        importedResults.forEach((result) => results.add(result));
      }
    });
    let parentScope = this._parent;
    while (parentScope && parentScope.has(param1)) {
      const parentResults = parentScope.resolveAll(param1);
      parentResults.forEach((result) => results.add(result));
      parentScope = parentScope._parent;
    }
    return Array.from(results);
  }
  resolveFlatAll(param1) {
    const results = [];
    switch (true) {
      // 1) if a parameter is a component constructor
      case A_TypeGuards.isComponentConstructor(param1): {
        this.allowedComponents.forEach((ctor) => {
          if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
            const instance = this.resolveOnce(ctor);
            if (instance) results.push(instance);
          }
        });
        break;
      }
      // 2) if a parameter is a fragment constructor
      case A_TypeGuards.isFragmentConstructor(param1): {
        this.allowedFragments.forEach((ctor) => {
          if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
            const instance = this.resolveOnce(ctor);
            if (instance) results.push(instance);
          }
        });
        break;
      }
      case A_TypeGuards.isEntityConstructor(param1): {
        this.entities.forEach((entity) => {
          if (A_CommonHelper.isInheritedFrom(entity.constructor, param1)) {
            results.push(entity);
          }
        });
        break;
      }
      case A_TypeGuards.isString(param1): {
        const ctor = this.resolveConstructor(param1);
        if (!A_TypeGuards.isComponentConstructor(ctor) && !A_TypeGuards.isEntityConstructor(ctor) && !A_TypeGuards.isFragmentConstructor(ctor))
          throw new A_ScopeError(
            A_ScopeError.ResolutionError,
            `Unable to resolve all instances for name: ${param1} in scope ${this.name} as no matching component, entity or fragment constructor found`
          );
        if (ctor) {
          const instances = this.resolveAll(ctor);
          if (instances)
            results.push(...instances);
        }
        break;
      }
      default:
        throw new A_ScopeError(
          A_ScopeError.ResolutionError,
          `Invalid parameter provided to resolveAll method: ${param1} in scope ${this.name}`
        );
    }
    return results;
  }
  resolve(param1) {
    const dependency = A_TypeGuards.isDependencyInstance(param1) ? param1 : new A_Dependency(param1);
    return this.resolveDependency(dependency);
  }
  resolveOnce(param1) {
    const value = this.resolveFlatOnce(param1);
    if (!value) {
      for (const importedScope of this._imports) {
        if (importedScope.has(param1)) {
          const importedValue = importedScope.resolveFlatOnce(param1);
          if (importedValue) {
            return importedValue;
          }
        }
      }
    }
    if (!value && !!this.parent) {
      return this.parent.resolveOnce(param1);
    }
    return value;
  }
  resolveFlat(param1) {
    return this.resolveFlatOnce(param1);
  }
  /**
   * Resolves a component, fragment or entity from the scope without checking parent scopes
   * 
   * @param component 
   * @param instructions 
   */
  resolveFlatOnce(component) {
    let value = void 0;
    const componentName = A_CommonHelper.getComponentName(component);
    if (!component || !this.has(component)) {
      return void 0;
    }
    switch (true) {
      case A_TypeGuards.isString(component): {
        value = this.resolveByName(component);
        break;
      }
      case A_TypeGuards.isConstructorAllowedForScopeAllocation(component): {
        value = this.resolveIssuer(component);
        break;
      }
      case A_TypeGuards.isScopeConstructor(component): {
        value = this.resolveScope(component);
        break;
      }
      case A_TypeGuards.isEntityConstructor(component): {
        value = this.resolveEntity(component);
        break;
      }
      case A_TypeGuards.isFragmentConstructor(component): {
        value = this.resolveFragment(component);
        break;
      }
      case A_TypeGuards.isComponentConstructor(component): {
        value = this.resolveComponent(component);
        break;
      }
      case A_TypeGuards.isErrorConstructor(component): {
        value = this.resolveError(component);
        break;
      }
      default:
        throw new A_ScopeError(
          A_ScopeError.ResolutionError,
          `Injected Component ${componentName} not found in the scope`
        );
    }
    return value;
  }
  // ==================================================================================================
  // --------------------------------------------------------------------------------------------------
  // -------------------------------------INTERNAL RESOLVERS-------------------------------------------
  // --------------------------------------------------------------------------------------------------
  // ==================================================================================================
  /**
   * This method is used internally to resolve a component, fragment or entity by its constructor name
   * 
   * [!] Note that this method checks for the component, fragment or entity in the current scope and all parent scopes
   * [!!] Note: No parent scopes are checked
   * 
   * @param name  - name of the component, fragment or entity to resolve (constructor name for components and fragments, static entity property for entities, static code property for commands)
   * @returns 
   */
  resolveByName(name) {
    const component = Array.from(this.allowedComponents).find(
      (c) => c.name === name || c.name === A_FormatterHelper.toPascalCase(name)
    );
    if (component) return this.resolveOnce(component);
    const entity = Array.from(this.allowedEntities).find(
      (e) => e.name === name || e.name === A_FormatterHelper.toPascalCase(name) || e.entity === name || e.entity === A_FormatterHelper.toKebabCase(name)
    );
    if (entity) return this.resolveOnce(entity);
    const fragment = Array.from(this.allowedFragments).find(
      (f) => f.name === name || f.name === A_FormatterHelper.toPascalCase(name)
    );
    if (fragment) return this.resolveOnce(fragment);
    const error = Array.from(this.allowedErrors).find(
      (e) => e.name === name || e.name === A_FormatterHelper.toPascalCase(name) || e.code === name || e.code === A_FormatterHelper.toKebabCase(name)
    );
    if (error) return this.resolveOnce(error);
    return void 0;
  }
  /**
   * Resolves the issuer of the scope by provided constructor
   * 
   * [!] Note that this method checks ONLY for the direct issuer of the scope
   * [!!] No parent scopes are checked
   * 
   * 
   * @param ctor 
   * @returns 
   */
  resolveIssuer(ctor) {
    const issuer = this.issuer();
    if (issuer && (issuer.constructor === ctor || A_CommonHelper.isInheritedFrom(issuer?.constructor, ctor))) {
      return issuer;
    }
    return void 0;
  }
  /**
   * This method is used internally to resolve a single entity from the scope based on the provided instructions
   * 
   * [!] Note that this method can return either a single entity or an array of entities depending on the instructions provided
   * [!!] Note: No parent scopes are checked  
   * 
   * @param entity 
   * @param instructions 
   * @returns 
   */
  resolveEntity(entity) {
    return this.entities.find((e) => e instanceof entity);
  }
  /**
   * This method is used internally to resolve a single error from the scope
   * 
   * [!] Note that errors are singleton instances within the scope
   * [!!] No parent scopes are checked
   * 
   * @param error 
   * @returns 
   */
  resolveError(error) {
    return this.errors.find((e) => e instanceof error);
  }
  /**
   * This method is used internally to resolve a single fragment from the scope
   * 
   * [!] Note that this method checks for the fragment in the current scope and all parent scopes
   * 
   * @param fragment 
   * @returns 
   */
  resolveFragment(fragment) {
    const fragmentInstancePresented = this._fragments.get(fragment);
    switch (true) {
      case (fragmentInstancePresented && this._fragments.has(fragment)):
        return fragmentInstancePresented;
      // 3) In case when there's a component that is inherited from the required component
      case (!fragmentInstancePresented && Array.from(this._allowedFragments).some((el) => A_CommonHelper.isInheritedFrom(el, fragment))): {
        const found = Array.from(this._allowedFragments).find((el) => A_CommonHelper.isInheritedFrom(el, fragment));
        return this.resolveFragment(found);
      }
      default:
        return void 0;
    }
  }
  /**
   *  This method is used internally to resolve a single scope from the current scope
   * 
   * @param scope 
   * @returns 
   */
  resolveScope(scope) {
    return this;
  }
  /**
   * This method is used internally to resolve a single component from the scope
   * 
   * [!!] Note: No parent scopes are checked  
   * 
   * @param component 
   * @returns 
   */
  resolveComponent(component) {
    switch (true) {
      // 1) In case when the component is available and exists in the scope
      case (this.allowedComponents.has(component) && this._components.has(component)): {
        return this._components.get(component);
      }
      // 2) In case the component available but does NOT exist in the scope
      case (this.allowedComponents.has(component) && !this._components.has(component)): {
        const componentMeta = A_Context.meta(component);
        const argsMeta = componentMeta.get("a-component-injections" /* INJECTIONS */);
        const resolvedArgs = (argsMeta?.get("constructor") || []).map((dependency) => this.resolve(dependency));
        const newComponent = new component(...resolvedArgs);
        this.register(newComponent);
        return this._components.get(component);
      }
      // 3) In case when there's a component that is inherited from the required component
      case (!this.allowedComponents.has(component) && Array.from(this.allowedComponents).some((el) => A_CommonHelper.isInheritedFrom(el, component))): {
        const found = Array.from(this.allowedComponents).find((el) => A_CommonHelper.isInheritedFrom(el, component));
        return this.resolveComponent(found);
      }
      default:
        return void 0;
    }
  }
  register(param1) {
    switch (true) {
      // ------------------------------------------
      // ------------ Instances ----------------
      // ------------------------------------------
      // 1) In case when it's a A-Component instance
      case param1 instanceof A_Component: {
        if (!this.allowedComponents.has(param1.constructor))
          this.allowedComponents.add(param1.constructor);
        this._components.set(
          param1.constructor,
          param1
        );
        A_Context.register(this, param1);
        break;
      }
      // 3) In case when it's a A-Entity instance
      case (A_TypeGuards.isEntityInstance(param1) && !this._entities.has(param1.aseid.toString())): {
        if (!this.allowedEntities.has(param1.constructor))
          this.allowedEntities.add(param1.constructor);
        this._entities.set(param1.aseid.toString(), param1);
        A_Context.register(this, param1);
        break;
      }
      // 4) In case when it's a A-Fragment instance
      case A_TypeGuards.isFragmentInstance(param1): {
        if (!this.allowedFragments.has(param1.constructor))
          this.allowedFragments.add(param1.constructor);
        this._fragments.set(
          param1.constructor,
          param1
        );
        A_Context.register(this, param1);
        break;
      }
      // 5) In case when it's a A-Error instance
      case A_TypeGuards.isErrorInstance(param1): {
        if (!this.allowedErrors.has(param1.constructor))
          this.allowedErrors.add(param1.constructor);
        this._errors.set(
          param1.code,
          param1
        );
        A_Context.register(this, param1);
        break;
      }
      // ------------------------------------------
      // ------------ Constructors ----------------
      // ------------------------------------------
      // 6) In case when it's a A-Component constructor
      case A_TypeGuards.isComponentConstructor(param1): {
        if (!this.allowedComponents.has(param1))
          this.allowedComponents.add(param1);
        break;
      }
      // 8) In case when it's a A-Fragment constructor
      case A_TypeGuards.isFragmentConstructor(param1): {
        if (!this.allowedFragments.has(param1))
          this.allowedFragments.add(param1);
        break;
      }
      // 9) In case when it's a A-Entity constructor
      case A_TypeGuards.isEntityConstructor(param1): {
        if (!this.allowedEntities.has(param1))
          this.allowedEntities.add(param1);
        break;
      }
      // 10) In case when it's a A-Error constructor
      case A_TypeGuards.isErrorConstructor(param1): {
        if (!this.allowedErrors.has(param1))
          this.allowedErrors.add(param1);
        break;
      }
      // ------------------------------------------
      // ------------ Invalid Cases ----------------
      // ------------------------------------------
      default:
        if (param1 instanceof A_Entity)
          throw new A_ScopeError(
            A_ScopeError.RegistrationError,
            `Entity with ASEID ${param1.aseid.toString()} is already registered in the scope ${this.name}`
          );
        else if (param1 instanceof A_Fragment)
          throw new A_ScopeError(
            A_ScopeError.RegistrationError,
            `Fragment ${param1.constructor.name} is already registered in the scope ${this.name}`
          );
        else {
          const componentName = A_CommonHelper.getComponentName(param1);
          throw new A_ScopeError(
            A_ScopeError.RegistrationError,
            `Cannot register ${componentName} in the scope ${this.name}`
          );
        }
    }
  }
  deregister(param1) {
    switch (true) {
      // ------------------------------------------
      // ------------ Instances ----------------
      // ------------------------------------------
      // 1) In case when it's a A-Component instance
      case param1 instanceof A_Component: {
        this._components.delete(param1.constructor);
        A_Context.deregister(param1);
        const ctor = param1.constructor;
        const hasComponent = this._components.has(ctor);
        if (!hasComponent) {
          this.allowedComponents.delete(ctor);
        }
        break;
      }
      // 3) In case when it's a A-Entity instance
      case A_TypeGuards.isEntityInstance(param1): {
        this._entities.delete(param1.aseid.toString());
        A_Context.deregister(param1);
        const ctor = param1.constructor;
        const hasEntity = Array.from(this._entities.values()).some((entity) => entity instanceof ctor);
        if (!hasEntity) {
          this.allowedEntities.delete(ctor);
        }
        break;
      }
      // 4) In case when it's a A-Fragment instance
      case A_TypeGuards.isFragmentInstance(param1): {
        this._fragments.delete(param1.constructor);
        A_Context.deregister(param1);
        const ctor = param1.constructor;
        const hasFragment = Array.from(this._fragments.values()).some((fragment) => fragment instanceof ctor);
        if (!hasFragment) {
          this.allowedFragments.delete(ctor);
        }
        break;
      }
      // 5) In case when it's a A-Error instance
      case A_TypeGuards.isErrorInstance(param1): {
        this._errors.delete(param1.code);
        A_Context.deregister(param1);
        const ctor = param1.constructor;
        const hasError = Array.from(this._errors.values()).some((error) => error instanceof ctor);
        if (!hasError) {
          this.allowedErrors.delete(ctor);
        }
        break;
      }
      // ------------------------------------------
      // ------------ Constructors ----------------
      // ------------------------------------------
      // 6) In case when it's a A-Component constructor
      case A_TypeGuards.isComponentConstructor(param1): {
        this.allowedComponents.delete(param1);
        break;
      }
      // 8) In case when it's a A-Fragment constructor
      case A_TypeGuards.isFragmentConstructor(param1): {
        this.allowedFragments.delete(param1);
        Array.from(this._fragments.entries()).forEach(([ctor, instance]) => {
          if (A_CommonHelper.isInheritedFrom(ctor, param1)) {
            this._fragments.delete(ctor);
            A_Context.deregister(instance);
          }
        });
        break;
      }
      // 9) In case when it's a A-Entity constructor
      case A_TypeGuards.isEntityConstructor(param1): {
        this.allowedEntities.delete(param1);
        Array.from(this._entities.entries()).forEach(([aseid, instance]) => {
          if (A_CommonHelper.isInheritedFrom(instance.constructor, param1)) {
            this._entities.delete(aseid);
            A_Context.deregister(instance);
          }
        });
        break;
      }
      // 10) In case when it's a A-Error constructor
      case A_TypeGuards.isErrorConstructor(param1): {
        this.allowedErrors.delete(param1);
        Array.from(this._errors.entries()).forEach(([code, instance]) => {
          if (A_CommonHelper.isInheritedFrom(instance.constructor, param1)) {
            this._errors.delete(code);
            A_Context.deregister(instance);
          }
        });
        break;
      }
      // ------------------------------------------
      // ------------ Invalid Cases ----------------
      // ------------------------------------------
      default:
        const componentName = A_CommonHelper.getComponentName(param1);
        throw new A_ScopeError(
          A_ScopeError.DeregistrationError,
          `Cannot deregister ${componentName} from the scope ${this.name}`
        );
    }
  }
  /**
   * This method is useful when you want to serialize the scope to JSON
   * 
   * [!] Note this is not a deep serialization, only the fragments are serialized
   * [!] Fragments are a storage for information which is relevant to the scope
   * 
   * @returns 
   */
  toJSON() {
    return this.fragments.reduce((acc, fragment) => {
      const serialized = fragment.toJSON();
      return {
        ...acc,
        [serialized.name]: serialized
      };
    }, {});
  }
  //==========================================================================
  // --------------------Scope Type Check Helpers---------------------------
  //==========================================================================
  /**
   * Type guard to check if the constructor is of type A_Component and is allowed in the scope
   * 
   * @param ctor 
   * @returns 
   */
  isAllowedComponent(ctor) {
    return A_TypeGuards.isComponentConstructor(ctor) && this.allowedComponents.has(ctor);
  }
  /**
   * Type guard to check if the constructor is of type A_Entity and is allowed in the scope
   * 
   * @param ctor 
   * @returns 
   */
  isAllowedEntity(ctor) {
    return A_TypeGuards.isEntityConstructor(ctor) && this.allowedEntities.has(ctor);
  }
  /**
   * Type guard to check if the constructor is of type A_Fragment and is allowed in the scope
   * 
   * @param ctor 
   * @returns 
   */
  isAllowedFragment(ctor) {
    return A_TypeGuards.isFragmentConstructor(ctor) && this.allowedFragments.has(ctor);
  }
  /**
   * Type guard to check if the constructor is of type A_Error and is allowed in the scope
   * 
   * @param ctor 
   * @returns 
   */
  isAllowedError(ctor) {
    return A_TypeGuards.isErrorConstructor(ctor) && this.allowedErrors.has(ctor);
  }
  // ==========================================================================
  // --------------------DEBUG & Helpers Methods--------------------------------
  // ===========================================================================
  /**
   * This method is used to check if the scope is inherited from another scope
   * 
   * @param scope 
   * @returns 
   */
  isInheritedFrom(scope) {
    let current = this;
    while (current) {
      if (current === scope) {
        return true;
      }
      current = current._parent;
    }
    return false;
  }
  /**
   * Helper method to check circular inheritance
   * Should return a full sequence of inheritance for logging purposes
   * 
   * @param scope 
   * @returns 
   */
  checkCircularInheritance(scope) {
    const inheritanceChain = [];
    let current = this._parent;
    while (current) {
      inheritanceChain.push(current.name);
      if (current === scope) {
        return inheritanceChain;
      }
      current = current._parent;
    }
    return false;
  }
  /**
   * Helper method to print the inheritance chain of the scope
   */
  printInheritanceChain() {
    const chain = [];
    let current = this;
    while (current) {
      chain.push(current.name);
      current = current._parent;
    }
    console.log(chain.join(" -> "));
  }
};

// src/global/A-Caller/A_Caller.error.ts
var A_CallerError = class extends A_Error {
};
/**
 * This error code indicates that there was an issue initializing the A-Caller
 */
A_CallerError.CallerInitializationError = "Unable to initialize A-Caller";

// src/global/A-Caller/A_Caller.class.ts
var A_Caller = class {
  /**
   * A_Caller allows to get the component that initiated the feature call
   * 
   * It can be used then in @A_Inject(A_Caller) to get the entity that initiated the feature call
   * 
   * [!] If Scope is not provided, a new empty scope will be created and inherited from the global scope
   * 
   * @param component 
   * @param scope 
   */
  constructor(component) {
    this.validateParams(component);
    this._component = component;
  }
  get component() {
    return this._component;
  }
  /**
   * Validates the provided parameters and Ensures that the component is of an allowed type
   * 
   * @param component 
   */
  validateParams(component) {
    if (!A_TypeGuards.isAllowedForFeatureCall(component)) {
      throw new A_CallerError(
        A_CallerError.CallerInitializationError,
        `Invalid A-Caller component provided of type: ${typeof component} with value: ${JSON.stringify(component).slice(0, 100)}...`
      );
    }
  }
};

// src/helpers/A_TypeGuards.helper.ts
var A_TypeGuards = class _A_TypeGuards {
  // ===========================================================================
  // ============================= BASE Type Guards ============================
  // ===========================================================================
  /**
   * Check if value is a string
   * 
   * @param value 
   * @returns 
   */
  static isString(value) {
    return typeof value === "string" || value instanceof String;
  }
  /**
   * Check if value is a number
   * 
   * @param value 
   * @returns 
   */
  static isNumber(value) {
    return typeof value === "number" && isFinite(value);
  }
  /**
   * Check if value is a boolean
   * 
   * @param value 
   * @returns 
   */
  static isBoolean(value) {
    return typeof value === "boolean";
  }
  /**
   * Check if value is an array
   * 
   * @param value 
   * @returns 
   */
  static isArray(value) {
    return Array.isArray(value);
  }
  /**
   * Check if value is an object
   * 
   * @param value 
   * @returns 
   */
  static isObject(value) {
    return value && typeof value === "object" && !Array.isArray(value);
  }
  /**
   * Check if value is a function
   * 
   * @param value 
   * @returns 
   */
  static isFunction(value) {
    return typeof value === "function";
  }
  static isUndefined(value) {
    return typeof value === "undefined";
  }
  static isRegExp(value) {
    return value instanceof RegExp;
  }
  // ===========================================================================
  // ==========================A-Concept Type Guards ===========================
  // ===========================================================================
  /**
   * Type guard to check if the constructor is of type A_Container
   * 
   * @param ctor 
   * @returns 
   */
  static isContainerConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Container);
  }
  /**
   * Type guard to check if the constructor is of type A_Component
   * 
   * @param ctor 
   * @returns 
   */
  static isComponentConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Component);
  }
  /**
   * Type guard to check if the constructor is of type A_Fragment
   * 
   * @param ctor 
   * @returns 
   */
  static isFragmentConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Fragment);
  }
  /**
   * Type guard to check if the constructor is of type A_Entity
   * 
   * @param ctor 
   * @returns 
   */
  static isEntityConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Entity);
  }
  /**
   * Type guard to check if the constructor is of type A_Scope
   * 
   * @param ctor 
   * @returns 
   */
  static isScopeConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Scope);
  }
  /**
   * Type guard to check if the constructor is of type A_Scope
   * 
   * @param ctor 
   * @returns 
   */
  static isErrorConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Error);
  }
  /**
   * Type guard to check if the constructor is of type A_Feature
   * 
   * @param ctor 
   * @returns 
   */
  static isFeatureConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Feature);
  }
  /**
   * Type guard to check if the constructor is of type A_Caller
   * 
   * @param ctor 
   * @returns 
   */
  static isCallerConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Caller);
  }
  /**
   * Type guard to check if the constructor is of type A_Dependency
   * 
   * @param ctor 
   * @returns 
   */
  static isDependencyConstructor(ctor) {
    return typeof ctor === "function" && A_CommonHelper.isInheritedFrom(ctor, A_Dependency);
  }
  // ----------------------------------------------------------------------------
  // Instance type guards
  // ----------------------------------------------------------------------------
  /**
   * Type guard to check if the instance is of type A_Dependency
   * 
   * @param instance 
   * @returns 
   */
  static isDependencyInstance(instance) {
    return instance instanceof A_Dependency;
  }
  /**
   * Type guard to check if the instance is of type A_Container
   * 
   * @param instance 
   * @returns 
   */
  static isContainerInstance(instance) {
    return instance instanceof A_Container;
  }
  /**
   * Type guard to check if the instance is of type A_Component
   * 
   * @param instance 
   * @returns 
   */
  static isComponentInstance(instance) {
    return instance instanceof A_Component;
  }
  /**
   * Type guard to check if the instance is of type A_Feature
   * 
   * @param instance 
   * @returns 
   */
  static isFeatureInstance(instance) {
    return instance instanceof A_Feature;
  }
  /**
   * Type guard to check if the instance is of type A_Fragment
   * 
   * @param instance 
   * @returns 
   */
  static isFragmentInstance(instance) {
    return instance instanceof A_Fragment;
  }
  /**
   * Type guard to check if the instance is of type A_Entity
   * 
   * @param instance 
   * @returns 
   */
  static isEntityInstance(instance) {
    return instance instanceof A_Entity;
  }
  /**
   * Type guard to check if the instance is of type A_Scope
   * 
   * @param instance 
   * @returns 
   */
  static isScopeInstance(instance) {
    return instance instanceof A_Scope;
  }
  /**
   * Type guard to check if the instance is of type A_Error
   * 
   * @param instance 
   * @returns 
   */
  static isErrorInstance(instance) {
    return instance instanceof A_Error;
  }
  /**
   * Type guard to check if the instance is of type A_ComponentMeta
   * 
   * @param instance 
   * @returns 
   */
  static isComponentMetaInstance(instance) {
    return instance instanceof A_ComponentMeta;
  }
  /**
   * Type guard to check if the instance is of type A_ContainerMeta
   * 
   * @param instance 
   * @returns 
   */
  static isContainerMetaInstance(instance) {
    return instance instanceof A_ContainerMeta;
  }
  /**
   * Type guard to check if the instance is of type A_EntityMeta
   * 
   * @param instance 
   * @returns 
   */
  static isEntityMetaInstance(instance) {
    return instance instanceof A_EntityMeta;
  }
  // ==========================================================================
  // ========================= SPECIAL Type Guards =============================
  // ===========================================================================
  static hasASEID(value) {
    return value && typeof value === "object" && "aseid" && (_A_TypeGuards.isEntityInstance(value) || _A_TypeGuards.isErrorInstance(value));
  }
  static isConstructorAllowedForScopeAllocation(target) {
    return _A_TypeGuards.isContainerConstructor(target) || _A_TypeGuards.isFeatureConstructor(target);
  }
  static isInstanceAllowedForScopeAllocation(target) {
    return _A_TypeGuards.isContainerInstance(target) || _A_TypeGuards.isFeatureInstance(target);
  }
  static isConstructorAvailableForAbstraction(target) {
    return _A_TypeGuards.isContainerInstance(target) || _A_TypeGuards.isComponentInstance(target);
  }
  static isTargetAvailableForInjection(target) {
    return _A_TypeGuards.isComponentConstructor(target) || _A_TypeGuards.isComponentInstance(target) || _A_TypeGuards.isContainerInstance(target) || _A_TypeGuards.isEntityInstance(target);
  }
  static isAllowedForFeatureCall(param) {
    return _A_TypeGuards.isContainerInstance(param) || _A_TypeGuards.isComponentInstance(param) || _A_TypeGuards.isEntityInstance(param);
  }
  static isAllowedForFeatureDefinition(param) {
    return _A_TypeGuards.isContainerInstance(param) || _A_TypeGuards.isComponentInstance(param) || _A_TypeGuards.isEntityInstance(param);
  }
  static isAllowedForFeatureExtension(param) {
    return _A_TypeGuards.isComponentInstance(param) || _A_TypeGuards.isContainerInstance(param) || _A_TypeGuards.isEntityInstance(param);
  }
  static isAllowedForAbstractionDefinition(param) {
    return _A_TypeGuards.isContainerInstance(param) || _A_TypeGuards.isComponentInstance(param);
  }
  static isAllowedForDependencyDefaultCreation(param) {
    return _A_TypeGuards.isFragmentConstructor(param) || A_CommonHelper.isInheritedFrom(param, A_Fragment) || _A_TypeGuards.isEntityConstructor(param) || A_CommonHelper.isInheritedFrom(param, A_Entity);
  }
  /**
   * Allows to check if the provided param is of constructor type.
   * 
   * @param param 
   * @returns 
   */
  static isErrorConstructorType(param) {
    return !!param && _A_TypeGuards.isObject(param) && !(param instanceof Error) && "title" in param;
  }
  static isErrorSerializedType(param) {
    return !!param && _A_TypeGuards.isObject(param) && !(param instanceof Error) && "aseid" in param && ASEID.isASEID(param.aseid);
  }
  static isPromiseInstance(value) {
    return value instanceof Promise;
  }
};

// src/global/A-Feature/A-Feature.error.ts
var A_FeatureError = class extends A_Error {
  fromConstructor(params) {
    super.fromConstructor(params);
    this.stage = params.stage;
  }
};
/**
 * Indicates that the Feature has been interrupted
 */
A_FeatureError.Interruption = "Feature Interrupted";
/**
 * Indicates that there was an error initializing the Feature
 * 
 * Failed during the A-Feature initialization process
 */
A_FeatureError.FeatureInitializationError = "Unable to initialize A-Feature";
/**
 * Indicates that there was an error processing the Feature
 * 
 * Failed during the A-Feature processing
 */
A_FeatureError.FeatureProcessingError = "Error occurred during A-Feature processing";
// =======================================================================
// ---------------------- Decorator Errors -----------------------------
// =======================================================================
/**
 * Indicates that there was an error defining the Feature
 * 
 * Failed during the @A_Feature.Define() decorator execution
 */
A_FeatureError.FeatureDefinitionError = "Unable to define A-Feature";
/**
 * Indicates that there was an error extending the Feature
 * 
 * Failed during the @A_Feature.Extend() decorator execution
 */
A_FeatureError.FeatureExtensionError = "Unable to extend A-Feature";

// src/global/A-Feature/A-Feature-Define.decorator.ts
function A_Feature_Define(config = {}) {
  return function(target, propertyKey, descriptor) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isAllowedForFeatureDefinition(target))
      throw new A_FeatureError(
        A_FeatureError.FeatureDefinitionError,
        `A-Feature cannot be defined on the ${componentName} level`
      );
    const meta = A_Context.meta(target.constructor);
    let metaKey;
    switch (true) {
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-features" /* FEATURES */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-features" /* FEATURES */;
        break;
      case A_TypeGuards.isComponentInstance(target):
        metaKey = "a-component-features" /* FEATURES */;
        break;
    }
    const existedMeta = meta.get(metaKey) || new A_Meta();
    const name = config.name || propertyKey;
    const invoke = config.invoke || false;
    existedMeta.set(propertyKey, {
      name: `${target.constructor.name}.${name}`,
      handler: propertyKey,
      invoke,
      template: config.template && config.template.length ? config.template.map(
        (item) => ({
          ...item,
          before: item.before || "",
          after: item.after || "",
          behavior: item.behavior || "sync",
          throwOnError: true,
          override: item.override || ""
        })
      ) : []
    });
    A_Context.meta(target.constructor).set(
      metaKey,
      existedMeta
    );
    const originalMethod = descriptor.value;
    descriptor.value = function(...args) {
      if (!invoke)
        return originalMethod.apply(this, args);
      else
        originalMethod.apply(this, args);
      if (typeof this.call === "function" && invoke)
        return this.call(name);
    };
    return descriptor;
  };
}

// src/global/A-Feature/A-Feature-Extend.decorator.ts
function A_Feature_Extend(param1) {
  return function(target, propertyKey, descriptor) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isAllowedForFeatureExtension(target))
      throw new A_FeatureError(
        A_FeatureError.FeatureExtensionError,
        `A-Feature-Extend cannot be applied on the ${componentName} level`
      );
    let targetRegexp;
    let behavior = "sync";
    let before = "";
    let after = "";
    let override = "";
    let include = [];
    let exclude = [];
    let throwOnError = true;
    let metaKey;
    switch (true) {
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-extensions" /* EXTENSIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-extensions" /* EXTENSIONS */;
        break;
      case A_TypeGuards.isComponentInstance(target):
        metaKey = "a-component-extensions" /* EXTENSIONS */;
        break;
    }
    switch (true) {
      case A_TypeGuards.isRegExp(param1):
        targetRegexp = param1;
        break;
      case (!!param1 && typeof param1 === "object"):
        if (Array.isArray(param1.scope))
          include = param1.scope;
        else if (!!param1.scope && typeof param1.scope === "object") {
          if (Array.isArray(param1.scope.include))
            include = param1.scope.include;
          if (Array.isArray(param1.scope.exclude))
            exclude = param1.scope.exclude;
        }
        targetRegexp = buildTargetRegexp(param1, include, exclude, propertyKey);
        behavior = param1.behavior || behavior;
        throwOnError = param1.throwOnError !== void 0 ? param1.throwOnError : throwOnError;
        before = A_TypeGuards.isArray(param1.before) ? new RegExp(`^${param1.before.join("|").replace(/\./g, "\\.")}$`).source : param1.before instanceof RegExp ? param1.before.source : "";
        after = A_TypeGuards.isArray(param1.after) ? new RegExp(`^${param1.after.join("|").replace(/\./g, "\\.")}$`).source : param1.after instanceof RegExp ? param1.after.source : "";
        override = A_TypeGuards.isArray(param1.override) ? new RegExp(`^${param1.override.join("|").replace(/\./g, "\\.")}$`).source : param1.override instanceof RegExp ? param1.override.source : "";
        break;
      default:
        targetRegexp = new RegExp(`^.*${propertyKey.replace(/\./g, "\\.")}$`);
        break;
    }
    const existedDefinitions = A_Context.meta(target).get(metaKey);
    const meta = A_Context.meta(target);
    const existedMeta = meta.get(metaKey) ? new A_Meta().from(meta.get(metaKey)) : new A_Meta();
    if (existedDefinitions && existedDefinitions.size() && existedDefinitions.has(propertyKey) && existedDefinitions.get(propertyKey).invoke) {
      throw new A_FeatureError(
        A_FeatureError.FeatureExtensionError,
        `A-Feature-Extend cannot be used on the method "${propertyKey}" because it is already defined as a Feature with "invoke" set to true. Please remove the A-Feature-Extend decorator or set "invoke" to false in the A-Feature decorator.`
      );
    }
    const existedMetaValue = [
      ...existedMeta.get(targetRegexp.source) || []
    ];
    for (const [key, handlers] of existedMeta.entries()) {
      const indexInAnother = handlers.findIndex((item) => item.handler === propertyKey);
      if (key !== targetRegexp.source && indexInAnother !== -1) {
        handlers.splice(indexInAnother, 1);
        if (handlers.length === 0) {
          existedMeta.delete(key);
        } else {
          existedMeta.set(key, handlers);
        }
      }
    }
    const existedIndex = existedMetaValue.findIndex((item) => item.handler === propertyKey);
    const extension = {
      name: targetRegexp.source,
      handler: propertyKey,
      behavior,
      before,
      after,
      throwOnError,
      override
    };
    if (existedIndex !== -1) {
      existedMetaValue[existedIndex] = extension;
    } else {
      existedMetaValue.push(extension);
    }
    existedMeta.set(targetRegexp.source, existedMetaValue);
    A_Context.meta(target).set(metaKey, existedMeta);
  };
}
function buildTargetRegexp(param1, include, exclude, propertyKey) {
  const includePart = include.length ? `(${include.map((el) => el.name).join("|")})` : `.*`;
  const excludePart = exclude.length ? `(?!${exclude.map((el) => el.name).join("|")})` : ``;
  const pattern = param1.scope ? `^${excludePart}${includePart}\\.${param1.name || propertyKey}$` : `.*\\.${param1.name || propertyKey}$`;
  return new RegExp(pattern);
}

// src/global/A-Stage/A-Stage.types.ts
var A_TYPES__A_Stage_Status = /* @__PURE__ */ ((A_TYPES__A_Stage_Status2) => {
  A_TYPES__A_Stage_Status2["PROCESSING"] = "PROCESSING";
  A_TYPES__A_Stage_Status2["COMPLETED"] = "COMPLETED";
  A_TYPES__A_Stage_Status2["FAILED"] = "FAILED";
  A_TYPES__A_Stage_Status2["SKIPPED"] = "SKIPPED";
  A_TYPES__A_Stage_Status2["INITIALIZED"] = "INITIALIZED";
  A_TYPES__A_Stage_Status2["ABORTED"] = "ABORTED";
  return A_TYPES__A_Stage_Status2;
})(A_TYPES__A_Stage_Status || {});

// src/global/A-Stage/A-Stage.error.ts
var A_StageError = class extends A_Error {
  static get CompileError() {
    return "Unable to compile A-Stage";
  }
};
A_StageError.ArgumentsResolutionError = "A-Stage Arguments Resolution Error";

// src/global/A-Stage/A-Stage.class.ts
var A_Stage = class {
  /**
   * A_Stage is a callable A_Function within A_Feature that should be run with specific parameters.
   * [!] Depending on the Stage Definition type sync/async function can be executed correspondingly.
   * 
   * A-Stage is a common object that uses to simplify logic and re-use of A-Feature internals for better composition. 
   */
  constructor(feature, step) {
    /**
     * Indicates the current status of the stage
     */
    this._status = "INITIALIZED" /* INITIALIZED */;
    this._feature = feature;
    this._definition = step;
  }
  /**
   * Returns the name of the stage
   */
  get name() {
    return this.toString();
  }
  /**
   * Returns the definition of the stage
   */
  get definition() {
    return this._definition;
  }
  /**
   * Returns the current status of the stage
   */
  get status() {
    return this._status;
  }
  /**
   * Returns the feature that owns this stage
   */
  get feature() {
    return this._feature;
  }
  /**
   * Returns true if the stage is processed (completed, failed, or skipped)
   */
  get isProcessed() {
    return this._status === "COMPLETED" /* COMPLETED */ || this._status === "FAILED" /* FAILED */ || this._status === "SKIPPED" /* SKIPPED */;
  }
  /**
   * Returns the error of the stage
   */
  get error() {
    return this._error;
  }
  /**
   * Resolves the arguments of the step
   * 
   * @param step 
   * @returns 
   */
  getStepArgs(scope, step) {
    let resolverConstructor = step.dependency.target || scope.resolveConstructor(step.dependency.name);
    return A_Context.meta(resolverConstructor).injections(step.handler).map((dependency) => {
      switch (true) {
        case A_TypeGuards.isCallerConstructor(dependency.target):
          return this._feature.caller.component;
        case A_TypeGuards.isFeatureConstructor(dependency.target):
          return this._feature;
        default: {
          return scope.resolve(dependency);
        }
      }
    });
  }
  /**
   * Resolves the component of the step
   * 
   * @param step 
   * @returns 
   */
  getStepComponent(scope, step) {
    const { dependency, handler } = step;
    let instance = scope.resolve(dependency) || this.feature.scope.resolve(dependency);
    if (!instance)
      throw new A_StageError(
        A_StageError.CompileError,
        `Unable to resolve component ${dependency.name} from scope ${scope.name}`
      );
    if (!instance[handler])
      throw new A_StageError(
        A_StageError.CompileError,
        `Handler ${handler} not found in ${instance.constructor.name}`
      );
    return instance;
  }
  /**
   * Calls the handler of the step
   * 
   * @param step 
   * @returns 
   */
  callStepHandler(step, scope) {
    const component = this.getStepComponent(scope, step);
    const callArgs = this.getStepArgs(scope, step);
    return {
      handler: component[step.handler].bind(component),
      params: callArgs
    };
  }
  skip() {
    this._status = "SKIPPED" /* SKIPPED */;
  }
  /**
   * This method processes the stage by executing all the steps
   * 
   * @param scope - Scope to be used to resolve the steps dependencies
   */
  process(scope) {
    const targetScope = A_TypeGuards.isScopeInstance(scope) ? scope : this._feature.scope;
    if (!this.isProcessed) {
      this._status = "PROCESSING" /* PROCESSING */;
      const { handler, params } = this.callStepHandler(this._definition, targetScope);
      const result = handler(...params);
      if (A_TypeGuards.isPromiseInstance(result)) {
        return new Promise(
          async (resolve, reject) => {
            try {
              await result;
              this.completed();
              return resolve();
            } catch (error) {
              const wrappedError = new A_Error(error);
              this.failed(wrappedError);
              if (this._definition.throwOnError) {
                return resolve();
              } else {
                return reject(wrappedError);
              }
            }
          }
        );
      } else {
        this.completed();
      }
    }
  }
  // ==========================================
  // ============ Status methods =============
  // ==========================================
  completed() {
    this._status = "COMPLETED" /* COMPLETED */;
  }
  failed(error) {
    this._error = new A_Error(error);
    this._status = "FAILED" /* FAILED */;
  }
  // ==========================================
  // ============ Serialization ===============
  // ==========================================
  /**
   * Serializes the stage to JSON
   * 
   */
  toJSON() {
    return {
      name: this.name,
      status: this.status
    };
  }
  /**
   * Returns a string representation of the stage
   * 
   * @returns 
   */
  toString() {
    return `A-Stage(${this._feature.name}::${this._definition.behavior}@${this._definition.handler})`;
  }
};

// src/global/A-StepManager/A-StepManager.error.ts
var A_StepManagerError = class extends A_Error {
};
A_StepManagerError.CircularDependencyError = "A-StepManager Circular Dependency Error";

// src/global/A-StepManager/A-StepManager.class.ts
var A_StepsManager = class {
  constructor(entities) {
    this._isBuilt = false;
    this.entities = this.prepareSteps(entities);
    this.graph = /* @__PURE__ */ new Map();
    this.visited = /* @__PURE__ */ new Set();
    this.tempMark = /* @__PURE__ */ new Set();
    this.sortedEntities = [];
  }
  prepareSteps(entities) {
    return entities.map((step) => ({
      ...step,
      behavior: step.behavior || "sync",
      before: step.before || "",
      after: step.after || "",
      override: step.override || "",
      throwOnError: false
    }));
  }
  ID(step) {
    return `${step.dependency.name}.${step.handler}`;
  }
  buildGraph() {
    if (this._isBuilt) return;
    this._isBuilt = true;
    this.entities = this.entities.filter(
      (step, i, self) => !self.some((s) => s.override ? new RegExp(s.override).test(this.ID(step)) : false)
    );
    this.entities.forEach((entity) => this.graph.set(this.ID(entity), /* @__PURE__ */ new Set()));
    this.entities.forEach((entity) => {
      const entityId = this.ID(entity);
      if (entity.before) {
        const targets = this.matchEntities(entityId, entity.before);
        targets.forEach((target) => {
          if (!this.graph.has(target)) this.graph.set(target, /* @__PURE__ */ new Set());
          this.graph.get(target).add(entityId);
        });
      }
      if (entity.after) {
        const sources = this.matchEntities(entityId, entity.after);
        sources.forEach((source) => {
          if (!this.graph.has(entityId)) this.graph.set(entityId, /* @__PURE__ */ new Set());
          this.graph.get(entityId).add(source);
        });
      }
    });
  }
  // Match entities by name or regex
  matchEntities(entityId, pattern) {
    const regex = new RegExp(pattern);
    return this.entities.filter((entity) => regex.test(this.ID(entity)) && this.ID(entity) !== entityId).map((entity) => this.ID(entity));
  }
  // Topological sort with cycle detection
  visit(node) {
    if (this.tempMark.has(node)) {
      return;
    }
    if (!this.visited.has(node)) {
      this.tempMark.add(node);
      (this.graph.get(node) || []).forEach((neighbor) => this.visit(neighbor));
      this.tempMark.delete(node);
      this.visited.add(node);
      this.sortedEntities.push(node);
    }
  }
  toSortedArray() {
    this.buildGraph();
    this.entities.forEach((entity) => {
      if (!this.visited.has(this.ID(entity))) this.visit(this.ID(entity));
    });
    return this.sortedEntities;
  }
  // Sort the entities based on dependencies
  toStages(feature) {
    const sortedNames = this.toSortedArray();
    return sortedNames.map((id) => {
      const step = this.entities.find((entity) => this.ID(entity) === id);
      return new A_Stage(feature, step);
    });
  }
};

// src/global/A-Feature/A-Feature.class.ts
var A_Feature = class _A_Feature {
  /**
   * A-Feature is a pipeline distributed by multiple components that can be easily attached or detached from the scope. 
   * Feature itself does not have scope, but attached to the caller who dictates how feature should be processed. 
   * 
   * Comparing to A-Command Feature does not store any state except statuses for better analysis. 
   * 
   * [!] Note: If A-Feature should have result use A-Fragment 
   * 
   * @param params 
   */
  constructor(params) {
    /**
     * List of stages that are part of this Feature
     */
    this._stages = [];
    /**
     * Actual Index of the current Stage being processed
     */
    this._index = 0;
    /**
     * The current state of the Feature
     */
    this._state = "INITIALIZED" /* INITIALIZED */;
    this.validateParams(params);
    const initializer = this.getInitializer(params);
    initializer.call(this, params);
  }
  // =============================================================================
  // --------------------------- Static Methods ---------------------------------
  // =============================================================================
  /**
   * Define a new A-Feature
   */
  static get Define() {
    return A_Feature_Define;
  }
  /**
   * Extend an existing A-Feature
   */
  static get Extend() {
    return A_Feature_Extend;
  }
  /**
   * The name of the Feature
   */
  get name() {
    return this._name;
  }
  /**
   * The error that caused the Feature to be interrupted
   */
  get error() {
    return this._error;
  }
  /**
   * The current state of the Feature
   */
  get state() {
    return this._state;
  }
  /**
   * Sets the current state of the Feature
   */
  get index() {
    return this._index;
  }
  /**
   * Returns the current A-Feature Stage
   */
  get stage() {
    return this._current;
  }
  /**
   * The Caller that initiated the Feature call
   */
  get caller() {
    return this._caller;
  }
  /**
   * The Scope allocated for the Feature Execution
   */
  get scope() {
    return A_Context.scope(this);
  }
  /**
   * The number of stages in the feature
   */
  get size() {
    return this._stages.length;
  }
  /**
   * This method checks if the A-Feature is done
   * 
   * @returns 
   */
  get isDone() {
    return !this.stage || this._index >= this._stages.length;
  }
  /**
   * Indicates whether the feature has been processed (completed, failed, or interrupted)
   */
  get isProcessed() {
    return this.state === "COMPLETED" /* COMPLETED */ || this.state === "FAILED" /* FAILED */ || this.state === "INTERRUPTED" /* INTERRUPTED */;
  }
  /**
   * Iterator to iterate over the steps of the feature
   * 
   * @returns 
   */
  [Symbol.iterator]() {
    return {
      next: () => {
        if (!this.isDone) {
          this._current = this._stages[this._index];
          this._index++;
          return {
            value: this._current,
            done: false
          };
        } else {
          this._current = void 0;
          return {
            value: void 0,
            done: true
          };
        }
      }
    };
  }
  // ============================================================================
  // ------------------------ Initialization Methods ----------------------------
  // ============================================================================
  /**
   * Validates the provided parameters for A-Feature initialization
   * 
   * @param params 
   */
  validateParams(params) {
    if (!params || typeof params !== "object") {
      throw new A_FeatureError(
        A_FeatureError.FeatureInitializationError,
        `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`
      );
    }
  }
  /**
   * Returns the appropriate initializer method based on the provided parameters
   * 
   * @param params 
   * @returns 
   */
  getInitializer(params) {
    switch (true) {
      case !("template" in params):
        return this.fromComponent;
      case "template" in params:
        return this.fromTemplate;
      default:
        throw new A_FeatureError(
          A_FeatureError.FeatureInitializationError,
          `Invalid A-Feature initialization parameters of type: ${typeof params} with value: ${JSON.stringify(params).slice(0, 100)}...`
        );
    }
  }
  /**
   * Initializes the A-Feature from the provided template
   * 
   * @param params 
   */
  fromTemplate(params) {
    if (!params.template || !Array.isArray(params.template)) {
      throw new A_FeatureError(
        A_FeatureError.FeatureInitializationError,
        `Invalid A-Feature template provided of type: ${typeof params.template} with value: ${JSON.stringify(params.template).slice(0, 100)}...`
      );
    }
    if (!params.component && (!params.scope || !(params.scope instanceof A_Scope))) {
      throw new A_FeatureError(
        A_FeatureError.FeatureInitializationError,
        `Invalid A-Feature scope provided of type: ${typeof params.scope} with value: ${JSON.stringify(params.scope).slice(0, 100)}...`
      );
    }
    this._name = params.name;
    let componentScope;
    let externalScope = params.scope;
    try {
      if (params.component)
        componentScope = A_Context.scope(params.component);
    } catch (error) {
      if (!externalScope)
        throw error;
    }
    if (componentScope && externalScope && !externalScope.isInheritedFrom(componentScope)) {
      externalScope.inherit(componentScope);
    }
    this._caller = new A_Caller(params.component || new A_Component());
    const scope = A_Context.allocate(this);
    scope.inherit(componentScope || externalScope);
    this._SM = new A_StepsManager(params.template);
    this._stages = this._SM.toStages(this);
    this._current = this._stages[0];
  }
  /**
   * Initializes the A-Feature from the provided component
   * 
   * @param params 
   */
  fromComponent(params) {
    if (!params.component || !A_TypeGuards.isAllowedForFeatureDefinition(params.component)) {
      throw new A_FeatureError(
        A_FeatureError.FeatureInitializationError,
        `Invalid A-Feature component provided of type: ${typeof params.component} with value: ${JSON.stringify(params.component).slice(0, 100)}...`
      );
    }
    this._name = params.name;
    let componentScope;
    let externalScope = params.scope;
    try {
      componentScope = A_Context.scope(params.component);
    } catch (error) {
      if (!externalScope)
        throw error;
    }
    if (componentScope && externalScope && !externalScope.isInheritedFrom(componentScope)) {
      externalScope.inherit(componentScope);
    }
    this._caller = new A_Caller(params.component);
    const scope = A_Context.allocate(this);
    scope.inherit(componentScope || externalScope);
    const template = A_Context.featureTemplate(this._name, this._caller.component, scope);
    this._SM = new A_StepsManager(template);
    this._stages = this._SM.toStages(this);
    this._current = this._stages[0];
  }
  // ============================================================================
  // ----------------------- Main Processing Methods ----------------------------
  // ============================================================================
  /**
   * This method processes the feature by executing all the stages
   * 
   */
  process(scope) {
    try {
      if (this.isProcessed)
        return;
      this._state = "PROCESSING" /* PROCESSING */;
      const stages = Array.from(this);
      return this.processStagesSequentially(stages, scope, 0);
    } catch (error) {
      throw this.failed(new A_FeatureError({
        title: A_FeatureError.FeatureProcessingError,
        description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${this.stage?.name || "N/A"}.`,
        stage: this.stage,
        originalError: error
      }));
    }
  }
  /**
   * Process stages one by one, ensuring each stage completes before starting the next
   */
  processStagesSequentially(stages, scope, index) {
    try {
      if (this.state === "INTERRUPTED" /* INTERRUPTED */) {
        return;
      }
      if (index >= stages.length) {
        this.completed();
        return;
      }
      const stage = stages[index];
      const result = stage.process(scope);
      if (A_TypeGuards.isPromiseInstance(result)) {
        return result.then(() => {
          if (this.state === "INTERRUPTED" /* INTERRUPTED */) {
            return;
          }
          return this.processStagesSequentially(stages, scope, index + 1);
        }).catch((error) => {
          throw this.failed(new A_FeatureError({
            title: A_FeatureError.FeatureProcessingError,
            description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${stage.name}.`,
            stage,
            originalError: error
          }));
        });
      } else {
        return this.processStagesSequentially(stages, scope, index + 1);
      }
    } catch (error) {
      throw this.failed(new A_FeatureError({
        title: A_FeatureError.FeatureProcessingError,
        description: `An error occurred while processing the A-Feature: ${this.name}. Failed at stage: ${this.stage?.name || "N/A"}.`,
        stage: this.stage,
        originalError: error
      }));
    }
  }
  /**
   * This method moves the feature to the next stage
   * 
   * @param stage 
   */
  next(stage) {
    const stageIndex = this._stages.indexOf(stage);
    this._index = stageIndex + 1;
    if (this._index >= this._stages.length) {
      this.completed();
    }
  }
  /**
   * This method marks the feature as completed and returns the result
   * Uses to interrupt or end the feature processing
   * 
   * @param result 
   * @returns 
   */
  completed() {
    if (this.isProcessed) return;
    if (this.state === "INTERRUPTED" /* INTERRUPTED */) {
      return;
    }
    this._state = "COMPLETED" /* COMPLETED */;
    this.scope.destroy();
  }
  /**
   * This method marks the feature as failed and returns the error
   * Uses to mark the feature as failed
   * 
   * @param error 
   * @returns The error that caused the failure
   */
  failed(error) {
    if (this.isProcessed) return this._error;
    this._state = "FAILED" /* FAILED */;
    this._error = error;
    this.scope.destroy();
    return this._error;
  }
  /**
   * This method marks the feature as interrupted and throws an error
   * Uses to interrupt or end the feature processing
   * 
   * @param error 
   */
  interrupt(reason) {
    if (this.isProcessed) return this._error;
    this._state = "INTERRUPTED" /* INTERRUPTED */;
    switch (true) {
      case A_TypeGuards.isString(reason):
        this._error = new A_FeatureError(A_FeatureError.Interruption, reason);
        break;
      case A_TypeGuards.isErrorInstance(reason):
        this._error = new A_FeatureError({
          code: A_FeatureError.Interruption,
          title: reason.title || "Feature Interrupted",
          description: reason.description || reason.message,
          stage: this.stage,
          originalError: reason
        });
        break;
      default:
        this._error = new A_FeatureError(A_FeatureError.Interruption, "Feature was interrupted");
        break;
    }
    this.scope.destroy();
    return this._error;
  }
  chain(param1, param2, param3) {
    let feature;
    let scope;
    if (param1 instanceof _A_Feature) {
      feature = param1;
      scope = param2 instanceof A_Scope ? param2 : void 0;
    } else {
      feature = new _A_Feature({
        name: param2,
        component: param1
      });
      scope = param3 instanceof A_Scope ? param3 : void 0;
    }
    const featureScope = scope || this.scope;
    feature._caller = this._caller;
    const result = feature.process(featureScope);
    if (A_TypeGuards.isPromiseInstance(result)) {
      return result.catch((error) => {
        throw error;
      });
    }
    return result;
  }
  toString() {
    return `A-Feature(${this.caller.component?.constructor?.name || "Unknown"}::${this.name})`;
  }
};

// src/global/A-Component/A-Component.class.ts
var A_Component = class {
  /**
   * Calls the feature with the given name in the given scope
   * 
   * [!] Note: This method creates a new instance of the feature every time it is called
   * 
   * @param feature - the name of the feature to call
   * @param scope  - the scope in which to call the feature
   * @returns  - void
   */
  call(feature, scope) {
    const newFeature = new A_Feature({
      name: feature,
      component: this
    });
    return newFeature.process(scope);
  }
};

// src/global/A-Context/A-Context.error.ts
var A_ContextError = class extends A_Error {
};
A_ContextError.NotAllowedForScopeAllocationError = "Component is not allowed for scope allocation";
A_ContextError.ComponentAlreadyHasScopeAllocatedError = "Component already has scope allocated";
A_ContextError.InvalidMetaParameterError = "Invalid parameter provided to get meta";
A_ContextError.InvalidScopeParameterError = "Invalid parameter provided to get scope";
A_ContextError.ScopeNotFoundError = "Scope not found";
A_ContextError.InvalidFeatureParameterError = "Invalid parameter provided to get feature";
A_ContextError.InvalidFeatureDefinitionParameterError = "Invalid parameter provided to define feature";
A_ContextError.InvalidFeatureTemplateParameterError = "Invalid parameter provided to get feature template";
A_ContextError.InvalidFeatureExtensionParameterError = "Invalid parameter provided to extend feature";
A_ContextError.InvalidAbstractionParameterError = "Invalid parameter provided to get abstraction";
A_ContextError.InvalidAbstractionDefinitionParameterError = "Invalid parameter provided to define abstraction";
A_ContextError.InvalidAbstractionTemplateParameterError = "Invalid parameter provided to get abstraction template";
A_ContextError.InvalidAbstractionExtensionParameterError = "Invalid parameter provided to extend abstraction";
A_ContextError.InvalidInjectionParameterError = "Invalid parameter provided to get injections";
A_ContextError.InvalidExtensionParameterError = "Invalid parameter provided to get extensions";
A_ContextError.InvalidRegisterParameterError = "Invalid parameter provided to register component";
A_ContextError.InvalidComponentParameterError = "Invalid component provided";
A_ContextError.ComponentNotRegisteredError = "Component not registered in the context";
A_ContextError.InvalidDeregisterParameterError = "Invalid parameter provided to deregister component";

// src/global/A-Context/A-Context.class.ts
var A_Context = class _A_Context {
  /**
   * Private constructor to enforce singleton pattern.
   * 
   * [!] This class should not be instantiated directly. Use A_Context.getInstance() instead.
   */
  constructor() {
    /**
     * A registry that keeps track of scopes for all components (Containers, Features, Commands) 
     * Which can issue a scope allocation.
     */
    this._registry = /* @__PURE__ */ new WeakMap();
    /**
     * This is a registry that stores an issuer of each scope allocation.
     * It helps to track which component (Container, Feature, Command) allocated a specific scope.
     */
    this._scopeIssuers = /* @__PURE__ */ new WeakMap();
    /**
     * Stores a context associated with a specific component that depends on a scope.
     * uses for quick retrieval of the scope for the component.
     */
    this._scopeStorage = /* @__PURE__ */ new WeakMap();
    /**
     * Stores meta information for different component types by their constructors.
     * Meta provides to store extra information about the class behavior and configuration.
     */
    this._metaStorage = /* @__PURE__ */ new Map();
    this._globals = /* @__PURE__ */ new Map();
    const name = String(A_CONCEPT_ENV.A_CONCEPT_ROOT_SCOPE) || "root";
    this._root = new A_Scope({ name });
  }
  // ====================================================================================================
  // ================================ STATIC PROPERTIES =================================================
  // ====================================================================================================
  /**
   * Default name of the application from environment variable A_CONCEPT_NAME
   * 
   * [!] If environment variable is not set, it will default to 'a-concept'
   */
  static get concept() {
    return A_CONCEPT_ENV.A_CONCEPT_NAME || "a-concept";
  }
  /**
   * Root scope of the application from environment variable A_CONCEPT_ROOT_SCOPE
   * 
   * [!] If environment variable is not set, it will default to 'root'
   */
  static get root() {
    return this.getInstance()._root;
  }
  /**
   * Environment the application is running in.
   * Can be either 'server' or 'browser'.
   * [!] Determined by environment variable A_CONCEPT_RUNTIME_ENVIRONMENT that comes from the build tool or is set manually in the environment.
   */
  static get environment() {
    return A_CONCEPT_ENV.A_CONCEPT_RUNTIME_ENVIRONMENT;
  }
  /**
   * Get the instance of the Namespace Provider.
   * 
   * If the instance does not exist, it will be created.
   * 
   * @returns 
   */
  static getInstance() {
    if (!_A_Context._instance) {
      _A_Context._instance = new _A_Context();
    }
    return _A_Context._instance;
  }
  /**
   * Register method allows to register a component with a specific scope in the context.
   * 
   * @param component - Component to register with a specific scope. Can be either A_Container, A_Feature.
   * @param scope - Scope to associate the component with.
   * @returns 
   */
  static register(scope, component) {
    const componentName = A_CommonHelper.getComponentName(component);
    const instance = this.getInstance();
    if (!component) throw new A_ContextError(
      A_ContextError.InvalidRegisterParameterError,
      `Unable to register component. Component cannot be null or undefined.`
    );
    if (!scope) throw new A_ContextError(
      A_ContextError.InvalidRegisterParameterError,
      `Unable to register component. Scope cannot be null or undefined.`
    );
    if (!this.isAllowedToBeRegistered(component)) throw new A_ContextError(
      A_ContextError.NotAllowedForScopeAllocationError,
      `Component ${componentName} is not allowed for scope allocation.`
    );
    instance._scopeStorage.set(component, scope);
    return scope;
  }
  /**
   * Deregister method allows to deregister a component from the context.
   * 
   * @param component - Component to deregister from the context.
   */
  static deregister(component) {
    const componentName = A_CommonHelper.getComponentName(component);
    const instance = this.getInstance();
    if (!component) throw new A_ContextError(
      A_ContextError.InvalidDeregisterParameterError,
      `Unable to deregister component. Component cannot be null or undefined.`
    );
    if (!instance._scopeStorage.has(component)) throw new A_ContextError(
      A_ContextError.ComponentNotRegisteredError,
      `Unable to deregister component. Component ${componentName} is not registered.`
    );
    instance._scopeStorage.delete(component);
  }
  static allocate(component, importing) {
    const componentName = A_CommonHelper.getComponentName(component);
    if (!this.isAllowedForScopeAllocation(component))
      throw new A_ContextError(A_ContextError.NotAllowedForScopeAllocationError, `Component of type ${componentName} is not allowed for scope allocation. Only A_Container, A_Feature are allowed.`);
    const instance = this.getInstance();
    if (instance._registry.has(component))
      throw new A_ContextError(A_ContextError.ComponentAlreadyHasScopeAllocatedError, `Component ${componentName} already has a scope allocated.`);
    const newScope = A_TypeGuards.isScopeInstance(importing) ? importing : new A_Scope(importing || {
      name: componentName + "-scope"
    }, importing);
    if (!newScope.isInheritedFrom(_A_Context.root))
      newScope.inherit(_A_Context.root);
    instance._registry.set(component, newScope);
    instance._scopeIssuers.set(newScope, component);
    return newScope;
  }
  static deallocate(param1) {
    const instance = this.getInstance();
    const scope = A_TypeGuards.isScopeInstance(param1) ? param1 : instance._registry.get(param1);
    if (!scope) return;
    const component = A_TypeGuards.isComponentInstance(param1) ? param1 : this.issuer(scope);
    if (component)
      instance._registry.delete(component);
    if (scope)
      instance._scopeIssuers.delete(scope);
  }
  static meta(param1) {
    const componentName = A_CommonHelper.getComponentName(param1);
    const instance = this.getInstance();
    if (!param1) throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Parameter cannot be null or undefined.`);
    if (!(this.isAllowedForMeta(param1) || this.isAllowedForMetaConstructor(param1) || A_TypeGuards.isString(param1) || A_TypeGuards.isFunction(
      param1
    ))) throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component of type ${componentName} is not allowed for meta storage. Only A_Container, A_Component and A_Entity are allowed.`);
    let property;
    let metaType;
    switch (true) {
      // 1) If param1 is instance of A_Container
      case A_TypeGuards.isContainerInstance(param1): {
        property = param1.constructor;
        metaType = A_ContainerMeta;
        break;
      }
      // 2) If param1 is class of A_Container
      case A_TypeGuards.isContainerConstructor(param1): {
        property = param1;
        metaType = A_ContainerMeta;
        break;
      }
      // 3) If param1 is instance of A_Component
      case A_TypeGuards.isComponentInstance(param1): {
        property = param1.constructor;
        metaType = A_ComponentMeta;
        break;
      }
      // 4) If param1 is class of A_Component
      case A_TypeGuards.isComponentConstructor(param1): {
        property = param1;
        metaType = A_ComponentMeta;
        break;
      }
      // 5) If param1 is instance of A_Entity
      case A_TypeGuards.isEntityInstance(param1): {
        property = param1.constructor;
        metaType = A_ComponentMeta;
        break;
      }
      // 6) If param1 is class of A_Entity
      case A_TypeGuards.isEntityConstructor(param1): {
        property = param1;
        metaType = A_EntityMeta;
        break;
      }
      // 7) If param1 is instance of A_Fragment
      case A_TypeGuards.isFragmentInstance(param1): {
        property = param1.constructor;
        metaType = A_ComponentMeta;
        break;
      }
      // 8) If param1 is class of A_Fragment
      case A_TypeGuards.isFragmentConstructor(param1): {
        property = param1;
        metaType = A_EntityMeta;
        break;
      }
      // 9) If param1 is string then we need to find the component by its name
      case typeof param1 === "string": {
        const found = Array.from(instance._metaStorage).find(
          ([c]) => c.name === param1 || c.name === A_FormatterHelper.toKebabCase(param1) || c.name === A_FormatterHelper.toPascalCase(param1)
        );
        if (!(found && found.length))
          throw new A_ContextError(A_ContextError.InvalidMetaParameterError, `Invalid parameter provided to get meta. Component with name ${param1} not found in the meta storage.`);
        property = found[0];
        metaType = A_ComponentMeta;
        break;
      }
      // 10) If param1 is any other class or function
      default: {
        property = param1;
        metaType = A_Meta;
        break;
      }
    }
    if (!instance._metaStorage.has(property)) {
      let inheritedMeta = void 0;
      let currentProperty = property;
      while (!inheritedMeta) {
        const parent = Object.getPrototypeOf(currentProperty);
        if (!parent) {
          break;
        }
        inheritedMeta = instance._metaStorage.get(parent);
        currentProperty = parent;
      }
      if (!inheritedMeta)
        inheritedMeta = new metaType();
      instance._metaStorage.set(property, new metaType().from(inheritedMeta));
    }
    return instance._metaStorage.get(property);
  }
  static setMeta(param1, meta) {
    const instance = _A_Context.getInstance();
    const existingMeta = _A_Context.meta(param1);
    const constructor = typeof param1 === "function" ? param1 : param1.constructor;
    instance._metaStorage.set(constructor, existingMeta ? meta.from(existingMeta) : meta);
  }
  /**
   * 
   * This method allows to get the issuer of a specific scope.
   * 
   * @param scope - Scope to get the issuer for.
   * @returns - Component that issued the scope.
   */
  static issuer(scope) {
    const instance = this.getInstance();
    if (!scope) throw new A_ContextError(
      A_ContextError.InvalidComponentParameterError,
      `Invalid parameter provided to get scope issuer. Parameter cannot be null or undefined.`
    );
    return instance._scopeIssuers.get(scope);
  }
  static scope(param1) {
    const name = param1?.constructor?.name || String(param1);
    const instance = this.getInstance();
    if (!param1) throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Parameter cannot be null or undefined.`);
    if (!this.isAllowedForScopeAllocation(param1) && !this.isAllowedToBeRegistered(param1))
      throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed for scope allocation.`);
    switch (true) {
      case this.isAllowedForScopeAllocation(param1):
        if (!instance._registry.has(param1))
          throw new A_ContextError(
            A_ContextError.ScopeNotFoundError,
            `Invalid parameter provided to get scope. Component of type ${name} does not have a scope allocated. Make sure to allocate a scope using A_Context.allocate() method before trying to get the scope.`
          );
        return instance._registry.get(param1);
      case this.isAllowedToBeRegistered(param1):
        if (!instance._scopeStorage.has(param1))
          throw new A_ContextError(
            A_ContextError.ScopeNotFoundError,
            `Invalid parameter provided to get scope. Component of type ${name} does not have a scope registered. Make sure to register the component using A_Context.register() method before trying to get the scope.`
          );
        return instance._scopeStorage.get(param1);
      default:
        throw new A_ContextError(A_ContextError.InvalidScopeParameterError, `Invalid parameter provided to get scope. Component of type ${name} is not allowed to be registered.`);
    }
  }
  // ==========================================================================================================
  // ================================== FEATURE MANAGEMENT ====================================================
  // ==========================================================================================================
  // ----------------------------------------------------------------------------------------------------------
  // -----------------------------------Primary Methods -------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------
  /**
   * Returns a template of the feature that can be then used to create a new A-Feature Instance
   * 
   * [!] Note: Steps/Stages included are fully dependent on the scope provided since it dictates which components are active and can provide extensions for the feature.
   * 
   * @param name 
   */
  static featureTemplate(name, component, scope = this.scope(component)) {
    const componentName = A_CommonHelper.getComponentName(component);
    if (!component) throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
    if (!name) throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
    if (!A_TypeGuards.isAllowedForFeatureDefinition(component))
      throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
    const steps = [
      // 1) Get the base feature definition from the component
      ...this.featureDefinition(name, component),
      // 2) Get all extensions for the feature from other components in the scope
      ...this.featureExtensions(name, component, scope)
    ];
    return steps;
  }
  // ----------------------------------------------------------------------------------------------------------
  // -----------------------------------Helper Methods --------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------
  /**
   * Returns all extensions for the specific feature in the specific component within the provided scope.
   * Scope dictates which components are active and can provide extensions for the feature.
   * 
   * [!] This method only returns extensions, not the base feature definition.
   * 
   * @param scope 
   * @returns 
   */
  static featureExtensions(name, component, scope) {
    const instance = this.getInstance();
    const componentName = A_CommonHelper.getComponentName(component);
    if (!component) throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
    if (!name) throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
    if (!A_TypeGuards.isAllowedForFeatureDefinition(component))
      throw new A_ContextError(A_ContextError.InvalidFeatureExtensionParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
    const callNames = A_CommonHelper.getClassInheritanceChain(component).filter((c) => c !== A_Component && c !== A_Container && c !== A_Entity).map((c) => `${c.name}.${name}`);
    const steps = /* @__PURE__ */ new Map();
    const allowedComponents = /* @__PURE__ */ new Set();
    for (const callName of callNames) {
      for (const [cmp, meta] of instance._metaStorage) {
        if (scope.has(cmp) && (A_TypeGuards.isComponentMetaInstance(meta) || A_TypeGuards.isContainerMetaInstance(meta))) {
          allowedComponents.add(cmp);
          meta.extensions(callName).forEach((declaration) => {
            const inherited = Array.from(allowedComponents).reverse().find((c) => A_CommonHelper.isInheritedFrom(cmp, c) && c !== cmp);
            if (inherited) {
              steps.delete(`${A_CommonHelper.getComponentName(inherited)}.${declaration.handler}`);
            }
            steps.set(`${A_CommonHelper.getComponentName(cmp)}.${declaration.handler}`, {
              dependency: new A_Dependency(cmp),
              ...declaration
            });
          });
        }
      }
    }
    return instance.filterToMostDerived(scope, Array.from(steps.values()));
  }
  /**
   * method helps to filter steps in a way that only the most derived classes are kept.
   * 
   * @param scope 
   * @param items 
   * @returns 
   */
  filterToMostDerived(scope, items) {
    return items.filter((item) => {
      const currentClass = scope.resolveConstructor(item.dependency.name);
      const isParentOfAnother = items.some((other) => {
        if (other === item) return false;
        const otherClass = scope.resolveConstructor(other.dependency.name);
        if (!currentClass || !otherClass) return false;
        return currentClass.prototype.isPrototypeOf(otherClass.prototype);
      });
      return !isParentOfAnother;
    });
  }
  /**
   * This method returns the feature template definition without any extensions.
   * It can be used to retrieve the base template for a feature before any modifications are applied.
   * 
   * [!] This method does not consider extensions from other components.
   * 
   * @param feature 
   * @param component 
   * @returns 
   */
  static featureDefinition(feature, component) {
    let metaKey;
    if (!feature)
      throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Feature name cannot be null or undefined.`);
    if (!component)
      throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `Unable to get feature template. Component cannot be null or undefined.`);
    switch (true) {
      case component instanceof A_Entity:
        metaKey = "a-component-features" /* FEATURES */;
        break;
      case component instanceof A_Container:
        metaKey = "a-container-features" /* FEATURES */;
        break;
      case component instanceof A_Component:
        metaKey = "a-component-features" /* FEATURES */;
        break;
      default:
        throw new A_ContextError(A_ContextError.InvalidFeatureTemplateParameterError, `A-Feature cannot be defined on the ${component} level`);
    }
    const featureDefinition = this.meta(component)?.get(metaKey)?.get(feature);
    return [
      ...featureDefinition?.template || []
    ];
  }
  // ==========================================================================================================
  // ================================== ABSTRACTION MANAGEMENT =================================================
  // ==========================================================================================================
  // ----------------------------------------------------------------------------------------------------------
  // -----------------------------------Primary Methods -------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------
  /**
   * Returns a definition of the abstraction that can be then used to create a new A-Feature Instance
   * 
   * [!] Note: Steps/Stages included are fully dependent on the scope provided since it dictates which components are active and can provide extensions for the abstraction.
   * 
   * @param abstraction 
   */
  static abstractionTemplate(abstraction, component) {
    const componentName = A_CommonHelper.getComponentName(component);
    if (!component) throw new A_ContextError(
      A_ContextError.InvalidAbstractionTemplateParameterError,
      `Unable to get feature template. Component cannot be null or undefined.`
    );
    if (!abstraction) throw new A_ContextError(
      A_ContextError.InvalidAbstractionTemplateParameterError,
      `Unable to get feature template. Abstraction stage cannot be null or undefined.`
    );
    if (!A_TypeGuards.isAllowedForAbstractionDefinition(component))
      throw new A_ContextError(A_ContextError.InvalidAbstractionTemplateParameterError, `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`);
    const steps = [
      // 1) Get the base abstraction definition from the component
      // [!] No abstraction Definitions -> They are limited to Concept Abstractions ONLY
      // ...this.abstractionDefinition(abstraction, component),
      // 2) Get all extensions for the abstraction from other components in the scope
      ...this.abstractionExtensions(abstraction, component)
    ];
    return steps;
  }
  // ----------------------------------------------------------------------------------------------------------
  // -----------------------------------Helper Methods --------------------------------------------------------
  // ----------------------------------------------------------------------------------------------------------
  static abstractionExtensions(abstraction, component) {
    const instance = this.getInstance();
    const componentName = A_CommonHelper.getComponentName(component);
    if (!component) throw new A_ContextError(
      A_ContextError.InvalidAbstractionExtensionParameterError,
      `Unable to get feature template. Component cannot be null or undefined.`
    );
    if (!abstraction) throw new A_ContextError(
      A_ContextError.InvalidAbstractionExtensionParameterError,
      `Unable to get feature template. Abstraction stage cannot be null or undefined.`
    );
    if (!A_TypeGuards.isAllowedForAbstractionDefinition(component))
      throw new A_ContextError(
        A_ContextError.InvalidAbstractionExtensionParameterError,
        `Unable to get feature template. Component of type ${componentName} is not allowed for feature definition.`
      );
    const steps = /* @__PURE__ */ new Map();
    const scope = this.scope(component);
    const allowedComponents = /* @__PURE__ */ new Set();
    for (const [cmp, meta] of instance._metaStorage) {
      if (scope.has(cmp) && (A_TypeGuards.isComponentMetaInstance(meta) || A_TypeGuards.isContainerMetaInstance(meta))) {
        allowedComponents.add(cmp);
        meta.abstractions(abstraction).forEach((declaration) => {
          const inherited = Array.from(allowedComponents).reverse().find((c) => A_CommonHelper.isInheritedFrom(cmp, c) && c !== cmp);
          if (inherited) {
            steps.delete(`${A_CommonHelper.getComponentName(inherited)}.${declaration.handler}`);
          }
          steps.set(`${A_CommonHelper.getComponentName(cmp)}.${declaration.handler}`, {
            dependency: new A_Dependency(cmp),
            ...declaration
          });
        });
      }
    }
    return instance.filterToMostDerived(scope, Array.from(steps.values()));
  }
  /**
   * Resets the Context to its initial state.
   */
  static reset() {
    const instance = _A_Context.getInstance();
    instance._registry = /* @__PURE__ */ new WeakMap();
    const name = String(A_CONCEPT_ENV.A_CONCEPT_ROOT_SCOPE) || "root";
    instance._root = new A_Scope({ name });
  }
  // ====================================================================================================================
  // ====================================== HELPERS & GUARDS ============================================================
  // ====================================================================================================================
  /**
   * Type guard to check if the param is allowed for scope allocation.
   * 
   * @param param 
   * @returns 
   */
  static isAllowedForScopeAllocation(param) {
    return A_TypeGuards.isContainerInstance(param) || A_TypeGuards.isFeatureInstance(param);
  }
  /**
   * Type guard to check if the param is allowed to be registered in the context.
   * 
   * @param param 
   * @returns 
   */
  static isAllowedToBeRegistered(param) {
    return A_TypeGuards.isEntityInstance(param) || A_TypeGuards.isComponentInstance(param) || A_TypeGuards.isFragmentInstance(param) || A_TypeGuards.isErrorInstance(param);
  }
  /**
   * Type guard to check if the param is allowed for meta storage.
   * 
   * @param param 
   * @returns 
   */
  static isAllowedForMeta(param) {
    return A_TypeGuards.isContainerInstance(param) || A_TypeGuards.isComponentInstance(param) || A_TypeGuards.isEntityInstance(param);
  }
  /**
   * Type guard to check if the param is allowed for meta storage by constructor.
   * 
   * @param param 
   * @returns 
   */
  static isAllowedForMetaConstructor(param) {
    return A_TypeGuards.isContainerConstructor(param) || A_TypeGuards.isComponentConstructor(param) || A_TypeGuards.isEntityConstructor(param);
  }
};

// src/global/A-Abstraction/A-Abstraction.error.ts
var A_AbstractionError = class extends A_Error {
};
/**
 * This error code indicates that there was an issue extending the abstraction execution
 */
A_AbstractionError.AbstractionExtensionError = "Unable to extend abstraction execution";

// src/global/A-Abstraction/A-Abstraction-Extend.decorator.ts
function A_Abstraction_Extend(name, config = {}) {
  return function(target, propertyKey, descriptor) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!name)
      throw new A_AbstractionError(
        A_AbstractionError.AbstractionExtensionError,
        `Abstraction name must be provided to extend abstraction for '${componentName}'.`
      );
    if (!A_TypeGuards.isConstructorAvailableForAbstraction(target)) {
      throw new A_AbstractionError(
        A_AbstractionError.AbstractionExtensionError,
        `Unable to extend Abstraction '${name}' for '${componentName}'. Only A-Containers and A-Components can extend Abstractions.`
      );
    }
    let metaKey;
    const meta = A_Context.meta(target);
    switch (true) {
      case (A_TypeGuards.isContainerConstructor(target) || A_TypeGuards.isContainerInstance(target)):
        metaKey = "a-container-abstractions" /* ABSTRACTIONS */;
        break;
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-abstractions" /* ABSTRACTIONS */;
        break;
    }
    const setName = `CONCEPT_ABSTRACTION::${name}`;
    const existedMeta = meta.get(metaKey) ? new A_Meta().from(meta.get(metaKey)) : new A_Meta();
    const existedMetaValue = [
      ...existedMeta.get(setName) || []
    ];
    const existedIndex = existedMetaValue.findIndex((item) => item.handler === propertyKey);
    const abstraction = {
      name: setName,
      handler: propertyKey,
      behavior: config.behavior || "sync",
      throwOnError: config.throwOnError !== void 0 ? config.throwOnError : true,
      before: A_TypeGuards.isArray(config.before) ? new RegExp(`^${config.before.join("|").replace(/\./g, "\\.")}$`).source : config.before instanceof RegExp ? config.before.source : "",
      after: A_TypeGuards.isArray(config.after) ? new RegExp(`^${config.after.join("|").replace(/\./g, "\\.")}$`).source : config.after instanceof RegExp ? config.after.source : "",
      override: A_TypeGuards.isArray(config.override) ? new RegExp(`^${config.override.join("|").replace(/\./g, "\\.")}$`).source : config.after instanceof RegExp ? config.after.source : ""
    };
    if (existedIndex !== -1) {
      existedMetaValue[existedIndex] = abstraction;
    } else {
      existedMetaValue.push(abstraction);
    }
    existedMeta.set(setName, existedMetaValue);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

// src/global/A-Abstraction/A-Abstraction.class.ts
var A_Abstraction = class {
  /**
   * A-Abstraction is an object that is common for any application. 
   * By providing components and creating abstraction extensions it's possible to create a unique behavior of the whole solution.
   * 
   * Every application has basic abstractions like 'start', 'stop', 'deploy', 'test', etc. 
   * They can be easily extended with additional logic from both containers and components.
   * 
   * 
   * @param params 
   */
  constructor(params) {
    /**
     * List of features that are part of this Abstraction
     */
    this._features = [];
    /**
     * Actual Index of the current Feature being processed
     */
    this._index = 0;
    this._name = params.name;
    this._features = params.containers.map((container) => {
      const template = A_Context.abstractionTemplate(
        this._name,
        container
      );
      return new A_Feature({
        name: this._name,
        component: container,
        template
      });
    });
    this._current = this._features[0];
  }
  /**
   * Allows to extends A-Abstraction with additional methods
   */
  static get Extend() {
    return A_Abstraction_Extend;
  }
  /**
   * Returns the name of the Abstraction
   */
  get name() {
    return this._name;
  }
  /**
   * Returns the current Feature being processed
   */
  get feature() {
    return this._current;
  }
  /**
   * This method checks if the A-Feature is done
   * 
   * @returns 
   */
  get isDone() {
    return !this.feature || this._index >= this._features.length;
  }
  [Symbol.iterator]() {
    return {
      // Custom next method
      next: () => {
        if (!this.isDone) {
          this._current = this._features[this._index];
          return {
            value: this._current,
            done: false
          };
        } else {
          this._current = void 0;
          return {
            value: void 0,
            done: true
          };
        }
      }
    };
  }
  /**
   * This method moves the Abstraction processing to the next Feature in the list
   * 
   * @param stage 
   */
  next(stage) {
    if (this._index >= this._features.length) {
      return;
    }
    const stageIndex = this._features.indexOf(stage);
    this._index = stageIndex + 1;
  }
  /**
   * Allows to process all stages of the Abstraction
   * 
   * @returns 
   */
  async process(scope) {
    if (this.isDone)
      return;
    for (const feature of this._features) {
      await feature.process(scope);
    }
  }
};

// src/global/A-Concept/A-Concept.constants.ts
var A_TYPES__ConceptAbstractions = /* @__PURE__ */ ((A_TYPES__ConceptAbstractions2) => {
  A_TYPES__ConceptAbstractions2["Run"] = "run";
  A_TYPES__ConceptAbstractions2["Build"] = "build";
  A_TYPES__ConceptAbstractions2["Publish"] = "publish";
  A_TYPES__ConceptAbstractions2["Deploy"] = "deploy";
  A_TYPES__ConceptAbstractions2["Load"] = "load";
  A_TYPES__ConceptAbstractions2["Start"] = "start";
  A_TYPES__ConceptAbstractions2["Stop"] = "stop";
  return A_TYPES__ConceptAbstractions2;
})(A_TYPES__ConceptAbstractions || {});
var A_TYPES__ConceptMetaKey = /* @__PURE__ */ ((A_TYPES__ConceptMetaKey2) => {
  A_TYPES__ConceptMetaKey2["LIFECYCLE"] = "a-component-extensions";
  return A_TYPES__ConceptMetaKey2;
})(A_TYPES__ConceptMetaKey || {});

// src/global/A-Concept/A-Concept.class.ts
var A_Concept = class {
  // ==============================================================================
  // ==========================  MAIN Methods  ======================================
  // ==============================================================================
  /**
   * A-Concept is a placeholder for the concept of the any program.
   * 
   * Concept - could be any Program regardless environment and it's goal.
   * It could be mobile, web or simple html page.
   * All depends on Containers and Components installed and provided in the Concept.
   * 
   * 
   * [!] Concept operates ONLY with all Components and Containers provided to achieve the goal.
   * 
   * 
   * @param props - Initialization properties for the Concept
   */
  constructor(props) {
    this.props = props;
    this._name = props.name || A_Context.root.name;
    if (props.components && props.components.length)
      props.components.forEach((component) => this.scope.register(component));
    if (props.fragments && props.fragments.length)
      props.fragments.forEach((fragment) => this.scope.register(fragment));
    if (props.entities && props.entities.length)
      props.entities.forEach((entity) => this.scope.register(entity));
    this._containers = props.containers || [];
  }
  // ==============================================================================
  // ====================  STATIC LIFECYCLE DECORATORS  ===========================
  // ==============================================================================
  /**
   * Load the concept. This step runs before any other steps to ensure that all components are loaded.
   */
  static Load(config) {
    return A_Abstraction.Extend("load" /* Load */, config);
  }
  /**
   * Publish the concept to ADAAS platform. (Or any other place defined in the concept)
   *
   * [!] To extend the logic just create a custom containers and override the default behavior.
   */
  static Publish(config) {
    return A_Abstraction.Extend("publish" /* Publish */);
  }
  /**
   * Deploy the concept to the environment.
   */
  static Deploy(config) {
    return A_Abstraction.Extend("deploy" /* Deploy */, config);
  }
  /**
   * Compiles the Concept in case there are some containers that require that. 
   * 
   * Can be used for static websites or any other concept that requires a build step.
   * 
   */
  static Build(config) {
    return A_Abstraction.Extend("build" /* Build */, config);
  }
  /**
   *  Main execution of the concept.
   */
  static Run(config) {
    return A_Abstraction.Extend("run" /* Run */, config);
  }
  /**
   *  Start the concept. Uses for servers or any other background services.
   */
  static Start(config) {
    return A_Abstraction.Extend("start" /* Start */, config);
  }
  /**
   * Stop the concept. Uses for servers or any other background services.
   */
  static Stop(config) {
    return A_Abstraction.Extend("stop" /* Stop */, config);
  }
  /**
   * Name of the concept
   */
  get name() {
    return A_Context.root.name;
  }
  /**
   * The primary Root scope of the concept.
   */
  get scope() {
    return A_Context.root;
  }
  /**
   * Register a class or value in the concept scope.
   */
  get register() {
    return this.scope.register.bind(this.scope);
  }
  /**
   * Resolve a class or value from the concept scope.
   */
  get resolve() {
    return this.scope.resolve.bind(this.scope);
  }
  // =======================================================================
  // ==========================  LIFECYCLE  ================================
  // =======================================================================
  /**
   * Load the concept.
   */
  async load(scope) {
    const abstraction = new A_Abstraction({
      name: "load" /* Load */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Run the concept.
   */
  async run(scope) {
    const abstraction = new A_Abstraction({
      name: "run" /* Run */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Start the concept.
   * 
   * @param params 
   */
  async start(scope) {
    const abstraction = new A_Abstraction({
      name: "start" /* Start */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Stop the concept.
   * 
   * @param params 
   */
  async stop(scope) {
    const abstraction = new A_Abstraction({
      name: "stop" /* Stop */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Build the concept.
   */
  async build(scope) {
    const abstraction = new A_Abstraction({
      name: "build" /* Build */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Deploy the concept.
   */
  async deploy(scope) {
    const abstraction = new A_Abstraction({
      name: "deploy" /* Deploy */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  /**
   * Publish the concept.
   */
  async publish(scope) {
    const abstraction = new A_Abstraction({
      name: "publish" /* Publish */,
      containers: this._containers
    });
    await abstraction.process(scope);
  }
  // =======================================================================
  // ==========================  CALL  =====================================
  // =======================================================================
  /**
   * Call the specific method of the concept or included modules.
   */
  async call(method, container) {
    const feature = new A_Feature({ name: method, component: container });
    return await feature.process();
  }
};

// src/global/A-Concept/A-Concept.meta.ts
var A_ConceptMeta = class extends A_Meta {
  constructor(containers) {
    super();
    this.containers = containers;
  }
};

// src/global/A-Inject/A-Inject.error.ts
var A_InjectError = class extends A_Error {
};
A_InjectError.InvalidInjectionTarget = "Invalid target for A-Inject decorator";
A_InjectError.MissingInjectionTarget = "Missing target for A-Inject decorator";

// src/global/A-Inject/A-Inject.decorator.ts
function A_Inject(param1, param2) {
  if (!param1) {
    throw new A_InjectError(
      A_InjectError.MissingInjectionTarget,
      `A-Inject decorator is missing the target to inject`
    );
  }
  return function(target, methodName, parameterIndex) {
    const componentName = A_CommonHelper.getComponentName(target);
    if (!A_TypeGuards.isTargetAvailableForInjection(target)) {
      throw new A_InjectError(
        A_InjectError.InvalidInjectionTarget,
        `A-Inject cannot be used on the target of type ${typeof target} (${componentName})`
      );
    }
    const method = methodName ? String(methodName) : "constructor";
    let metaKey;
    switch (true) {
      case (A_TypeGuards.isComponentConstructor(target) || A_TypeGuards.isComponentInstance(target)):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isContainerInstance(target):
        metaKey = "a-container-injections" /* INJECTIONS */;
        break;
      case A_TypeGuards.isEntityInstance(target):
        metaKey = "a-component-injections" /* INJECTIONS */;
        break;
    }
    const existedMeta = A_Context.meta(target).get(metaKey) || new A_Meta();
    const paramsArray = existedMeta.get(method) || [];
    paramsArray[parameterIndex] = param1 instanceof A_Dependency ? param1 : new A_Dependency(param1, param2);
    existedMeta.set(method, paramsArray);
    A_Context.meta(target).set(
      metaKey,
      existedMeta
    );
  };
}

exports.ASEID = ASEID;
exports.ASEID_Error = ASEID_Error;
exports.A_Abstraction = A_Abstraction;
exports.A_AbstractionError = A_AbstractionError;
exports.A_Abstraction_Extend = A_Abstraction_Extend;
exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES = A_CONSTANTS__DEFAULT_ENV_VARIABLES;
exports.A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY;
exports.A_CONSTANTS__ERROR_CODES = A_CONSTANTS__ERROR_CODES;
exports.A_CONSTANTS__ERROR_DESCRIPTION = A_CONSTANTS__ERROR_DESCRIPTION;
exports.A_Caller = A_Caller;
exports.A_CallerError = A_CallerError;
exports.A_CommonHelper = A_CommonHelper;
exports.A_Component = A_Component;
exports.A_ComponentMeta = A_ComponentMeta;
exports.A_Concept = A_Concept;
exports.A_ConceptMeta = A_ConceptMeta;
exports.A_Container = A_Container;
exports.A_ContainerMeta = A_ContainerMeta;
exports.A_Context = A_Context;
exports.A_ContextError = A_ContextError;
exports.A_Dependency = A_Dependency;
exports.A_DependencyError = A_DependencyError;
exports.A_Dependency_Default = A_Dependency_Default;
exports.A_Dependency_Load = A_Dependency_Load;
exports.A_Dependency_Require = A_Dependency_Require;
exports.A_Entity = A_Entity;
exports.A_EntityError = A_EntityError;
exports.A_EntityMeta = A_EntityMeta;
exports.A_Error = A_Error;
exports.A_Feature = A_Feature;
exports.A_FeatureError = A_FeatureError;
exports.A_Feature_Define = A_Feature_Define;
exports.A_Feature_Extend = A_Feature_Extend;
exports.A_FormatterHelper = A_FormatterHelper;
exports.A_Fragment = A_Fragment;
exports.A_IdentityHelper = A_IdentityHelper;
exports.A_Inject = A_Inject;
exports.A_InjectError = A_InjectError;
exports.A_Meta = A_Meta;
exports.A_MetaDecorator = A_MetaDecorator;
exports.A_Scope = A_Scope;
exports.A_ScopeError = A_ScopeError;
exports.A_Stage = A_Stage;
exports.A_StageError = A_StageError;
exports.A_StepManagerError = A_StepManagerError;
exports.A_StepsManager = A_StepsManager;
exports.A_TYPES__A_Stage_Status = A_TYPES__A_Stage_Status;
exports.A_TYPES__ComponentMetaKey = A_TYPES__ComponentMetaKey;
exports.A_TYPES__ConceptAbstractions = A_TYPES__ConceptAbstractions;
exports.A_TYPES__ConceptMetaKey = A_TYPES__ConceptMetaKey;
exports.A_TYPES__ContainerMetaKey = A_TYPES__ContainerMetaKey;
exports.A_TYPES__EntityFeatures = A_TYPES__EntityFeatures;
exports.A_TYPES__EntityMetaKey = A_TYPES__EntityMetaKey;
exports.A_TYPES__FeatureState = A_TYPES__FeatureState;
exports.A_TypeGuards = A_TypeGuards;
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map