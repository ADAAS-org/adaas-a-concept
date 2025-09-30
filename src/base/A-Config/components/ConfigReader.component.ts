import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Config } from "../A-Config.context";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "@adaas/a-concept/constants/env.constants";

/**
 * Config Reader
 */
export class ConfigReader extends A_Component {

    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope
    ) {
        super();
    }


    @A_Concept.Load()
    async inject(
        @A_Inject(A_Config) config: A_Config,
    ) {

        const data = await this.read([
            ...config.CONFIG_PROPERTIES,
            ...A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY
        ]);

        config.set(data);

        const rootDir = await this.getProjectRoot();

        config.set('A_CONCEPT_ROOT_FOLDER', rootDir);
    }


    /**
     * Get the configuration property by Name
     * @param property 
     */
    resolve<_ReturnType = any>(property: string): _ReturnType {
        return property as _ReturnType;
    }

    /**
     * This method reads the configuration and sets the values to the context
     * 
     * @returns 
     */
    async read<T extends string>(
        variables: Array<T> = []
    ): Promise<Record<T, any>> {
        return {} as Record<T, any>;
    }


    /**
     * Finds the root directory of the project by locating the folder containing package.json
     * 
     * @param {string} startPath - The initial directory to start searching from (default is __dirname)
     * @returns {string|null} - The path to the root directory or null if package.json is not found
     */
    protected async getProjectRoot(startPath = __dirname) {
        return process.cwd();
    }
}