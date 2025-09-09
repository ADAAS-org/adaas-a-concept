import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";



export class SecondaryContainer extends A_Container {

    @A_Concept.Load()
    async load(
        @A_Inject(A_Logger) logger: A_Logger

    ) {
        logger.log('Secondary container loaded');
    }

    @A_Concept.Start()
    async start(
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        await this.call('method_C');
    }
} 