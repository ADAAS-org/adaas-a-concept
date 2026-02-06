import { A_CONSTANTS__DEFAULT_ENV_VARIABLES, A_TYPES__ConceptENVVariables } from "../constants/env.constants";
import type { RuntimeEnv } from "./env.base";


type EnvVariablesType = {
    [key in keyof typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES]?: string;
}

declare global {
    interface Window {
        __A_CONCEPT_ENVIRONMENT_ENV__?: {
            [key: string]: string
        } & EnvVariablesType
    }
}