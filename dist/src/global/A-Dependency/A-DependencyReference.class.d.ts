declare class RealDependency {
    private name;
    constructor(name: string);
    getName(): string;
    performAction(): void;
}
declare class DependencyReference<T> {
    private realClass;
    private args;
    private proxyInstance;
    private realInstance;
    constructor(realClass: {
        new (...args: any[]): T;
    }, args: any[]);
    private loadInstance;
    resolve(): Promise<T>;
}
