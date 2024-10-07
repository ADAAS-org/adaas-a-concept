import { A_Component } from "../../../global/A-Component/A-Component.class";
import { A_Config } from "../A-Config.namespace";
/**
 * Config Reader
 */
export declare class ConfigReader extends A_Component<A_Config> {
    /**
     * Get the configuration property by Name
     * @param property
     */
    resolve<_ReturnType = any>(property: string): _ReturnType;
    /**
     * This method reads the configuration and sets the values to the context
     *
     * @returns
     */
    read<T extends string>(variables?: Array<T>): Promise<Record<T, any>>;
}
