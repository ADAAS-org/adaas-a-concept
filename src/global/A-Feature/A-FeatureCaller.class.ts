import { A_Command } from "../A-Command/A-Command.class";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Feature } from "./A-Feature.class";



/**
 * This is a common class that uses to return an entity that initiates a feature call
 * 
 * It can be used then in @A_Inject(A_FeatureCaller) to get the entity that initiated the feature call
 * 
 * [!] the class itself may be retrieved, but may require additional processing inside the feature
 * 
 */
export class A_FeatureCaller {


    protected _component: A_Component | A_Feature | A_Container | A_Command;

    constructor(
        component: A_Component | A_Feature | A_Container | A_Command
    ) {
        this._component = component;
    }


    /**
     * Resolves the component that initiated the feature call
     * 
     * @returns 
     */
    resolve(): A_Component | A_Feature | A_Container | A_Command {
        return this._component;
    }


}