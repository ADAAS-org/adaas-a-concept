import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";



export class MainContainer extends A_Container<
    ['method_A', 'method_B']
> {

    @A_Concept.Load()
    async load() {
        console.log('Main container loaded');
    }

    @A_Concept.Start()
    async start(
        @A_Inject(MainContainer) params?: any
    ) {
        if (params) {
            console.log('Start');

        }

        A_Context.feature(this, 'method_A');
    }




    @A_Feature.Define()
    async method_A() {
        console.log('Method A');
        await this.call('method_A', {
            fragments: [
                new ContextFragmentA(),
                new ContextFragmentB()
            ]
        });
    }




    @A_Feature.Define()
    async method_B() {
        console.log('Method B', A_Context.root);

        const logger = this.Scope.resolve(A_Logger);

        // or  you can manually call the feature

        const feature = A_Context.feature(this, 'method_B', {
            fragments: [new ContextFragmentA(), new ContextFragmentB()]
        });

        for (const step of feature) {
            logger.log('Manual Loop Execution Step', feature.current);

            await step();
        }
    }
}