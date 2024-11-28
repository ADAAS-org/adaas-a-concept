import { A_Component } from "../A-Component/A-Component.class"
import { A_Entity } from "../A-Entity/A-Entity.class"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Scope } from "./A-Scope.class"


export type A_TYPES__ScopeConstructor = {

    /**
     * Scope Name
     */
    name: string,
    /**
     * A list of Context Fragments available in the Scope
     */
    fragments: Array<A_Fragment>
    /**
     * A set of Components available in the Scope
     */
    components: Array<{ new(...args: any[]): A_Component }>

    /**
     * A set of Entities available in the Scope
     *  
     */
    entities: Array<A_Entity>

    /**
     * A list of Features/Lifecycle Hooks available in the Scope
     */
    import: Array<string>,
    /**
     * A list of Features/Lifecycle Hooks available to be exported from the Scope
     */
    export: Array<string>
}


export type A_TYPES__ScopeConfig = {
    /**
     * Allows to define a parent to take dependencies from in case of the current scope does not have the required component
     */
    parent: A_Scope
}