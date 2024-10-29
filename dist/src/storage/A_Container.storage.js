"use strict";
// =================================================================================================
// ========== Container Storage ====================================================================
// =================================================================================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.A_CONTAINER_Storage = exports.A_CONTAINER_STORAGE__Definition__Feature = exports.A_CONTAINER_STORAGE__Definition__Lifecycle = void 0;
// -------------------------------------------------------------------------------
// ----- A Concept -> Container Declaration -> Symbol Declaration Keys --------------- 
// -------------------------------------------------------------------------------
exports.A_CONTAINER_STORAGE__Definition__Lifecycle = Symbol('a-container-lifecycle');
exports.A_CONTAINER_STORAGE__Definition__Feature = Symbol('a-container-feature');
/**
 * This storage is used to store the containers metadata, definitions and configurations
 *
 */
exports.A_CONTAINER_Storage = new WeakMap();
//# sourceMappingURL=A_Container.storage.js.map