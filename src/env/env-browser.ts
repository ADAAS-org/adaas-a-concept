import { A_TYPES__ContextEnvironment } from "@adaas/a-concept/a-context";
import { A_CONCEPT_BASE_ENV } from "./env.base";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "../constants/env.constants";


export class A_CONCEPT_ENV extends A_CONCEPT_BASE_ENV {
    static get A_CONCEPT_ENVIRONMENT() {
        return window.__A_CONCEPT_ENVIRONMENT_ENV__?.A_CONCEPT_ENVIRONMENT || super.A_CONCEPT_ENVIRONMENT;
    }
    static get A_CONCEPT_RUNTIME_ENVIRONMENT(): A_TYPES__ContextEnvironment {
        return 'browser';
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
    static get(name: string) {
        return window.__A_CONCEPT_ENVIRONMENT_ENV__?.[name] || (this as typeof A_CONCEPT_ENV)[name as keyof typeof A_CONCEPT_ENV];
    }
    static set(name: string, value: string) {
        if (!window.__A_CONCEPT_ENVIRONMENT_ENV__) {
            window.__A_CONCEPT_ENVIRONMENT_ENV__ = {};
        }
        window.__A_CONCEPT_ENVIRONMENT_ENV__[name] = value;
    }

    static getAll<T extends Record<string, string>>(): T {
        const allEnv: Record<string, string> = {};

        // Get all environment variables from the window object
        if (window.__A_CONCEPT_ENVIRONMENT_ENV__) {
            Object.keys(window.__A_CONCEPT_ENVIRONMENT_ENV__).forEach(key => {
                allEnv[key] = window.__A_CONCEPT_ENVIRONMENT_ENV__![key];
            });
        }

        // Get all default environment variables from the class
        A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.forEach(variable => {
            allEnv[variable] = this.get(variable) as string;
        });

        return allEnv as T;
    }

    static getAllKeys<T extends Array<string>>(): T {
        const keys = new Set<string>();

        // Get all keys from the window object
        if (window.__A_CONCEPT_ENVIRONMENT_ENV__) {
            Object.keys(window.__A_CONCEPT_ENVIRONMENT_ENV__).forEach(key => {
                keys.add(key);
            });
        }

        // Get all default environment variable keys from the class
        A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.forEach(variable => {
            keys.add(variable);
        });

        return Array.from(keys) as T;
    }
};
