import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Errors } from "./A-Errors.namespace";
import { A_Load } from "@adaas/a-concept/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator";



export class A_ErrorsInitializer extends A_Container<A_Errors> {

    @A_Load({})
    async init() {
        await this.namespace.ready;
    }

}