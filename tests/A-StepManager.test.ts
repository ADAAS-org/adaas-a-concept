import { A_Component } from "@adaas/a-concept/a-component";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_StepsManager } from "@adaas/a-concept/a-step-manager";

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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
                handler: 'step5',
            },
            {
                name: 'step6',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
                handler: 'step5',
                before: /^.*\.*step2$/.source,
                after: /^.*\.*step6$/.source
            },
            {
                name: 'step6',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
                handler: 'step5',
            },
            {
                name: 'step6',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
                handler: 'step5',
                before: new RegExp('.*').source,
            },
            {
                name: 'step6',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
                handler: 'step5',
            },
            {
                name: 'test',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentB),
                handler: 'readFromEnv',
            },
            {
                name: 'readFromFile',
                dependency: new A_Dependency(ComponentB),
                handler: 'readFromFile',
            },
            {
                name: 'initialize',
                dependency: new A_Dependency(ComponentA),
                handler: 'initialize',
            },
            {
                name: 'inject',
                dependency: new A_Dependency(ComponentA),
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
                dependency: new A_Dependency(ComponentA),
                handler: 'step1',
            },
            {
                name: 'step2',
                dependency: new A_Dependency(ComponentA),
                handler: 'step2',
            },
            {
                name: 'step3',
                dependency: new A_Dependency(ComponentA),
                handler: 'step3',
                override: /^.*\.step(4|5)$/.source
            },
            {
                name: 'step4',
                dependency: new A_Dependency(ComponentA),
                handler: 'step4',
            },
            {
                name: 'step5',
                dependency: new A_Dependency(ComponentA),
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

    // -----------------------------------------------------------------------
    // Reproduction of the A_Frame load-ordering scenario.
    //
    // A_Frame declares two @A_Concept.Load hooks on the SAME component:
    //   - injectDependencies: before /.*/   (packs A_FrameContext etc.)
    //   - load:               must run AFTER injectDependencies AND AFTER the
    //                         env/config bootstrap, but BEFORE every other
    //                         (domain) load hook.
    //
    // `load` MUST come out after `injectDependencies`; otherwise it touches
    // A_FrameContext before it exists ("Cannot read properties of undefined").
    // -----------------------------------------------------------------------
    describe('A_Frame load-ordering reproduction', () => {

        class A_Frame extends A_Component {
            async injectDependencies() { }
            async load() { }
        }

        class ConfigReader extends A_Component {
            async readEnvFile() { }
            async initialize() { }
        }

        class DomainComponent extends A_Component {
            async onLoad() { }
        }

        it('keeps load after injectDependencies (two hooks, same component)', () => {
            const sm = new A_StepsManager([
                {
                    name: 'injectDependencies',
                    dependency: new A_Dependency(A_Frame),
                    handler: 'injectDependencies',
                    before: /.*/.source,
                },
                {
                    name: 'load',
                    dependency: new A_Dependency(A_Frame),
                    handler: 'load',
                    before: /^(?!.*(?:ConfigReader|A_ConfigLoader|A_Polyfill|injectDependencies)).+$/.source,
                    after: /injectDependencies|ConfigReader|A_ConfigLoader|A_Polyfill/.source,
                },
            ]);

            const result = sm.toSortedArray();

            expect(result.indexOf('A_Frame.injectDependencies'))
                .toBeLessThan(result.indexOf('A_Frame.load'));
        });

        it('runs load after env/config bootstrap and before domain hooks', () => {
            const sm = new A_StepsManager([
                {
                    name: 'readEnvFile',
                    dependency: new A_Dependency(ConfigReader),
                    handler: 'readEnvFile',
                    before: /^ConfigReader\.initialize$/.source,
                },
                {
                    name: 'initialize',
                    dependency: new A_Dependency(ConfigReader),
                    handler: 'initialize',
                },
                {
                    name: 'injectDependencies',
                    dependency: new A_Dependency(A_Frame),
                    handler: 'injectDependencies',
                    before: /.*/.source,
                },
                {
                    name: 'load',
                    dependency: new A_Dependency(A_Frame),
                    handler: 'load',
                    before: /^(?!.*(?:ConfigReader|A_ConfigLoader|A_Polyfill|injectDependencies)).+$/.source,
                    after: /injectDependencies|ConfigReader|A_ConfigLoader|A_Polyfill/.source,
                },
                {
                    name: 'onLoad',
                    dependency: new A_Dependency(DomainComponent),
                    handler: 'onLoad',
                },
            ]);

            const result = sm.toSortedArray();

            const idxEnv = result.indexOf('ConfigReader.readEnvFile');
            const idxInit = result.indexOf('ConfigReader.initialize');
            const idxInject = result.indexOf('A_Frame.injectDependencies');
            const idxLoad = result.indexOf('A_Frame.load');
            const idxDomain = result.indexOf('DomainComponent.onLoad');

            // env file read before its own initialize
            expect(idxEnv).toBeLessThan(idxInit);
            // load runs after dependency injection
            expect(idxInject).toBeLessThan(idxLoad);
            // load runs after the env/config bootstrap (so process.env is ready)
            expect(idxEnv).toBeLessThan(idxLoad);
            expect(idxInit).toBeLessThan(idxLoad);
            // load runs before any domain hook (so credentials are ready for them)
            expect(idxLoad).toBeLessThan(idxDomain);
        });
    });

});