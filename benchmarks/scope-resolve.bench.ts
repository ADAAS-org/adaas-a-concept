/**
 * ============================================================
 *  A_Scope Resolve Operations Performance Benchmarks
 * ============================================================
 *
 * Measures:
 *  - resolve() — single instance resolution (with parent chain traversal)
 *  - resolveConstructor() — constructor lookup by name or type
 *  - resolveAll() — batch resolution across scope hierarchy
 *  - resolveDependency() — full dependency pipeline (filters, pagination)
 *  - has() — existence checking with inheritance
 *  - register() — registration performance
 */
import { A_Component } from "@adaas/a-concept/a-component";
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Fragment } from "@adaas/a-concept/a-fragment";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { createSuite, BenchResult } from './helpers';


// ──────────────────────────────────────────────────────────────
// Fixture Classes
// ──────────────────────────────────────────────────────────────

class ComponentA extends A_Component { }
class ComponentB extends A_Component { }
class ComponentC extends A_Component { }
class ComponentD extends A_Component { }
class ComponentE extends A_Component { }

class BaseComponent extends A_Component { }
class DerivedComponent_A extends BaseComponent { }
class DerivedComponent_B extends BaseComponent { }
class DerivedComponent_C extends DerivedComponent_A { }

class TestEntity extends A_Entity<{ foo: string }> {
    public foo: string = 'default';

    fromNew(params: { foo: string }) {
        this.aseid = this.generateASEID();
        this.foo = params.foo;
    }
}

class TestFragment extends A_Fragment { }


// ──────────────────────────────────────────────────────────────
// Benchmark Suites
// ──────────────────────────────────────────────────────────────

