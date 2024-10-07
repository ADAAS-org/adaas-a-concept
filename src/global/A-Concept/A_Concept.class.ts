import { A_CONCEPT_LifecycleDeclarationsStorage } from "src/storage/A_Concept.storage";
import { A_TYPES__A_CONCEPT_RootRunParams, A_TYPES__IConceptConstructor } from "./A_Concept.types";
import { A_Context } from "../A-Context/A-Context.class";
import { A_Errors } from "src/containers/A-Errors/A-Errors.namespace";



/**
 * A_Concept is a placeholder for the concept of the ani program.
 * 
 * Concept - could be any Program regardless environment and it's goal.
 * It could be mobile, web or simple html page.
 * All depends on Containers and Components installed and provided in the Concept.
 * 
 * 
 * [!] Concept operates ONLY with all Components and Containers provided to achieve the goal.
 * 
 * 
 */
export class A_Concept {


    /**
     * Context is a root namespace for the concept.
     */
    Context!: typeof A_Context;

    /**
     * Context provider is a singleton that provides the context for ALL concepts.
     */

    protected props!: A_TYPES__IConceptConstructor;

    constructor(
        props: A_TYPES__IConceptConstructor
    ) {
        this.props = props;

        this.Context = A_Context;
    }


    get namespace() {
        return this.Context.root
    }


    /**
     * Returns true if the class has inherited from the given class.
     * 
     * @param cl 
     * @returns 
     */
    private hasInherited(cl: { new(...args: any[]) }): boolean {
        return this.constructor === cl
            ? false
            : true
    }




    protected async init() {
        // await this.Context.init();

        // await this.DM.init();
    }



    // =======================================================================
    // ==========================  LIFECYCLE  ================================
    // =======================================================================

    /**
     * Run the concept.
     */
    async run(
        params: A_TYPES__A_CONCEPT_RootRunParams = {}
    ) {

        //  to prevent modification of the method parameters use the A_Context directly without decorators 
        const [
            Errors
        ] = this.Context.resolve([A_Errors]);

        if (this.hasInherited(A_Concept))
            Errors.throw('[root.run] method can not be overridden in the inherited classes');


        // const allRunDeclarations = A_CONCEPT_LifecycleDeclarationsStorage
        //     .get(A_CONCEPT_STORAGE__DECORATORS_RUN_DECLARATIONS);
    }


    /**
     * Build the concept.
     */
    async build() {
        //  to prevent modification of the method parameters use the A_Context directly without decorators 
        const [
            Errors
        ] = this.Context.resolve([A_Errors]);


        if (this.hasInherited(A_Concept))
            Errors.throw('[root.build] method can not be overridden in the inherited classes');

    }


    // /**
    //  * Deploy the concept.
    //  */
    // async deploy() {
    //     if (this.hasInherited(A_Concept))
    //         this.Context.Errors.throw('[root.deploy] method can not be overridden in the inherited classes');
    // }


    // /**
    //  * Publish the concept.
    //  */
    // async publish() {
    //     if (this.hasInherited(A_Concept))
    //         this.Context.Errors.throw('[root.publish] method can not be overridden in the inherited classes');
    // }


    /**
     * Call the specific method of the concept or included modules.
     */
    async call() {
        //  to prevent modification of the method parameters use the A_Context directly without decorators 
        const [
            Errors
        ] = this.Context.resolve([A_Errors]);

        // if (this.hasInherited(A_Concept))
        //     this.Context.Errors.throw('[root.call] method can not be overridden in the inherited classes');
    }

}