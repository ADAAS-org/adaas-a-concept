import { A_Scope } from "../../../global/A-Scope/A-Scope.class";
/**
 * Config Reader
 */
export declare class ConfigReader {
    protected scope: A_Scope;
    constructor(scope: A_Scope);
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
