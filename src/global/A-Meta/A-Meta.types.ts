import { A_TYPES__Ctor } from "@adaas/a-concept/types/A_Common.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_TYPES__Component_Constructor } from "../A-Component/A-Component.types";
import { A_Container } from "../A-Container/A-Container.class";
import { A_TYPES__Container_Constructor } from "../A-Container/A-Container.types";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_TYPES__Entity_Constructor } from "../A-Entity/A-Entity.types";
import { A_Fragment } from "../A-Fragment/A-Fragment.class";
import { A_TYPES__Fragment_Constructor } from "../A-Fragment/A-Fragment.types";
import { A_Meta } from "./A-Meta.class";


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Meta constructor type
 */
export type A_TYPES__Meta_Constructor<T = A_Meta> = A_TYPES__Ctor<T>;
/**
 * Components that can have Meta associated with them
 */
export type A_TYPES__MetaLinkedComponents = A_Container
    | A_Component
    | A_Entity
    | A_Fragment
/**
 * Constructors of components that can have Meta associated with them
 */
export type A_TYPES__MetaLinkedComponentConstructors = new (...args: any[]) => any
    | A_TYPES__Container_Constructor
    | A_TYPES__Component_Constructor
    | A_TYPES__Entity_Constructor
    | A_TYPES__Fragment_Constructor

