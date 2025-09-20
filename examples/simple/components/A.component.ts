import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { SecondaryContainer } from "../containers/Secondary.container";
import { A_FeatureCaller } from "@adaas/a-concept/global/A-Feature/A-FeatureCaller.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";

export class ComponentA extends A_Component {


    @A_Feature.Extend()
    async load() { }



    @A_Feature.Define()
    async method_A(
        @A_Inject(ContextFragmentA) fragmentA: ContextFragmentA,
        @A_Inject(A_Logger) logger: A_Logger,
    ) {


        logger.log('red', 'Component A ->  method_A()');
        fragmentA.decrement();
    }



    @A_Feature.Extend({
        name: 'method_A'
    })
    async someMethod(
        @A_Inject(ContextFragmentB) fragmentB: ContextFragmentB,
        @A_Inject(A_Logger) logger: A_Logger,
        @A_Inject(A_FeatureCaller) caller: A_Container
    ) {
        // throw new Error('Some error occurred');
        logger.log('caller', caller);

        return new Promise<void>((resolve, reject) => {
            setTimeout(() => {
                console.log('Component A ->  method_A() -> someMethod()');

                fragmentB.increment();
                console.log('awaited after 5 sec');
                resolve();

            }, 5000);
        });
    }


    @A_Feature.Extend({
        scope: [SecondaryContainer]
    })
    async method_C(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        logger.log('red', 'Component A ->  method_C()');
    }
}