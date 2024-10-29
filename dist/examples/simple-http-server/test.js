"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
function Inject() {
    return function (target, key, index) {
        console.log('Inject', target, key, index);
    };
}
function Define(name, ...args) {
    return function (target, key, descriptor) {
        Architecture
            .register(target.constructor, {
            name
        });
    };
}
class User {
}
class CRUDController {
    constructor(
    // Context Injection to adjust behavior
    // @Inject(User) user
    ) {
    }
    post(request) {
        request.user;
    }
}
__decorate([
    __param(0, Inject())
], CRUDController.prototype, "post", null);
class StatsController {
    // This method is context independent and "extends" the behavior of the parent Class (without inheritance)
    // Here you can define what to expect from the previous step
    // Basically here we can extend the behavior of the parent class
    onRequest() {
    }
    //  This method is context dependent
    count(request) {
        request.user;
    }
}
__decorate([
    App.Lifecycle.onRequest()
], StatsController.prototype, "onRequest", null);
__decorate([
    __param(0, Inject())
], StatsController.prototype, "count", null);
class ControllerRequest {
    constructor(user) {
        this.user = user;
    }
}
class DependencyResolver {
    resolve(target) {
        return new target();
    }
}
class Architecture {
    constructor() {
        this.definitions = new Map();
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new Architecture();
        }
        return this.instance;
    }
    static register(constructor, config) {
        const instance = this.getInstance();
        instance.definitions.set(constructor, {
            lifecycle: new Map()
        });
    }
    static getLifecycle(constructor) {
        var _a;
        const instance = this.getInstance();
        return (_a = instance.definitions.get(constructor)) === null || _a === void 0 ? void 0 : _a.lifecycle;
    }
}
class Container {
}
class Concept {
    // private steps!: _FeaturesDefinition
    constructor(props) {
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
    resolve2() {
        return __awaiter(this, void 0, void 0, function* () {
            return {};
        });
    }
}
class App extends Container {
    constructor(components) {
        super();
        this.components = [];
        // this.server = new Server();
        this.components = components;
    }
    static get Lifecycle() {
        return {
            onRequest: (...args) => Define('onRequest', ...args)
        };
    }
    //  The container has a set of lifecycle methods that can be used to extend the behavior by adding new methods
    // Define Decorator allows to create a custom lifecycle attached to the class. 
    // So any other classes injected here will be able to use the lifecycle methods
    onRequest(request) {
    }
}
__decorate([
    Define()
], App.prototype, "onRequest", null);
class startContext {
}
const myConcept = new Concept({
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
});
(() => __awaiter(void 0, void 0, void 0, function* () {
    // const target2 = await myConcept
    //     .resolve2();
    // target2.start()
}))();
//# sourceMappingURL=test.js.map