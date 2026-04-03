/**
 * ============================================================
 *  A_Feature Chaining Performance Benchmarks
 * ============================================================
 *
 * Measures realistic end-to-end performance of feature chaining:
 *  - Entity creation + scope allocation
 *  - Scope registration overhead
 *  - Feature invocation through entity.call()
 *  - Feature chaining between components (chain())
 *  - Dependency injection overhead (@A_Inject)
 *  - Scaling with chain depth and component count
 *  - Full realistic pipeline: entity → scope → feature → chain → DI
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Caller } from "@adaas/a-concept/a-caller";
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Context } from "@adaas/a-concept/a-context";
import { createSuite, BenchResult, printSummary } from './helpers';



// ──────────────────────────────────────────────────────────────
// Fixture: Components — Multiple extensions converging + chain
// ──────────────────────────────────────────────────────────────

export class ExtStepA extends A_Component {
    @A_Feature.Extend({ name: 'componentFeature', scope: [ExtStepA] })
    stepA() {
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Entities
// ──────────────────────────────────────────────────────────────

export class BenchEntity extends A_Entity {

    protected _scope!: A_Scope;

    get scope(): A_Scope {
        if (!this._scope) {
            this._scope = A_Context.allocate(this, new A_Scope({ name: `${this.aseid.id}-scope` }));
        }
        return this._scope;
    }

    get targetComponent() {
        return this.scope.resolve(ExtStepA)!;
    }

    entityFeature() {
        return this.call('entityFeature', this.scope);
    }
}

export class ExtStepB extends A_Component {
    @A_Feature.Extend({ name: 'entityFeature', })
    stepB() {
    }
}

export class ExtStepC extends A_Component {
    @A_Feature.Extend({ name: 'entityFeature', })
    stepC() {
    }
}

export class ChainingComponent extends A_Component {

    @A_Feature.Extend({
        name: 'entityFeature',
        after: /.*/,
    })
    convergentStep(
        @A_Inject(A_Caller) entity: BenchEntity,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        feature.chain(entity.targetComponent, 'componentFeature', scope);
    }
}



// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runFeatureChainingBenchmarks(): Promise<any> {
    const allResults: BenchResult[] = [];



    // ── Suite 3: Feature Call — Baseline (no chain) ─────────
    const baselineResults = await createSuite('Feature Call — Baseline (no chain)', (suite) => {
        const parentScope = new A_Scope({ name: 'parent-scope', components: [ExtStepA] });

        const childScope = new A_Scope({
            name: 'base-3',
            components: [ChainingComponent, ExtStepB, ExtStepC]
        }).inherit(parentScope);

        const entity = new BenchEntity();

        childScope.register(entity);

        entity.scope.inherit(childScope);




        suite
            .add('new Feature instantiation (A_Context.featureTemplate)', () => {
                const definition = A_Context.featureTemplate('entityFeature', entity);

            })
            .add('new Feature instantiation (new A_Feature)', () => {
                const feature = new A_Feature({
                    name: 'entityFeature',
                    component: entity,
                    scope: entity.scope
                });
            })
            .add('new Feature execution (direct)', () => {
                const feature = new A_Feature({
                    name: 'entityFeature',
                    component: entity,
                    scope: entity.scope
                });

                for (const stage of feature) {
                    stage.process(entity.scope)
                }
            })
            .add('new Feature execution (direct entity.call)', () => {
                
                const res = entity.call('entityFeature', entity.scope);

                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');
            })
            .add('new Feature execution (wrapped entity.call)', () => {

                const res = entity.entityFeature();

                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');

            })
            .add('[duplicated 1] new Feature execution (wrapped entity.call)', () => {

                const res = entity.entityFeature();

                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');

            })
            .add('[duplicated 2] new Feature execution (wrapped entity.call)', () => {

                const res = entity.entityFeature();

                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');

            })
            .add('[duplicated 3] new Feature execution (wrapped entity.call)', () => {

                const res = entity.entityFeature();
                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');

            })
            .add('[duplicated 4] new Feature execution (wrapped entity.call)', () => {
                
                const res = entity.entityFeature();

                if (res instanceof Promise)
                    throw new Error('Expected synchronous execution for baseline feature call');

            })
    });
    allResults.push(...baselineResults);

    return allResults;
}


// ──────────────────────────────────────────────────────────────
// Standalone runner
// ──────────────────────────────────────────────────────────────
if (require.main === module) {
    runFeatureChainingBenchmarks()
        .then((results) => {
            const summary = new Map<string, BenchResult[]>();
            summary.set('FeatureChaining', results);
            printSummary(summary);
            console.log('\n✅ Feature chaining benchmarks completed.\n');
        })
        .catch(console.error);
}
