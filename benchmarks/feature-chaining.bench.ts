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
// Fixture: Entities
// ──────────────────────────────────────────────────────────────

class BenchEntity extends A_Entity {
    protected _scope!: A_Scope;

    get scope(): A_Scope {
        if (!this._scope) {
            this._scope = A_Context.allocate(this, new A_Scope({ name: `${this.aseid.id}-scope` }));
        }
        return this._scope;
    }

    get targetComponent() {
        return this.scope.resolve(TargetComponent)!;
    }

    invokeFeature() {
        return this.call('entityFeature');
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Components — Simple feature (no chaining baseline)
// ──────────────────────────────────────────────────────────────

class SimpleComponent extends A_Component {
    counter: number = 0;

    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'simpleFeature' })
    simpleMethod() {
        this.counter++;
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Components — Single chain (A → B)
// ──────────────────────────────────────────────────────────────

class TargetComponent extends A_Component {
    executed: boolean = false;

    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'targetFeature' })
    targetStep() {
        this.executed = true;
    }
}

class ChainingComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    @A_Feature.Extend({ name: 'chainedFeature' })
    chainStep(
        @A_Inject(A_Caller) caller: A_Component,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const target = scope.resolve(TargetComponent)!;
        feature.chain(target, 'targetFeature', scope);
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Components — Multi-chain (A → B → C)
// ──────────────────────────────────────────────────────────────

class FinalComponent extends A_Component {
    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'finalFeature' })
    finalStep() { }
}

class MiddleComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    @A_Feature.Extend({ name: 'middleFeature' })
    middleStep(
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const final = scope.resolve(FinalComponent)!;
        feature.chain(final, 'finalFeature', scope);
    }
}

class EntryComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    @A_Feature.Extend({ name: 'entryFeature' })
    entryStep(
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const middle = scope.resolve(MiddleComponent)!;
        feature.chain(middle, 'middleFeature', scope);
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Components — Feature with multiple DI parameters
// ──────────────────────────────────────────────────────────────

class ServiceComponentA extends A_Component {
    getValue() { return 42; }
}

class ServiceComponentB extends A_Component {
    getLabel() { return 'bench'; }
}

class HeavyDIComponent extends A_Component {
    @A_Feature.Define({ invoke: true })
    @A_Feature.Extend({ name: 'heavyDIFeature' })
    heavyStep(
        @A_Inject(A_Caller) caller: A_Component,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature,
        @A_Inject(ServiceComponentA) svcA: ServiceComponentA,
        @A_Inject(ServiceComponentB) svcB: ServiceComponentB,
    ) {
        svcA.getValue();
        svcB.getLabel();
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Components — Multiple extensions converging + chain
// ──────────────────────────────────────────────────────────────

class ExtStepA extends A_Component {
    @A_Feature.Extend({ name: 'convergentFeature' })
    stepA() { }
}

class ExtStepB extends A_Component {
    @A_Feature.Extend({ name: 'convergentFeature' })
    stepB() { }
}

class ExtStepC extends A_Component {
    @A_Feature.Extend({ name: 'convergentFeature' })
    stepC() { }
}

class ConvergentComponent extends A_Component {
    @A_Feature.Define({ invoke: false })
    @A_Feature.Extend({ name: 'convergentFeature' })
    convergentStep(
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const target = scope.resolve(TargetComponent)!;
        feature.chain(target, 'targetFeature', scope);
    }
}


// ──────────────────────────────────────────────────────────────
// Fixture: Entity-driven feature chaining
// ──────────────────────────────────────────────────────────────

class EntityFeatureComponent extends A_Component {
    @A_Feature.Extend({
        name: 'entityFeature',
        scope: [BenchEntity]
    })
    entityStep(
        @A_Inject(A_Caller) entity: BenchEntity,
        @A_Inject(A_Scope) scope: A_Scope,
        @A_Inject(A_Feature) feature: A_Feature
    ) {
        const target = entity.scope.resolve(TargetComponent);
        if (target) {
            feature.chain(target, 'targetFeature', scope);
        }
    }
}


// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runFeatureChainingBenchmarks(): Promise<BenchResult[]> {
    const allResults: BenchResult[] = [];

    // ── Suite 1: Entity + Scope Allocation ──────────────────
    const entityResults = await createSuite('Entity & Scope — Allocation', (suite) => {
        suite
            .add('new A_Entity()', () => {
                new BenchEntity();
            })
            .add('new A_Scope (empty)', () => {
                new A_Scope({ name: 'empty' });
            })
            .add('new A_Scope (3 components)', () => {
                new A_Scope({
                    name: 'with-components',
                    components: [SimpleComponent, TargetComponent, ChainingComponent]
                });
            })
            .add('new A_Scope (5 components)', () => {
                new A_Scope({
                    name: 'with-5-components',
                    components: [SimpleComponent, TargetComponent, ChainingComponent, ServiceComponentA, ServiceComponentB]
                });
            })
            .add('A_Context.allocate + deallocate', () => {
                const entity = new BenchEntity();
                A_Context.allocate(entity, new A_Scope({ name: 'alloc-bench' }));
                A_Context.deallocate(entity);
            });
    });
    allResults.push(...entityResults);

    // ── Suite 2: Scope Registration & Resolution ────────────
    const regResults = await createSuite('Scope — Registration & Resolution', (suite) => {
        suite
            .add('register entity into scope', () => {
                const scope = new A_Scope({ name: 'reg-bench', components: [TargetComponent] });
                const entity = new BenchEntity();
                scope.register(entity);
            })
            .add('resolve component — flat scope', () => {
                const scope = new A_Scope({
                    name: 'resolve-bench',
                    components: [SimpleComponent, TargetComponent, ChainingComponent]
                });
                scope.resolve(TargetComponent);
            })
            .add('resolve component — nested 2 levels', () => {
                const parent = new A_Scope({ name: 'parent', components: [TargetComponent] });
                const child = new A_Scope({ name: 'child', components: [SimpleComponent] });
                child.inherit(parent);
                child.resolve(TargetComponent);
            })
            .add('resolve component — nested 3 levels', () => {
                const grandparent = new A_Scope({ name: 'gp', components: [TargetComponent] });
                const parent = new A_Scope({ name: 'p', components: [ChainingComponent] });
                const child = new A_Scope({ name: 'c', components: [SimpleComponent] });
                parent.inherit(grandparent);
                child.inherit(parent);
                child.resolve(TargetComponent);
            });
    });
    allResults.push(...regResults);

    // ── Suite 3: Feature Call — Baseline (no chain) ─────────
    const baselineResults = await createSuite('Feature Call — Baseline (no chain)', (suite) => {
        const scope1 = new A_Scope({ name: 'base-1', components: [SimpleComponent] });
        const comp1 = scope1.resolve(SimpleComponent)!;

        const scope3 = new A_Scope({
            name: 'base-3',
            components: [SimpleComponent, TargetComponent, ChainingComponent]
        });
        const comp3 = scope3.resolve(SimpleComponent)!;

        suite
            .add('component.call (1 component in scope)', () => {
                comp1.call('simpleFeature');
            })
            .add('component.call (3 components in scope)', () => {
                comp3.call('simpleFeature');
            });
    });
    allResults.push(...baselineResults);

    // ── Suite 4: Feature Chaining — Single Chain (A → B) ────
    const singleChainResults = await createSuite('Feature Chaining — Single (A → B)', (suite) => {
        const scope = new A_Scope({
            name: 'single-chain',
            components: [ChainingComponent, TargetComponent]
        });
        const chaining = scope.resolve(ChainingComponent)!;

        suite
            .add('chain: A → B (resolve + chain + execute)', () => {
                chaining.call('chainedFeature');
            });
    });
    allResults.push(...singleChainResults);

    // ── Suite 5: Feature Chaining — Double Chain (A → B → C)
    const doubleChainResults = await createSuite('Feature Chaining — Double (A → B → C)', (suite) => {
        const scope = new A_Scope({
            name: 'double-chain',
            components: [EntryComponent, MiddleComponent, FinalComponent]
        });
        const entry = scope.resolve(EntryComponent)!;

        suite
            .add('chain: A → B → C (2-hop)', () => {
                entry.call('entryFeature');
            });
    });
    allResults.push(...doubleChainResults);

    // ── Suite 6: Dependency Injection Overhead ──────────────
    const diResults = await createSuite('Dependency Injection — @A_Inject Cost', (suite) => {
        // 0 DI params (baseline)
        const scopeNoDI = new A_Scope({ name: 'no-di', components: [SimpleComponent] });
        const compNoDI = scopeNoDI.resolve(SimpleComponent)!;

        // 3 DI params (Caller, Scope, Feature) + chain
        const scopeDI3 = new A_Scope({
            name: 'di-3',
            components: [ChainingComponent, TargetComponent]
        });
        const compDI3 = scopeDI3.resolve(ChainingComponent)!;

        // 5 DI params (Caller, Scope, Feature, ServiceA, ServiceB)
        const scopeDI5 = new A_Scope({
            name: 'di-5',
            components: [HeavyDIComponent, ServiceComponentA, ServiceComponentB]
        });
        const compDI5 = scopeDI5.resolve(HeavyDIComponent)!;

        suite
            .add('@A_Inject: 0 params (no DI)', () => {
                compNoDI.call('simpleFeature');
            })
            .add('@A_Inject: 3 params (Caller+Scope+Feature)', () => {
                compDI3.call('chainedFeature');
            })
            .add('@A_Inject: 5 params (Caller+Scope+Feature+2 svc)', () => {
                compDI5.call('heavyDIFeature');
            });
    });
    allResults.push(...diResults);

    // ── Suite 7: Chain + Multiple Extensions ────────────────
    const convergentResults = await createSuite('Chain + Extensions — Convergent Pipeline', (suite) => {
        // Chain with 1 extension
        const scope1 = new A_Scope({
            name: 'conv-1',
            components: [ConvergentComponent, TargetComponent, ExtStepA]
        });
        const conv1 = scope1.resolve(ConvergentComponent)!;

        // Chain with 3 extensions
        const scope3 = new A_Scope({
            name: 'conv-3',
            components: [ConvergentComponent, TargetComponent, ExtStepA, ExtStepB, ExtStepC]
        });
        const conv3 = scope3.resolve(ConvergentComponent)!;

        suite
            .add('chain + 1 extension step', () => {
                conv1.call('convergentFeature');
            })
            .add('chain + 3 extension steps', () => {
                conv3.call('convergentFeature');
            });
    });
    allResults.push(...convergentResults);

    // ── Suite 8: Entity-driven Full Pipeline ────────────────
    const entityPipelineResults = await createSuite('Entity Pipeline — Full Realistic Flow', (suite) => {
        // Warm entity (scope and components already allocated)
        const rootScope = new A_Scope({
            name: 'entity-root',
            components: [EntityFeatureComponent, TargetComponent]
        });
        const warmEntity = new BenchEntity();
        rootScope.register(warmEntity);

        suite
            .add('entity.call → DI → chain (warm)', () => {
                warmEntity.invokeFeature();
            })
            .add('new entity + register + call + chain (cold)', () => {
                const e = new BenchEntity();
                const s = new A_Scope({
                    name: 'cold-scope',
                    components: [EntityFeatureComponent, TargetComponent]
                });
                s.register(e);
                e.invokeFeature();
            });
    });
    allResults.push(...entityPipelineResults);

    // ── Suite 9: Scope Depth Impact on Chain Resolution ─────
    const depthResults = await createSuite('Scope Depth — Impact on Chain Resolution', (suite) => {
        // Flat: all in one scope
        const flatScope = new A_Scope({
            name: 'flat-all',
            components: [ChainingComponent, TargetComponent]
        });
        const flatComp = flatScope.resolve(ChainingComponent)!;

        // 2-level: target in parent
        const parentScope2 = new A_Scope({ name: 'depth2-parent', components: [TargetComponent] });
        const childScope2 = new A_Scope({ name: 'depth2-child', components: [ChainingComponent] });
        childScope2.inherit(parentScope2);
        const depth2Comp = childScope2.resolve(ChainingComponent)!;

        // 3-level: target in grandparent
        const gpScope = new A_Scope({ name: 'depth3-gp', components: [TargetComponent] });
        const pScope = new A_Scope({ name: 'depth3-p', components: [] });
        const cScope = new A_Scope({ name: 'depth3-c', components: [ChainingComponent] });
        pScope.inherit(gpScope);
        cScope.inherit(pScope);
        const depth3Comp = cScope.resolve(ChainingComponent)!;

        suite
            .add('chain — flat scope (depth 0)', () => {
                flatComp.call('chainedFeature');
            })
            .add('chain — nested scope (depth 2)', () => {
                depth2Comp.call('chainedFeature');
            })
            .add('chain — nested scope (depth 3)', () => {
                depth3Comp.call('chainedFeature');
            });
    });
    allResults.push(...depthResults);

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
