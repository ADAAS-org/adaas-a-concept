import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Polyfills } from "@adaas/a-utils";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Config } from "../A-Config.context";



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
        @A_Inject(A_Config) config: A_Config
    ) {
        const data = this.read(config.CONFIG_PROPERTIES);

        config.set(data);

        const rootDir = await this.getProjectRoot();

        config.set('CONCEPT_ROOT_FOLDER', rootDir);
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
        // let currentPath = startPath;

        // const fs = await A_Polyfills.fs();

        // while (!fs.existsSync(`${currentPath}/package.json`)) {
        //     const parentPath = currentPath.substring(0, currentPath.lastIndexOf('/'));
        //     if (parentPath === currentPath || parentPath === '') {
        //         // Reached the root of the filesystem without finding package.json
        //         return null;
        //     }
        //     currentPath = parentPath;
        // }

        return process.cwd();
    }
}