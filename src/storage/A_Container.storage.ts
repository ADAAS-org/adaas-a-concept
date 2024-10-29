// =================================================================================================
// ========== Container Storage ====================================================================
// =================================================================================================

import { A_Container } from "../global/A-Container/A-Container.class";

// -------------------------------------------------------------------------------
// ----- A Concept -> Container Declaration -> Symbol Declaration Keys --------------- 
// -------------------------------------------------------------------------------
export const A_CONTAINER_STORAGE__Definition__Lifecycle = Symbol('a-container-lifecycle');
export const A_CONTAINER_STORAGE__Definition__Feature = Symbol('a-container-feature');



/**
 * This storage is used to store the containers metadata, definitions and configurations
 * 
 */
export const A_CONTAINER_Storage: WeakMap<typeof A_Container.constructor, Map<Symbol | string, any>> = new WeakMap();


