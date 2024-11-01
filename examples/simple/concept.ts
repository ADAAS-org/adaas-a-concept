import { MainContainer } from "./containers/Main.container";
import { ComponentA } from "./components/A.component";
import { ComponentB } from "./components/B.component";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { ContextFragmentA } from "./context/Fragment_A.context";
import { ContextFragmentB } from "./context/Fragment_B.context";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { A_ConfigLoader } from "@adaas/a-concept/base/A-Config/A-Config.container";
import { ENVConfigReader } from "@adaas/a-concept/base/A-Config/components/ENVConfigReader.component";

(async () => {

    console.log('Start');

    // class foo extends A_Container<['f', 'f2']> {

    // }


    // const simpleConcept = new A_Concept({
    //     name: 'simple-concept',
    //     fragments: [
    //         new A_Config({
    //             variables: ['A', 'B', 'C'],
    //             defaults: {
    //                 A: 1,
    //             }
    //         }),
    //         new A_Errors({
    //             errors: [
    //                 {
    //                     code: 'some_error',
    //                     description: 'Error 1',
    //                     message: 'Error 1'
    //                 }
    //             ]
    //         })
    //     ],
    //     containers: [

    //         new foo({})
    //     ]
    // });

    // console.log('Here')
    // simpleConcept.call('method_B');

    const configContext = new A_Config({
        variables: ['CONFIG_VERBOSE'],
        defaults: {
            'CONFIG_VERBOSE': true
        }
    });


    const configLoader = new A_ConfigLoader({
        fragments: [
            configContext
        ],
        components: [
            ENVConfigReader
        ]
    });

    await configLoader.identifyReader();
    await configLoader.readVariables();


    const container = new MainContainer({
        name: 'MainContainer',
        components: [
            A_Logger,
            ComponentA,
            ComponentB
        ],
        fragments: [
            configContext,
            new ContextFragmentA(),
            new ContextFragmentB()
        ]
    });

    // await container.call('method_B');
    await container.method_B();
})();