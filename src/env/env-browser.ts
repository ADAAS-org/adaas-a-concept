import { A_TYPES__ContextEnvironment } from "../global/A-Context/A-Context.types";
import { A_CONCEPT_BASE_ENV } from "./env.base";


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
};
