/**
 * ============================================================
 *  A_StepsManager Performance Benchmarks
 * ============================================================
 * 
 * Measures:
 *  - Constructor + unique ID assignment
 *  - Graph building + topological sort (toSortedArray)
 *  - Full pipeline: steps → stages (toStages)
 *  - Scaling behavior with increasing step counts
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_StepsManager } from "@adaas/a-concept/a-step-manager";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { createSuite, BenchResult } from './helpers';


// ──────────────────────────────────────────────────────────────
// Fixture Helpers
// ──────────────────────────────────────────────────────────────

class BenchComponent extends A_Component {
    async step1() { }
    async step2() { }
    async step3() { }
    async step4() { }
    async step5() { }
    async step6() { }
    async step7() { }
    async step8() { }
    async step9() { }
    async step10() { }
}

function makeSteps(count: number, opts: { withDeps?: boolean } = {}) {
    const steps: any[] = [];
    for (let i = 0; i < count; i++) {
        const step: any = {
            name: `step${i}`,
            dependency: new A_Dependency(BenchComponent),
            handler: `step${i}`,
        };
        if (opts.withDeps && i > 0) {
            step.after = `BenchComponent.step${i - 1}`;
        }
        steps.push(step);
    }
    return steps;
}


// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runStepManagerBenchmarks(): Promise<BenchResult[]> {
    const allResults: BenchResult[] = [];

    // Suite 1: Constructor performance
    const constructorResults = await createSuite('A_StepsManager — Constructor', (suite) => {
        const steps6 = makeSteps(6);
        const steps20 = makeSteps(20);
        const steps50 = makeSteps(50);

        suite
            .add('new A_StepsManager(6 steps)', () => {
                new A_StepsManager(steps6);
            })
            .add('new A_StepsManager(20 steps)', () => {
                new A_StepsManager(steps20);
            })
            .add('new A_StepsManager(50 steps)', () => {
                new A_StepsManager(steps50);
            });
    });
    allResults.push(...constructorResults);

    // Suite 2: Topological sort
    const sortResults = await createSuite('A_StepsManager — toSortedArray', (suite) => {
        const steps6 = makeSteps(6);
        const steps6Deps = makeSteps(6, { withDeps: true });
        const steps20 = makeSteps(20);
        const steps20Deps = makeSteps(20, { withDeps: true });
        const steps50 = makeSteps(50);

        suite
            .add('toSortedArray (6 steps, no deps)', () => {
                const sm = new A_StepsManager(steps6);
                sm.toSortedArray();
            })
            .add('toSortedArray (6 steps, chained)', () => {
                const sm = new A_StepsManager(steps6Deps);
                sm.toSortedArray();
            })
            .add('toSortedArray (20 steps, no deps)', () => {
                const sm = new A_StepsManager(steps20);
                sm.toSortedArray();
            })
            .add('toSortedArray (20 steps, chained)', () => {
                const sm = new A_StepsManager(steps20Deps);
                sm.toSortedArray();
            })
            .add('toSortedArray (50 steps, no deps)', () => {
                const sm = new A_StepsManager(steps50);
                sm.toSortedArray();
            });
    });
    allResults.push(...sortResults);

    // Suite 3: toStages (full pipeline)
    const stagesResults = await createSuite('A_StepsManager — toStages', (suite) => {
        const scope = new A_Scope({ name: 'BenchScope', components: [BenchComponent] });
        const steps6 = makeSteps(6);
        const steps20 = makeSteps(20);

        suite
            .add('toStages (6 steps)', () => {
                const component = scope.resolve(BenchComponent)!;
                const feature = new A_Feature({
                    name: 'benchFeature',
                    scope: new A_Scope(),
                    template: steps6,
                });
                // toStages is called internally during construction
            })
            .add('toStages (20 steps)', () => {
                const component = scope.resolve(BenchComponent)!;
                const feature = new A_Feature({
                    name: 'benchFeature',
                    scope: new A_Scope(),
                    template: steps20,
                });
            });
    });
    allResults.push(...stagesResults);

    return allResults;
}


// Run standalone
if (require.main === module) {
    runStepManagerBenchmarks().catch(console.error);
}
