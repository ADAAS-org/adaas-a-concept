import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_TYPES__ContextEnvironment } from "@adaas/a-concept/a-context";
import { A_CONCEPT_BASE_ENV } from "./env.base";

export class A_CONCEPT_ENV extends A_CONCEPT_BASE_ENV {
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
        return process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] || super.A_CONCEPT_NAME
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
    static get A_CONCEPT_RUNTIME_ENVIRONMENT(): A_TYPES__ContextEnvironment {
        return 'server';
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

    static get(name: string) {
        return process.env[name] || (this as A_CONCEPT_ENV)[name as keyof typeof A_CONCEPT_ENV];
    }

    static set(name: string, value: string): void {
        process.env[name] = value;
    }
} 
