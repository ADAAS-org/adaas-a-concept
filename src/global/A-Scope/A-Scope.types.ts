import { A_Command } from "../A-Command/A-Command.class"
import { A_Component } from "../A-Component/A-Component.class"
import { A_Entity } from "../A-Entity/A-Entity.class"
import { A_Fragment } from "../A-Fragment/A-Fragment.class"
import { A_Scope } from "./A-Scope.class"


export type A_TYPES__AllowedComponentsConstructor<T = A_Component> = new (...args: any[]) => T;
export type A_TYPES__AllowedEntitiesConstructor<T = A_Entity> = new (...args: any[]) => T;
export type A_TYPES__AllowedFragmentsConstructor<T = A_Fragment> = new (...args: any[]) => T;
export type A_TYPES__AllowedCommandsConstructor<T = A_Command> = new (...args: any[]) => T;
export type A_TYPES__AllowedScopesConstructor<T = A_Scope> = new (...args: any[]) => T;
export type A_TYPES__AllowedConstructors<T extends A_Component | A_Fragment | A_Entity | A_Command | A_Scope = any> =
    | A_TYPES__AllowedComponentsConstructor<T>
    | A_TYPES__AllowedFragmentsConstructor<T>
    | A_TYPES__AllowedEntitiesConstructor<T>
    | A_TYPES__AllowedCommandsConstructor<T>
    | A_TYPES__AllowedScopesConstructor<T>;


export type A_TYPES__ScopeConstructor<
    _ComponentType extends A_TYPES__AllowedComponentsConstructor[] = A_TYPES__AllowedComponentsConstructor[],
    _CommandType extends A_TYPES__AllowedCommandsConstructor[] = A_TYPES__AllowedCommandsConstructor[],
    _EntityType extends A_Entity[] = A_Entity[],
    _FragmentType extends A_Fragment[] = A_Fragment[],
> = {
    /**
     * Scope Name
     */
    name: string,
    /**
     * A list of Context Fragments available in the Scope
     */
    fragments: [..._FragmentType];
    /**
     * A set of Components available in the Scope
     */
    components: [..._ComponentType],
    /**
     * A set of Entities available in the Scope
     *  
     */
    entities: [..._EntityType];
    /**
     * A set of Commands available in the Scope
     */
    commands: [..._CommandType],
}


export type A_TYPES__ScopeConfig = {
    /**
     * Allows to define a parent to take dependencies from in case of the current scope does not have the required component
     */
    parent: A_Scope
}