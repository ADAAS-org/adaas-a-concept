import { A_Lifecycle } from "@adaas/a-concept/decorators/A-ConceptLifecycle";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Namespace } from "@adaas/a-concept/global/A-Namespace/A_Namespace.class";
import { A_TYPES__NamespaceConstructor } from "@adaas/a-concept/global/A-Namespace/A_Namespace.types";


export type A_TYPES__HttpServerNamespaceConstructor = {
    port: number
} & A_TYPES__NamespaceConstructor






//=========== EXAMPLES============\


/**
 * Stores information about DB connection, models, other things, etc.
 */
class A_DB extends A_Namespace {

    private models: Array<any> = [];
    private connection: any;


    registerModel(model: any) {
        this.models.push(model);
    }

    connect(
        connection: any
    ) {
        this.connection = connection;
    }

}


/**
 * Container that deals with the DB connection.
 */
class PostgresDB extends A_Container<A_DB> {


    @A_Lifecycle.Load()
    async connect() {
        // Connect to the DB
        this.namespace.connect(
            // Just for example
            'connection'
        );
    }


    @A_Lifecycle.Load()
    async init() {
        this.namespace.registerModel(
            // Just for example
            'model'
        );
    }
}


/**
 * Stores information about the models with methods to interact with them.
 */
class PostgresDBRepository extends A_Component {

    async save(model: any) {
        // Save the model
    }

    async find(model: any) {
        // Find the model
    }

    async delete(model: any) {
        // Delete the model
    }

}



class A_Auth extends A_Namespace {

    private users: Array<any> = [];

    // dosomething<
    //     S extends A_TYPES__NamespaceConstructor,
    //     T extends A_Namespace<S>>(
    //         conatienr: typeof A_Container<T>,
    //         params: S

    //     ) { }

    registerUser(user: any) {
        this.users.push(user);

        // Do something with the user
     

    }
}