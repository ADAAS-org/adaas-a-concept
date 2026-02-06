import type { RuntimeEnv } from "./env.base";

declare global {
    interface Window {
        __A_CONCEPT_ENVIRONMENT_ENV__?: Partial<RuntimeEnv> & {
        };
    }
}