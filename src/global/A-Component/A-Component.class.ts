import { A_Context } from "../A-Context/A-Context.class";
import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_Scope } from "../A-Scope/A-Scope.class";



/**
 * A-Component is a primary "extendable" object in the system
 * A unique combination of Components creates completely new functionality
 * 
 * The most important thing is that A-Component is STATELESS, it means that it doesn't store any state in itself
 * 
 * 
 * [!] Every A-Component is a singleton, so if you need to create multiple instances of the same logic - use A-Container
 * [!] So one scope can have only one instance of the same A-Component
 * [!] Every A-Component can be extended by features and extensions
 * [!] ONLY A-Component can have A-Feature extensions
 *
 */
export class A_Component {


    /**
     * Calls the feature with the given name in the given scope
     * 
     * [!] Note: This method creates a new instance of the feature every time it is called
     * 
     * @param feature - the name of the feature to call
     * @param scope  - the scope in which to call the feature
     * @returns  - void
     */
    call(
        /**
         * Name of the feature to call
         */
        feature: string,
        /**
         * Scope in which the feature will be executed
         */
        scope?: A_Scope
    ): Promise<any> | void {
        const newFeature = new A_Feature({
            name: feature,
            component: this
        });

        return newFeature.process(scope);
    }
}



