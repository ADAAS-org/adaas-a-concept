import { A_Module } from "../global/A_Module.class";
export type A_DependencyManagerConstructorDependency = {
    /**
     * The name of the dependency
     */
    behavior: 'sync' | 'async';
    /**
     * The source of the dependency
     * Could be:
     * - a string representing the path to the module
     * - a module class
     * - a module class constructor
     */
    source: string | A_Module | typeof A_Module;
};
