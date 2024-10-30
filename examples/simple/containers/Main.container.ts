import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";



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
    }




    @A_Feature.Define()
    async method_A() {
        console.log('Method A');
        const feature = this.call('method_A', {
            fragments: [new ContextFragmentA(), new ContextFragmentB()]
        });

        await feature.process();
    }

    @A_Feature.Define()
    async method_B() {
        console.log('Method B');
        return this.call('method_B');
    }
}