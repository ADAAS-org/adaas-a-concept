declare function Inject(): (target: any, key: string, index: number) => void;
/**
 * Allows to define a new lifecycle method
 */
declare function Define(...args: any[]): any;
declare class User {
}
declare class CRUDController {
    constructor();
    post(request: ControllerRequest): void;
}
declare class StatsController {
    onRequest(): void;
    count(request: ControllerRequest): void;
}
declare class ControllerRequest {
    user: User;
    constructor(user: User);
}
declare class DependencyResolver {
    resolve<T extends {
        new (...args: any[]): any;
    }>(target: any): T;
}
declare class Architecture {
    private static instance;
    private definitions;
    private constructor();
    static getInstance(): Architecture;
    static register(constructor: {
        new (...args: any[]): any;
    }, config: {
        name: string;
    }): void;
    static getLifecycle(constructor: {
        new (...args: any[]): any;
    }): Map<string, Function> | undefined;
}
declare class Container {
}
interface Feature<_LifecycleMethodName extends string, _RuntimeContext extends any> {
    name: _LifecycleMethodName;
    context: new (...args: any[]) => _RuntimeContext;
}
declare class Concept<_LifecycleMethodNames extends string, _RuntimeContext extends any, _FeaturesDefinition2 extends Record<_LifecycleMethodNames, new (...args: any[]) => _RuntimeContext>> {
    constructor(props: {
        exports: _FeaturesDefinition2;
        context: [];
        import: any[];
    });
    resolve2(): Promise<{
        [K in keyof _FeaturesDefinition2]: (context: InstanceType<_FeaturesDefinition2[K]>) => void;
    }>;
}
declare class App extends Container {
    server: any;
    components: any[];
    constructor(components: any[]);
    static get Lifecycle(): {
        onRequest: (...args: any[]) => any;
    };
    onRequest(request: any): void;
}
declare class startContext {
}
declare const myConcept: Concept<string, unknown, {
    start: typeof startContext;
}>;
