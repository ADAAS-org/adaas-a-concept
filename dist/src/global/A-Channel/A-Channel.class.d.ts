/**
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 *
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 *
 */
export declare class A_Channel<T> {
    private realClass;
    private args;
    private proxyInstance;
    private realInstance;
    constructor(realClass: {
        new (...args: any[]): T;
    }, args: any[]);
    protected loadInstance(): Promise<T>;
    resolve(): Promise<T>;
}
