export declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES: {
    /**
     * Namespace of the application
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_NAMESPACE: "A_CONCEPT_NAMESPACE";
    /**
     * Default scope of the application
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_DEFAULT_SCOPE: "A_CONCEPT_DEFAULT_SCOPE";
    /**
     * Environment of the application e.g. development, production, staging
     */
    readonly A_CONCEPT_ENVIRONMENT: "A_CONCEPT_ENVIRONMENT";
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    readonly A_CONCEPT_ROOT_FOLDER: "A_CONCEPT_ROOT_FOLDER";
    readonly CONFIG_SDK_VALIDATION: "CONFIG_SDK_VALIDATION";
    readonly CONFIG_VERBOSE: "CONFIG_VERBOSE";
    readonly CONFIG_IGNORE_ERRORS: "CONFIG_IGNORE_ERRORS";
};
export type A_TYPES__ConceptENVVariables = (typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES];
export declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_NAMESPACE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "CONFIG_VERBOSE", "CONFIG_IGNORE_ERRORS"];
