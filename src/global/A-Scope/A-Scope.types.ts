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
    components: Array<{ new(...args: any[]): any }>


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