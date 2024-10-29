import { A_Container } from "../global/A-Container/A-Container.class";
export declare const A_CONTAINER_STORAGE__Definition__Lifecycle: unique symbol;
export declare const A_CONTAINER_STORAGE__Definition__Feature: unique symbol;
/**
 * This storage is used to store the containers metadata, definitions and configurations
 *
 */
export declare const A_CONTAINER_Storage: WeakMap<typeof A_Container.constructor, Map<Symbol | string, any>>;
