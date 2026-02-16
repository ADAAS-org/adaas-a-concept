import { A_TYPES__Ctor } from "@adaas/a-concept/types";
import {
    A_Component,
    A_TYPES__Component_Constructor
} from "@adaas/a-concept/a-component";
import {
    A_Container,
    A_TYPES__Container_Constructor
} from "@adaas/a-concept/a-container";
import {
    A_Entity,
    A_TYPES__Entity_Constructor
} from "@adaas/a-concept/a-entity";
import {
    A_Fragment,
    A_TYPES__Fragment_Constructor
} from "@adaas/a-concept/a-fragment";
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
export type A_TYPES__MetaLinkedComponentConstructors = A_TYPES__Ctor<any>
    | A_TYPES__Container_Constructor
    | A_TYPES__Component_Constructor
    | A_TYPES__Entity_Constructor
    | A_TYPES__Fragment_Constructor

