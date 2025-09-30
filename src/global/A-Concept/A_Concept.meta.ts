
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Meta } from "../A-Meta/A-Meta.class";
import { A_TYPES__Required } from "@adaas/a-utils";
import { A_TYPES__ConceptAbstractionCallParams, A_TYPES__ConceptStage } from "./A_Concept.types";
import { A_TYPES__FeatureConstructor } from "../A-Feature/A-Feature.types";
import { A_TYPES__A_StageStep } from "../A-Stage/A-Stage.types";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_TYPES__A_FeatureDecoratorConfig } from "@adaas/a-concept/decorators/A-Feature/A-Feature.decorator.types";
import { A_TYPES__A_AbstractionConstructor } from "../A-Abstraction/A-Abstraction.types";
import { A_Abstraction } from "../A-Abstraction/A-Abstraction.class";
import { A_Scope } from "../A-Scope/A-Scope.class";
import { A_Concept } from "./A_Concept.class";
// import { A_TYPES__ComponentMeta } from "./A-Component.types";


export class A_ConceptMeta extends A_Meta<any> {


    constructor(
        private containers: Array<A_Container>,
    ) {
        super();
    }

  



  

}