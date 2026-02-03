import { A_TYPES__Ctor } from "@adaas/a-concept/types/A_Common.types";
import { A_Component } from "../A-Component/A-Component.class";
import { A_Container } from "../A-Container/A-Container.class";
import { A_Entity } from "../A-Entity/A-Entity.class";
import { A_Caller } from "./A_Caller.class";


export type A_TYPES__CallerComponent = A_Container | A_Component | A_Entity;


// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================
/**
 * Caller constructor type
 * Uses the generic type T to specify the type of the caller component
 */
export type A_TYPES__Caller_Constructor<T = A_Caller> = A_TYPES__Ctor<T>;
/**
 * Caller initialization type
 */
export type A_TYPES__Caller_Init = {};
/**
 * Caller serialized type
 */
export type A_TYPES__Caller_Serialized = {};