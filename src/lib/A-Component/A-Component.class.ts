import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Context } from "../A-Context";



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
     * [!] Fast path: when the feature resolves to ZERO steps (i.e. nothing
     *     `@A_Feature.Define`s or `@A_Feature.Extend`s it in the current scope),
     *     there is nothing to execute, so we skip processing entirely. This makes
     *     "fire-and-forget" feature calls that nobody is subscribed to effectively
     *     free, which matters on hot paths (e.g. per-log/per-node lifecycle hooks).
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
        if(!A_Context.hasFeature(feature, this, scope)) {
            return;
        }

        const newFeature = new A_Feature({
            name: feature,
            component: this
        });

        return newFeature.process(scope);
    }
}



