declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES: {
    /**
     * Name of the application
     *
     * DEFAULT value is 'a-concept'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_NAME: "A_CONCEPT_NAME";
    /**
     * Root scope of the application
     *
     * DEFAULT value is 'root'
     *
     * [!] Provided name will be used for all aseids in the application by default
     */
    readonly A_CONCEPT_ROOT_SCOPE: "A_CONCEPT_ROOT_SCOPE";
    /**
     * Environment of the application e.g. development, production, staging
     */
    readonly A_CONCEPT_ENVIRONMENT: "A_CONCEPT_ENVIRONMENT";
    /**
     * Runtime environment of the application e.g. browser, node
     */
    readonly A_CONCEPT_RUNTIME_ENVIRONMENT: "A_CONCEPT_RUNTIME_ENVIRONMENT";
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    readonly A_CONCEPT_ROOT_FOLDER: "A_CONCEPT_ROOT_FOLDER";
    /**
     * Allows to define a default error description for errors thrown without a description
     */
    readonly A_ERROR_DEFAULT_DESCRIPTION: "A_ERROR_DEFAULT_DESCRIPTION";
};
type A_TYPES__ConceptENVVariables = (typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES][];
declare const A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY: readonly ["A_CONCEPT_NAME", "A_CONCEPT_ROOT_SCOPE", "A_CONCEPT_ENVIRONMENT", "A_CONCEPT_RUNTIME_ENVIRONMENT", "A_CONCEPT_ROOT_FOLDER", "A_ERROR_DEFAULT_DESCRIPTION"];

export { A_CONSTANTS__DEFAULT_ENV_VARIABLES as A, type A_TYPES__ConceptENVVariables as a, A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY as b };
