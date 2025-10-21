
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Meta } from "../A-Meta/A-Meta.class";



export class A_ConceptMeta extends A_Meta<any> {


    constructor(
        private containers: Array<A_Container>,
    ) {
        super();
    }


}