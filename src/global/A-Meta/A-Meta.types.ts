import { A_Component } from "../A-Component/A-Component.class";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";


/**
 * Components that can have Meta associated with them
 */
export type A_TYPES__MetaLinkedComponents = A_Container
    | A_Component
    | A_Entity
/**
 * Constructors of components that can have Meta associated with them
 */
export type A_TYPES__MetaLinkedComponentConstructors = A_TYPES__Container_Constructor
    | A_TYPES__Component_Constructor
    | A_TYPES__Entity_Constructor

