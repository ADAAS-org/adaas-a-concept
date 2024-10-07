import { A_TYPES__A_DependencyDecoratorConfig } from "../decorators/A-Dependency/A-Dependency.decorator.types";
import { A_Concept } from "../global/A-Concept/A_Concept.class";
import { A_Context } from "../global/A-Namespace/A_Namespace.class";
import { A_TYPES__IContext } from "../global/A-Namespace/A_Namespace.types";
import { A_Module } from "../global/A_Module.class";
export declare class A_DependencyManager {
    private dependencies;
    protected Concept: A_Concept;
    ready: Promise<void>;
    constructor(concept: A_Concept, dependencies: Array<A_TYPES__A_DependencyDecoratorConfig>);
    add(dependency: A_TYPES__A_DependencyDecoratorConfig): void;
    resolve<T extends Array<typeof A_Module<any> | typeof A_Context>>(dependencies: [...T]): Promise<{
        [K in keyof T]: InstanceType<T[K]>;
    }>;
    resolve<T extends (A_Module<any> | A_TYPES__IContext)>(dependency: {
        new (...args: any[]): T;
    }): Promise<T>;
    private resolveModule;
    private resolveContext;
    hasModule(moduleConstructor: typeof A_SDK_Module.constructor): boolean;
    useModule(module: A_SDK_Module): void;
    init(): Promise<any>;
    private activateModuleWithDependencies;
}
