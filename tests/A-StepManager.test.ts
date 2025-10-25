import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_StepsManager } from "@adaas/a-concept/global/A-StepManager/A-StepManager.class";

describe('A-StepManager tests', () => {
    it('Should Allow to create a step manager', async () => {
        const sm = new A_StepsManager([]);

        expect(sm).toBeInstanceOf(A_StepsManager);
    });
    it('Should not change original sort if no other rules provided', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async step6() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
            },
            {
                name: 'step6',
                component: ComponentA,
                handler: 'step6',
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            'ComponentA.step1',
            'ComponentA.step2',
            'ComponentA.step3',
            'ComponentA.step4',
            'ComponentA.step5',
            'ComponentA.step6'
        ]);
    });

    it('Should change order depending on the before and after dependencies', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async step6() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
                before: /^.*\.*step2$/.source,
                after: /^.*\.*step6$/.source
            },
            {
                name: 'step6',
                component: ComponentA,
                handler: 'step6',
                before: /^ComponentA\.step2$/.source
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            'ComponentA.step1',
            'ComponentA.step6',
            'ComponentA.step5',
            'ComponentA.step2',
            'ComponentA.step3',
            'ComponentA.step4'
        ]);
    });

    it('Should execute first step with * regexp', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async step6() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
            },
            {
                name: 'step6',
                component: ComponentA,
                handler: 'step6',
                before: /.*/.source,
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            'ComponentA.step6',
            'ComponentA.step1',
            'ComponentA.step2',
            'ComponentA.step3',
            'ComponentA.step4',
            'ComponentA.step5'
        ]);
    });
    it('Should execute with multiple * regexps', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async step6() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
                before: new RegExp('.*').source,
            },
            {
                name: 'step6',
                component: ComponentA,
                handler: 'step6',
                before: new RegExp('.*').source,
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            'ComponentA.step6',
            'ComponentA.step5',
            'ComponentA.step1',
            'ComponentA.step2',
            'ComponentA.step3',
            'ComponentA.step4'
        ]);
    });

    it('Should regexp for correct ordering ', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async test() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
            },
            {
                name: 'test',
                component: ComponentA,
                handler: 'test',
                before: /^.*\.step(4|5)$/.source,
                after: /^.*\.step(1|2)$/.source,
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            "ComponentA.step1",
            "ComponentA.step2",
            "ComponentA.step3",
            "ComponentA.test",
            "ComponentA.step4",
            "ComponentA.step5",
        ]);
    });

    it('Should do proper ordering across multiple components ', async () => {
        class ComponentA extends A_Component {
            async initialize() { }
            async inject() { }

        }

        class ComponentB extends A_Component {
            async readFromEnv() { }
            async readFromFile() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'readFromEnv',
                component: ComponentB,
                handler: 'readFromEnv',
            },
            {
                name: 'readFromFile',
                component: ComponentB,
                handler: 'readFromFile',
            },
            {
                name: 'initialize',
                component: ComponentA,
                handler: 'initialize',
            },
            {
                name: 'inject',
                component: ComponentA,
                handler: 'inject',
                before: /ComponentB\.read.+/ig.source,
                after: 'ComponentA.initialize'
            },
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            "ComponentA.initialize",
            "ComponentA.inject",
            "ComponentB.readFromEnv",
            "ComponentB.readFromFile",
        ]);
    });


    it('Should allow to override steps by regexp', async () => {
        class ComponentA extends A_Component {
            async step1() { }
            async step2() { }
            async step3() { }
            async step4() { }
            async step5() { }
            async test() { }
        }

        const sm = new A_StepsManager([
            {
                name: 'step1',
                component: ComponentA,
                handler: 'step1',
            },
            {
                name: 'step2',
                component: ComponentA,
                handler: 'step2',
            },
            {
                name: 'step3',
                component: ComponentA,
                handler: 'step3',
                override: /^.*\.step(4|5)$/.source
            },
            {
                name: 'step4',
                component: ComponentA,
                handler: 'step4',
            },
            {
                name: 'step5',
                component: ComponentA,
                handler: 'step5',
            }
        ]);


        const result = sm.toSortedArray();

        expect(result).toEqual([
            "ComponentA.step1",
            "ComponentA.step2",
            "ComponentA.step3",
        ]);
    });

});