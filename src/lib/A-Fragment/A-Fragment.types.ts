// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================

import { A_TYPES__Ctor } from "@adaas/a-concept/types";
import { A_Fragment } from "./A-Fragment.class";

/**
 * Fragment constructor type
 * Uses the generic type T to specify the type of the fragment
 */
export type A_TYPES__Fragment_Constructor<T = A_Fragment> = A_TYPES__Ctor<T>;
/**
 * Fragment initialization type
 */
export type A_TYPES__Fragment_Init = {
    name: string
};
/**
 * Fragment serialized type
 */
export type A_TYPES__Fragment_Serialized = {
    /**
     * The Name of the fragment
     */
    name: string
};


