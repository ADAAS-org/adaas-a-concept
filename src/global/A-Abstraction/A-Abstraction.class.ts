import { A_Feature } from "../A-Feature/A-Feature.class";
import { A_TYPES__A_AbstractionConstructor } from "./A-Abstraction.types";


export class A_Abstraction {

    public name: string;
    private definition: Array<{
        container: any
        steps: Array<any>
    }>

    constructor(params: A_TYPES__A_AbstractionConstructor) {
        this.name = params.name;
        this.definition = params.definition;
    }


    /**
     * Define a new A-Abstraction
     */
    static get Define(): typeof A_Feature_Define {
        return A_Feature_Define;
    }


    async process() {

        const features = this.definition.map(def => new A_Feature({
            name: `${this.name}.${def.container.name}`,
            steps: def.steps
        }));


    }
}