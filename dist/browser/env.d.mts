import { a as A_TYPES__ContextEnvironment } from './A-Context.types-BtR_HJ0j.mjs';

declare class A_CONCEPT_BASE_ENV {
    /**
     * Name of the application
     *
     * DEFAULT value is 'a-concept'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    static get A_CONCEPT_NAME(): string;
    /**
     * Root scope of the application
     *
     * DEFAULT value is 'root'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    static get A_CONCEPT_ROOT_SCOPE(): string;
    /**
     * Environment of the application e.g. development, production, staging
     */
    static get A_CONCEPT_ENVIRONMENT(): string;
    /**
     * Runtime environment of the application e.g. browser, node
     */
    static get A_CONCEPT_RUNTIME_ENVIRONMENT(): A_TYPES__ContextEnvironment;
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    static get A_CONCEPT_ROOT_FOLDER(): string;
    /**
     * Allows to define a default error description for errors thrown without a description
     */
    static get A_ERROR_DEFAULT_DESCRIPTION(): string;
    /**
     * Generic getter for environment variables. This allows to access environment variables dynamically by name. It will return undefined if the variable does not exist.
     *
     * @param name
     * @returns
     */
    static get(name: string): any;
    /**
     * Generic setter for environment variables. This allows to set environment variables dynamically by name.
     *
     * @param name
     * @param value
     */
    static set(name: string, value: string): void;
}

declare class A_CONCEPT_ENV extends A_CONCEPT_BASE_ENV {
    static get A_CONCEPT_ENVIRONMENT(): string;
    static get A_CONCEPT_RUNTIME_ENVIRONMENT(): A_TYPES__ContextEnvironment;
    static get A_CONCEPT_NAME(): string;
    static get A_CONCEPT_ROOT_FOLDER(): string;
    static get A_CONCEPT_ROOT_SCOPE(): string;
    static get A_ERROR_DEFAULT_DESCRIPTION(): string;
    static get(name: string): A_CONCEPT_ENV;
    static set(name: string, value: string): void;
}

export { A_CONCEPT_ENV };
