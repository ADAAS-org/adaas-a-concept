import { A_CommonHelper } from "@adaas/a-utils";
import { ConfigReader } from "./ConfigReader.component";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY } from "@adaas/a-concept/constants/env.constants";


export class ENVConfigReader extends ConfigReader {


    /**
     * Get the configuration property Name 
     * @param property 
     */
    getConfigurationProperty_ENV_Alias(property: string): string {
        if (A_CONSTANTS__DEFAULT_ENV_VARIABLES_ARRAY.some(p => p === property))
            return A_CommonHelper.toUpperSnakeCase(property);

        return `${A_CommonHelper.toUpperSnakeCase(A_Context.root.name)}_${A_CommonHelper.toUpperSnakeCase(property)}`;
    }


    resolve<_ReturnType = any>(property: string): _ReturnType {
        return process.env[this.getConfigurationProperty_ENV_Alias(property)] as _ReturnType;
    }


    async read<T extends string>(variables: Array<T> = []): Promise<Record<T, any>> {
        const config: Record<T, any> = {} as Record<T, any>;

        variables.forEach(variable => {
            config[variable] = this.resolve(variable);
        });

        return config;
    }
} 