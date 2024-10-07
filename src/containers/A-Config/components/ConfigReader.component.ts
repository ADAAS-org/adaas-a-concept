import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Config } from "../A-Config.namespace";



/**
 * Config Reader
 */
export class ConfigReader extends A_Component<A_Config> {


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
}