export async function runScopeResolveBenchmarks(): Promise<BenchResult[]> {
    const allResults: BenchResult[] = [];

    // Suite 1: resolve() — single instance
    const resolveResults = await createSuite('A_Scope.resolve — Single Instance', (suite) => {
        // Flat scope
        const flatScope = new A_Scope({
            name: 'FlatScope',
            components: [ComponentA, ComponentB, ComponentC, ComponentD, ComponentE]
        });

        // Nested scopes (3 levels)
        const grandParent = new A_Scope({ name: 'GrandParent', components: [ComponentA] });
        const parent = new A_Scope({ name: 'Parent', components: [ComponentB] });
        const child = new A_Scope({ name: 'Child', components: [ComponentC] });
        child.inherit(parent);
        parent.inherit(grandParent);

        suite
            .add('resolve (flat, first component)', () => {
                flatScope.resolve(ComponentA);
            })
            .add('resolve (flat, last component)', () => {
                flatScope.resolve(ComponentE);
            })
            .add('resolve (nested, found in current)', () => {
                child.resolve(ComponentC);
            })
            .add('resolve (nested, found in parent)', () => {
                child.resolve(ComponentB);
            })
            .add('resolve (nested, found in grandparent)', () => {
                child.resolve(ComponentA);
            })
            .add('resolve (not found)', () => {
                flatScope.resolve(DerivedComponent_C);
            });
    });
    allResults.push(...resolveResults);

    // Suite 2: resolveConstructor()
    const constructorResults = await createSuite('A_Scope.resolveConstructor', (suite) => {
        const scope = new A_Scope({
            name: 'ConstructorScope',
            components: [ComponentA, DerivedComponent_A, DerivedComponent_B]
        });

        suite
            .add('resolveConstructor (by class ref)', () => {
                scope.resolveConstructor(ComponentA);
            })
            .add('resolveConstructor (by PascalCase name)', () => {
                scope.resolveConstructor<ComponentA>('ComponentA');
            })
            .add('resolveConstructor (inherited class)', () => {
                scope.resolveConstructor(BaseComponent);
            })
            .add('resolveConstructor (not found)', () => {
                scope.resolveConstructor<ComponentE>('ComponentE');
            });
    });
    allResults.push(...constructorResults);

    // Suite 3: has() — existence checks
    const hasResults = await createSuite('A_Scope.has — Existence Check', (suite) => {
        const parentScope = new A_Scope({
            name: 'ParentScope',
            components: [ComponentA, ComponentB]
        });
        const childScope = new A_Scope({
            name: 'ChildScope',
            components: [ComponentC, ComponentD]
        });
        childScope.inherit(parentScope);

        suite
            .add('has (found in current scope)', () => {
                childScope.has(ComponentC);
            })
            .add('has (found in parent scope)', () => {
                childScope.has(ComponentA);
            })
            .add('has (not found anywhere)', () => {
                childScope.has(ComponentE);
            })
            .add('has (by inheritance)', () => {
                const scope = new A_Scope({
                    name: 'InheritScope',
                    components: [DerivedComponent_A]
                });
                scope.has(BaseComponent);
            });
    });
    allResults.push(...hasResults);

    // Suite 4: resolveAll() — batch resolution
    const resolveAllResults = await createSuite('A_Scope.resolveAll — Batch Resolution', (suite) => {
        const scope = new A_Scope({
            name: 'BatchScope',
            components: [DerivedComponent_A, DerivedComponent_B, DerivedComponent_C, ComponentE]
        });

        // Scope with entities
        const entityScope = new A_Scope({ name: 'EntityScope' });
        entityScope.register(TestEntity);
        for (let i = 0; i < 20; i++) {
            entityScope.register(new TestEntity({ foo: `val${i}` }));
        }

        // Nested scopes for resolveAll
        const parentBatch = new A_Scope({
            name: 'ParentBatch',
            components: [DerivedComponent_A]
        });
        const childBatch = new A_Scope({
            name: 'ChildBatch',
            components: [DerivedComponent_B, DerivedComponent_C]
        });
        childBatch.inherit(parentBatch);

        suite
            .add('resolveAll (4 components, base class)', () => {
                scope.resolveAll(BaseComponent);
            })
            .add('resolveAll (20 entities)', () => {
                entityScope.resolveAll(TestEntity);
            })
            .add('resolveAll (nested scope)', () => {
                childBatch.resolveAll(BaseComponent);
            });
    });
    allResults.push(...resolveAllResults);

    // Suite 5: resolveDependency() — full pipeline
    const depResults = await createSuite('A_Scope.resolveDependency — Full Pipeline', (suite) => {
        const scope = new A_Scope({
            name: 'DepScope',
            components: [ComponentA, ComponentB, ComponentC]
        });

        const entityScope = new A_Scope({ name: 'EntityDepScope' });
        entityScope.register(TestEntity);
        for (let i = 0; i < 10; i++) {
            entityScope.register(new TestEntity({ foo: i < 5 ? 'bar' : 'baz' }));
        }

        const simpleDep = new A_Dependency(ComponentA);
        const queryDep = new A_Dependency(TestEntity, { query: { foo: 'baz' } });
        const paginatedDep = new A_Dependency(TestEntity, { pagination: { count: 5 } });

        suite
            .add('resolveDependency (simple)', () => {
                scope.resolveDependency(simpleDep);
            })
            .add('resolveDependency (with query)', () => {
                entityScope.resolveDependency(queryDep);
            })
            .add('resolveDependency (with pagination)', () => {
                entityScope.resolveDependency(paginatedDep);
            });
    });
    allResults.push(...depResults);

    // Suite 6: register() performance
    const registerResults = await createSuite('A_Scope.register — Registration', (suite) => {
        suite
            .add('register component (class)', () => {
                const scope = new A_Scope({ name: 'RegScope' });
                scope.register(ComponentA);
            })
            .add('register entity (instance)', () => {
                const scope = new A_Scope({ name: 'RegScope' });
                scope.register(new TestEntity({ foo: 'test' }));
            })
            .add('register 5 components', () => {
                const scope = new A_Scope({ name: 'RegScope' });
                scope.register(ComponentA);
                scope.register(ComponentB);
                scope.register(ComponentC);
                scope.register(ComponentD);
                scope.register(ComponentE);
            });
    });
    allResults.push(...registerResults);

    return allResults;
}


// Run standalone
if (require.main === module) {
    runScopeResolveBenchmarks().catch(console.error);
}
