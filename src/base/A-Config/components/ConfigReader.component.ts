import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";



/**
 * Config Reader
 */
export class ConfigReader extends A_Component {

    constructor(
        @A_Inject(A_Scope) protected scope: A_Scope
    ) {
        super();
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
}