import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Load } from "@adaas/a-concept/decorators/A-ConceptLifecycle/A-Load/A-Load.decorator";
import { Logger } from "./components/Logger.component";
import { A_LoggerContext } from "./A-Logger.namespace";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Config } from "../A-Config/A-Config.namespace";



export class A_Logger extends A_Container<A_LoggerContext> {


    @A_Load({})
    async init(
        @A_Inject(A_Config) config: A_Config
    ) {
        await this.namespace.ready;

        this.namespace.Logger = A_Context.resolve(Logger);
    }
}