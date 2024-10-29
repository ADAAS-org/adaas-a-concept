
function Inject() {
    return function (target: any, key: string, index: number) {
        console.log('Inject', target, key, index);
    }
}


/**
 * Allows to define a new lifecycle method
 */
function Define(
    ...args: any[]
)
function Define(
    name: string,
    ...args: any[]
) {
    return function (target: any, key: string, descriptor: PropertyDescriptor) {
        Architecture
            .register(target.constructor, {
                name
            });
    }

}


class User {

}


class CRUDController {


    constructor(
        // Context Injection to adjust behavior
        // @Inject(User) user
    ) {
    }


    post(
        // Runtime injection to get the request object or any other
        @Inject() request: ControllerRequest,
    ) {
        request.user;
    }
}

class StatsController {


    // This method is context independent and "extends" the behavior of the parent Class (without inheritance)
    // Here you can define what to expect from the previous step
    // Basically here we can extend the behavior of the parent class
    @App.Lifecycle.onRequest()
    onRequest(

    ) {

    }



    //  This method is context dependent
    count(
        @Inject() request: ControllerRequest,
    ) {
        request.user;
    }
}

class ControllerRequest {

    constructor(
        public user: User
    ) {


    }
}


class DependencyResolver {
    resolve<T extends { new(...args: any[]): any }>(
        target: any,

    ): T {
        return new target();
    }

}


class Architecture {

    private static instance: Architecture;

    private definitions: Map<{ new(...args: any[]): any }, {
        lifecycle: Map<string, Function>
    }> = new Map();


    private constructor() {

    }


    static getInstance() {
        if (!this.instance) {
            this.instance = new Architecture();
        }
        return this.instance;
    }


    static register(
        constructor: { new(...args: any[]): any },
        config: {
            name: string
        }
    ) {
        const instance = this.getInstance();

        instance.definitions.set(constructor, {
            lifecycle: new Map()
        });
    }


    static getLifecycle(
        constructor: { new(...args: any[]): any }
    ) {
        const instance = this.getInstance();

        return instance.definitions.get(constructor)?.lifecycle;
    }

}


class Container {

}



// Concept 
// - run
// - build

// Container #1
// - start
// - stop

// Container #2
// - build
// - request
// - response
// - error 

// Container #3
// - start
// - stop



interface Feature<
    _LifecycleMethodName extends string,
    _RuntimeContext extends any,
> {
    name: _LifecycleMethodName;
    context: new (...args: any[]) => _RuntimeContext; // The class constructor for the context
}




class Concept<
    _LifecycleMethodNames extends string,
    _RuntimeContext extends any,

    // _FeaturesDefinition extends Feature<_LifecycleMethodNames, _RuntimeContext>[],
    _FeaturesDefinition2 extends Record<_LifecycleMethodNames, new (...args: any[]) => _RuntimeContext>
> {


    // private steps!: _FeaturesDefinition

    constructor(props: {
        // features: _FeaturesDefinition,
        exports: _FeaturesDefinition2
        context: [],
        import: any[]
    }) {

    }

    // async resolve(): Promise<{
    //     [K in _FeaturesDefinition[number]['name']]: (
    //         context: InstanceType<
    //             Extract<_FeaturesDefinition[number], { name: K }>['context']
    //         >
    //     ) => void;
    // }> {
    //     return {} as any
    // }


    async resolve2(): Promise<{
        [K in keyof _FeaturesDefinition2]: (
            context: InstanceType<
                _FeaturesDefinition2[K]
            >
        ) => void;
    }> {
        return {} as any
    }

}


class App extends Container {

    server: any;
    components: any[] = [];


    constructor(components: any[]) {
        super();
        // this.server = new Server();

        this.components = components;
    }

    static get Lifecycle() {
        return {
            onRequest: (...args: any[]) => Define('onRequest', ...args)
        }
    }

    //  The container has a set of lifecycle methods that can be used to extend the behavior by adding new methods
    // Define Decorator allows to create a custom lifecycle attached to the class. 
    // So any other classes injected here will be able to use the lifecycle methods
    @Define()
    onRequest(request: any) {

    }

}

class startContext {

}



const myConcept = new Concept(
    {
        exports: {
            start: startContext
        },
        context: [],
        import: [
            // We say that concept has User Entity
            User,

            // We say that concept has an APP with CRUDController
            new App([
                // 
                CRUDController,
                // new CRUDController(),
            ])
        ]
    }
);

(async () => {
    // const target2 = await myConcept
    //     .resolve2();


    // target2.start()

})()



