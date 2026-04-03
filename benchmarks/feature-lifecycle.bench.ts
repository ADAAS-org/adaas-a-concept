/**
 * ============================================================
 *  A_Feature Lifecycle Performance Benchmarks
 * ============================================================
 *
 * Measures end-to-end performance of feature creation and execution:
 *  - Feature initialization from component
 *  - Feature initialization from template
 *  - Feature process() execution (sync steps)
 *  - Full decorator → resolve → template → process pipeline
 *  - Scaling with number of extensions
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Caller } from "@adaas/a-concept/a-caller";
import { createSuite, BenchResult } from './helpers';


// ──────────────────────────────────────────────────────────────
// Fixture Components
// ──────────────────────────────────────────────────────────────

// Simple sync component for pure overhead measurement
class SimpleComponent extends A_Component {
    counter: number = 0;

    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'simpleFeature' })
    simpleMethod() {
        this.counter++;
    }
}

// Component with multiple sync extensions
class ExtA extends A_Component {
    @A_Feature.Extend({ name: 'multiFeature' })
    stepA() { }
}

class ExtB extends A_Component {
    @A_Feature.Extend({ name: 'multiFeature' })
    stepB() { }
}

class ExtC extends A_Component {
    @A_Feature.Extend({ name: 'multiFeature' })
    stepC() { }
}

class ExtD extends A_Component {
    @A_Feature.Extend({ name: 'multiFeature' })
    stepD() { }
}

class ExtE extends A_Component {
    @A_Feature.Extend({ name: 'multiFeature' })
    stepE() { }
}

// Component that defines the multi-feature
class MultiComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    async multiFeature() {
        await this.call('multiFeature');
    }
}

// Inheritance chain for testing feature inheritance overhead
class BaseComp extends A_Component {
    @A_Feature.Define({ invoke: false })
    async inheritedFeature() {
        await this.call('inheritedFeature');
    }

    @A_Feature.Extend({ name: 'inheritedFeature' })
    baseStep() { }
}

class ChildComp extends BaseComp {
    @A_Feature.Extend({ name: 'inheritedFeature' })
    childStep() { }
}

class GrandchildComp extends ChildComp { }


// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runFeatureLifecycleBenchmarks(): Promise<BenchResult[]> {
    const allResults: BenchResult[] = [];

    // Suite 1: Feature Construction
    const constructionResults = await createSuite('A_Feature — Construction', (suite) => {
        const scope = new A_Scope({ name: 'ConstructScope', components: [SimpleComponent] });
        const comp = scope.resolve(SimpleComponent)!;

        const templateSteps = [
            {
                name: 'SimpleComponent.simpleMethod',
                dependency: new A_Dependency(SimpleComponent),
                handler: 'simpleMethod',
            }
        ];

        suite
            .add('new A_Feature (from component)', () => {
                new A_Feature({
                    name: 'simpleFeature',
                    component: comp,
                });
            })
            .add('new A_Feature (from template, 1 step)', () => {
                new A_Feature({
                    name: 'benchFeature',
                    scope: new A_Scope(),
                    template: templateSteps,
                });
            })
            .add('new A_Feature (from template, 5 steps)', () => {
                new A_Feature({
                    name: 'benchFeature',
                    scope: new A_Scope(),
                    template: [
                        ...templateSteps,
                        { name: 's2', dependency: new A_Dependency(SimpleComponent), handler: 's2' },
                        { name: 's3', dependency: new A_Dependency(SimpleComponent), handler: 's3' },
                        { name: 's4', dependency: new A_Dependency(SimpleComponent), handler: 's4' },
                        { name: 's5', dependency: new A_Dependency(SimpleComponent), handler: 's5' },
                    ],
                });
            });
    });
    allResults.push(...constructionResults);

    // Suite 2: Feature Execution (sync)
    const execResults = await createSuite('A_Feature — Sync Execution', (suite) => {
        // 1-step feature
        const scope1 = new A_Scope({ name: 'ExecScope1', components: [SimpleComponent] });
        const comp1 = scope1.resolve(SimpleComponent)!;

        // Multi-step feature (3 extensions)
        const scope3 = new A_Scope({
            name: 'ExecScope3',
            components: [MultiComponent, ExtA, ExtB, ExtC]
        });
        const comp3 = scope3.resolve(MultiComponent)!;

        // Multi-step feature (5 extensions)
        const scope5 = new A_Scope({
            name: 'ExecScope5',
            components: [MultiComponent, ExtA, ExtB, ExtC, ExtD, ExtE]
        });
        const comp5 = scope5.resolve(MultiComponent)!;

        suite
            .add('call feature (1 sync step)', () => {
                comp1.call('simpleFeature');
            })
            .add('call feature (3 sync extensions)', () => {
                comp3.call('multiFeature');
            })
            .add('call feature (5 sync extensions)', () => {
                comp5.call('multiFeature');
            });
    });
    allResults.push(...execResults);

    // Suite 3: Full lifecycle — construction + execution
    const fullResults = await createSuite('A_Feature — Full Lifecycle (construct + execute)', (suite) => {
        const scope = new A_Scope({ name: 'FullScope', components: [SimpleComponent] });
        const comp = scope.resolve(SimpleComponent)!;

        const scope3 = new A_Scope({
            name: 'FullScope3',
            components: [MultiComponent, ExtA, ExtB, ExtC]
        });
        const comp3 = scope3.resolve(MultiComponent)!;

        suite
            .add('construct + process (1 step)', () => {
                const feature = new A_Feature({
                    name: 'simpleFeature',
                    component: comp,
                });
                feature.process();
            })
            .add('construct + process (3 extensions)', () => {
                const feature = new A_Feature({
                    name: 'multiFeature',
                    component: comp3,
                });
                feature.process();
            });
    });
    allResults.push(...fullResults);

    // Suite 4: Inheritance depth impact on feature lifecycle
    const inheritResults = await createSuite('A_Feature — Inheritance Impact', (suite) => {
        const scopeBase = new A_Scope({ name: 'BaseScope', components: [BaseComp] });
        const compBase = scopeBase.resolve(BaseComp)!;

        const scopeChild = new A_Scope({ name: 'ChildScope', components: [ChildComp] });
        const compChild = scopeChild.resolve(ChildComp)!;

        const scopeGrand = new A_Scope({ name: 'GrandScope', components: [GrandchildComp] });
        const compGrand = scopeGrand.resolve(GrandchildComp)!;

        suite
            .add('construct + process (base class)', () => {
                const feature = new A_Feature({
                    name: 'inheritedFeature',
                    component: compBase,
                });
                feature.process();
            })
            .add('construct + process (1-level child)', () => {
                const feature = new A_Feature({
                    name: 'inheritedFeature',
                    component: compChild,
                });
                feature.process();
            })
            .add('construct + process (2-level grandchild)', () => {
                const feature = new A_Feature({
                    name: 'inheritedFeature',
                    component: compGrand,
                });
                feature.process();
            });
    });
    allResults.push(...inheritResults);

    return allResults;
}


// Run standalone
if (require.main === module) {
    runFeatureLifecycleBenchmarks().catch(console.error);
}
