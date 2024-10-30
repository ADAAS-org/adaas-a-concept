import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { MainContainer } from "./containers/Main.container";
import { ComponentA } from "./components/A.component";
import { ComponentB } from "./components/B.component";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { A_Errors } from "@adaas/a-concept/base/A-Errors/A-Errors.context";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";


(async () => {

    console.log('Start');

    class foo extends A_Container<['f', 'f2']> {

    }


    const simpleConcept = new A_Concept({
        name: 'simple-concept',
        fragments: [
            new A_Config({
                variables: ['A', 'B', 'C'],
                defaults: {
                    A: 1,
                }
            }),
            new A_Errors({
                errors: [
                    {
                        code: 'some_error',
                        description: 'Error 1',
                        message: 'Error 1'
                    }
                ]
            })
        ],
        containers: [
            new MainContainer({
                components: [
                    ComponentA,
                    ComponentB
                ]
            }),
            new foo({})
        ]
    });

    await simpleConcept.run({})

    simpleConcept.call('method_B');

})();