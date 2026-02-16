
import { A_Container } from "@adaas/a-concept/a-container";
import { A_Meta } from "@adaas/a-concept/a-meta";



export class A_ConceptMeta extends A_Meta<any> {


    constructor(
        private containers: Array<A_Container>,
    ) {
        super();
    }


}