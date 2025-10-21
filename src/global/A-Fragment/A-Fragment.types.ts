// ============================================================================
// --------------------------- Primary Types ----------------------------------
// ============================================================================

import { A_Fragment } from "./A-Fragment.class";

/**
 * Fragment constructor type
 * Uses the generic type T to specify the type of the fragment
 */
export type A_TYPES__Fragment_Constructor<T = A_Fragment> = new (...args: any[]) => T;
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
     * The ASEID of the fragment
     */
    aseid: string
};


