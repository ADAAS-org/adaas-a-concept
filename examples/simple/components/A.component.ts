import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";

export class ComponentA {


    @A_Feature.Extend()
    async load() { }



    @A_Feature.Extend()
    async method_A(
        @A_Inject(ContextFragmentA) fragmentA: ContextFragmentA
    ) {
        console.log('Component A ->  method_A()');
        fragmentA.decrement();
    }



    @A_Feature.Extend({
        name: 'method_A'
    })
    async someMethod(
        @A_Inject(ContextFragmentB) fragmentB: ContextFragmentB
    ) {
        console.log('Component A ->  method_A() -> someMethod()');

        fragmentB.increment();
    }

}