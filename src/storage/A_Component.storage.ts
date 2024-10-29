// =================================================================================================
// ========== Component Storage ====================================================================
// =================================================================================================

import { A_Component } from "../global/A-Component/A-Component.class";


// -------------------------------------------------------------------------------
// ----- A Concept -> Component Declaration -> Symbol Declaration Keys --------------- 
// -------------------------------------------------------------------------------
export const A_COMPONENT_STORAGE__Definition__Extensions = Symbol('a-container-extensions');
export const A_COMPONENT_STORAGE__Definition__Feature = Symbol('a-container-feature');



/**
 * 
 * This storage is used to store the containers metadata, definitions and configurations
 */
export const A_COMPONENT_Storage: Map<
    typeof A_Component | { new(...args: any[]): any },
    Map<
        Symbol | string,
        any
    >
> = new Map();


