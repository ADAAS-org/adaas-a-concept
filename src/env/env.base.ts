import { A_TYPES__ContextEnvironment } from "@adaas/a-concept/a-context";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "../constants/env.constants";

export class A_CONCEPT_BASE_ENV {
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
  static get A_CONCEPT_RUNTIME_ENVIRONMENT(): A_TYPES__ContextEnvironment {
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
  static get(name: string) {
    return (this as any)[name];
  }
  /**
   * Generic setter for environment variables. This allows to set environment variables dynamically by name.
   * 
   * @param name 
   * @param value 
   */
  static set(name: string, value: string) {
    (this as any)[name] = value;
  }

  /**
   * This method returns all the environment variables that are available in the application. It combines the variables from process.env and the default environment variables defined in A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.
   * 
   * @returns 
   */
  static getAll<T extends Record<string, any>>(): T {
    return {} as T;
  }

  /**
   * This method returns all the keys of the environment variables that are available in the application. It combines the keys from process.env and the default environment variables defined in A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.
   * 
   * @returns 
   */
  static getAllKeys<T extends Array<string>>(): T {
    return [] as any as T;
  }

} 
