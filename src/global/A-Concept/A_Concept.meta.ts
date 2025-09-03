
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
// import { A_TYPES__ComponentMeta } from "./A-Component.types";


export class A_ConceptMeta extends A_Meta<any> {


    constructor(
        private containers: Array<A_Container>,
        private base: A_Container
    ) {
        super();
    }

    abstractionDefinition(
        method: A_TYPES__ConceptStage,
        scope: A_Scope
    ): A_TYPES__A_AbstractionConstructor {

        const featureDefinitions = this.containers.map(container =>
            A_Context.abstractionDefinition(container, method, scope)
        );

        const definition = {
            name: `${this.base.name}.${method}`,
            features: featureDefinitions,
            scope
        };

        return definition;
    }



    abstraction(
        method: A_TYPES__ConceptStage,
        scope: A_Scope
    ): A_Abstraction {

        const featureDefinitions = this.containers.map(container => {
            const definition = A_Context.abstractionDefinition(container, method, container.Scope);

            return {
                ...definition,
                steps: definition.steps.map(step => ({ ...step, component: step.component ? step.component : container }))
            }
        });


        const definition = {
            name: `${this.base.name}.${method}`,
            features: featureDefinitions,
            scope
        };

        return new A_Abstraction(definition);
    }

}