import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";


export class ComponentB {


    @A_Feature.Extend()
    async load() {
        console.log('Component B ->  load()');
    }


    @A_Feature.Extend()
    async method_B() {
        console.log('Component B ->  method_B()');
    }

    @A_Feature.Extend({
        name: 'method_B'
    })
    async someMethod() {
        console.log('Component B ->  method_B() -> someMethod()');
    }


    @A_Feature.Extend({
        name: 'method_B'
    })
    async someMethod2() {
        console.log('Component B ->  method_B() -> someMethod2()');
    }

    @A_Feature.Extend({
        name: 'method_A'
    })
    async someMethod3(
        @A_Inject(ContextFragmentB) context: ContextFragmentB,
        @A_Inject(ContextFragmentA) context2: ContextFragmentA
    ) {
        console.log('Component B ->  method_A() -> someMethod3()');
    }

}