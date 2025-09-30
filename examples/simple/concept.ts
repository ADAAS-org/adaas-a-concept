import { MainContainer } from "./containers/Main.container";
import { ComponentA } from "./components/A.component";
import { ComponentB } from "./components/B.component";
import { A_Logger } from "@adaas/a-concept/base/A-Logger/A-Logger.component";
import { ContextFragmentA } from "./context/Fragment_A.context";
import { ContextFragmentB } from "./context/Fragment_B.context";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { A_ConfigLoader } from "@adaas/a-concept/base/A-Config/A-Config.container";
import { ENVConfigReader } from "@adaas/a-concept/base/A-Config/components/ENVConfigReader.component";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { SecondaryContainer } from "./containers/Secondary.container";
import { EntityA } from "./entities/EntityA.entity";

(async () => {

    const main = new MainContainer({
        name: 'MainContainer',
        components: [
            A_Logger,
            ComponentA,
            ComponentB
        ],
        fragments: [
            new ContextFragmentA(),
            new ContextFragmentB()
        ]
    })

    const second = new SecondaryContainer({
        name: 'SecondaryContainer',
        components: [
            A_Logger,
            ComponentA,
            ComponentB
        ],
        fragments: [
            new ContextFragmentA(),
            new ContextFragmentB()
        ]
    })

    const concept = new A_Concept({
        name: 'test-simple',
        fragments: [
            new A_Config({
                variables: ['CONFIG_VERBOSE'],
                defaults: {
                    'CONFIG_VERBOSE': true
                }
            })
        ],
        containers: [
            new A_ConfigLoader({
                components: [
                    ENVConfigReader
                ]
            }),
            main,
            second
        ],
        entities: [
            new EntityA({ bar: 'bar' }),
            new EntityA({ bar: 'bar' }),
            new EntityA({ bar: 'barZ' }),
        ]
    });

    // await concept.load();
    // await concept.start();


    await main.method_A()


    // await main.method_C();

    try {
        await main.call('method_C')
        await second.call('method_C')

    } catch (error) {
        console.error('Error occurred:', error);
    }



})();