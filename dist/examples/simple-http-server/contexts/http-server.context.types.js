"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
Object.defineProperty(exports, "__esModule", { value: true });
const A_ConceptLifecycle_1 = require("../../../src/decorators/A-ConceptLifecycle");
const A_Component_class_1 = require("../../../src/global/A-Component/A-Component.class");
const A_Container_class_1 = require("../../../src/global/A-Container/A-Container.class");
const A_Namespace_class_1 = require("../../../src/global/A-Namespace/A_Namespace.class");
//=========== EXAMPLES============\
/**
 * Stores information about DB connection, models, other things, etc.
 */
class A_DB extends A_Namespace_class_1.A_Namespace {
    constructor() {
        super(...arguments);
        this.models = [];
    }
    registerModel(model) {
        this.models.push(model);
    }
    connect(connection) {
        this.connection = connection;
    }
}
/**
 * Container that deals with the DB connection.
 */
class PostgresDB extends A_Container_class_1.A_Container {
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            // Connect to the DB
            this.namespace.connect(
            // Just for example
            'connection');
        });
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
            this.namespace.registerModel(
            // Just for example
            'model');
        });
    }
}
__decorate([
    A_ConceptLifecycle_1.A_Lifecycle.Load()
], PostgresDB.prototype, "connect", null);
__decorate([
    A_ConceptLifecycle_1.A_Lifecycle.Load()
], PostgresDB.prototype, "init", null);
/**
 * Stores information about the models with methods to interact with them.
 */
class PostgresDBRepository extends A_Component_class_1.A_Component {
    save(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Save the model
        });
    }
    find(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Find the model
        });
    }
    delete(model) {
        return __awaiter(this, void 0, void 0, function* () {
            // Delete the model
        });
    }
}
class A_Auth extends A_Namespace_class_1.A_Namespace {
    constructor() {
        super(...arguments);
        this.users = [];
    }
    // dosomething<
    //     S extends A_TYPES__NamespaceConstructor,
    //     T extends A_Namespace<S>>(
    //         conatienr: typeof A_Container<T>,
    //         params: S
    //     ) { }
    registerUser(user) {
        this.users.push(user);
        // Do something with the user
    }
}
//# sourceMappingURL=http-server.context.types.js.map