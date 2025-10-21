export const A_CONSTANTS__DEFAULT_ENV_VARIABLES = {
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
    A_CONCEPT_NAME: 'A_CONCEPT_NAME',
    /**
     * Root scope of the application
     * 
     * DEFAULT value is 'root'
     * 
     * [!] Provided name will be used for all aseids in the application by default
     */
    A_CONCEPT_ROOT_SCOPE: 'A_CONCEPT_ROOT_SCOPE',
    /**
     * Environment of the application e.g. development, production, staging
     */
    A_CONCEPT_ENVIRONMENT: 'A_CONCEPT_ENVIRONMENT',
    /**
     * Root folder of the application
     * [!] Automatically set by A-Concept when the application starts
     */
    A_CONCEPT_ROOT_FOLDER: 'A_CONCEPT_ROOT_FOLDER',
    /**
     * Allows to define a default error description for errors thrown without a description
     */
    A_ERROR_DEFAULT_DESCRIPTION: 'A_ERROR_DEFAULT_DESCRIPTION',
} as const


//should be an array
export type A_TYPES__ConceptENVVariables = (typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES)[keyof typeof A_CONSTANTS__DEFAULT_ENV_VARIABLES][];


export const A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY = [
    A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME,
    A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE,
    A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ENVIRONMENT,
    A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_FOLDER,

    A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_ERROR_DEFAULT_DESCRIPTION,
] as const;

