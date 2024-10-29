

/**
 * A_Channel is an abstraction over any Communication Type from event emitters to message queues, HTTP requests, etc.
 * 
 * A_Channel uses to connect Containers between each other. When
 * When One container needs to communicate with another container, it uses A_Channel.
 * 
 */
export class A_Channel<T> {
    private proxyInstance: T | null = null;
    private realInstance: T | null = null;

    constructor(
        private realClass: { new(...args: any[]): T },
        private args: any[]
    ) {

    }

    protected async loadInstance(): Promise<T> {
        if (!this.realInstance)
            this.realInstance = new this.realClass(...this.args);

        return this.realInstance;
    }


    public async resolve(): Promise<T> {
        if (!this.proxyInstance) {
            const realInstance = await this.loadInstance();

            this.proxyInstance = new Proxy({}, {
                get: (target, prop) => {
                    const value = (realInstance as any)[prop];

                    // If the property is a method, return a bound function
                    if (typeof value === 'function') {
                        return value.bind(realInstance);
                    }
                    return value;
                }
            }) as T;
        }

        return this.proxyInstance;
    }
}