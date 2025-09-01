import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { ContextFragmentB } from "../context/Fragment_B.context";
import { ContextFragmentA } from "../context/Fragment_A.context";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";


export class ComponentB extends A_Component {

    constructor(
        @A_Inject(A_Logger) private logger: A_Logger
    ) {
        super();
    }


    @A_Concept.Load()
    @A_Feature.Extend()
    async load() {
        console.log('Component B ->  load()');
    }

    @A_Concept.Load()
    async test(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        console.log('Component B ->  test() TEST!!!!!!!!!!!!!!!');
    }


    @A_Feature.Extend()
    async method_B(
        @A_Inject(A_Logger) logger: A_Logger
    ) {
        logger.log('cyan', 'Component B ->  method_B()');
    }

    @A_Feature.Extend({
        name: 'method_B'
    })
    async someMethod(

    ) {
        this.logger.log('pink', 'Component B ->  method_B() -> someMethod()');
        this.logger.log('Component B ->  method_B() -> someMethod()');
    }


    @A_Feature.Extend({
        name: 'method_B'
    })
    async someMethod2() {
        this.logger.log('yellow', 'Component B ->  method_B() -> someMethod2()');
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