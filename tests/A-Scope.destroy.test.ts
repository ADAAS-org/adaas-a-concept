import { A_Component } from "@adaas/a-concept/a-component";
import { A_Container } from '@adaas/a-concept/a-container';
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Fragment } from '@adaas/a-concept/a-fragment';
import { A_Scope } from "@adaas/a-concept/a-scope";
import { ASEID } from '@adaas/a-concept/aseid';
import { A_Error } from "@adaas/a-concept/a-error";

jest.retryTimes(0);

// ──────────────────────────────────────────────────────────────────────────────
// Shared fixtures
// ──────────────────────────────────────────────────────────────────────────────

class TestComponent extends A_Component { }
class AnotherComponent extends A_Component { }

class TestFragment extends A_Fragment { }
class AnotherFragment extends A_Fragment { }

class TestEntity extends A_Entity<{ name: string }> {
    public name!: string;
    fromNew(props: { name: string }): void {
        this.aseid = new ASEID({
            concept: 'default',
            scope: 'default',
            entity: 'test-entity',
            id: `${props.name}-${Math.floor(Math.random() * 1_000_000_000)}`,
        });
        this.name = props.name;
    }
}

class TestError extends A_Error { }


// ──────────────────────────────────────────────────────────────────────────────
// 1. Destroy clears every kind of registered element
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Scope destroy: registered-element cleanup', () => {

    it('Destroys an empty scope without throwing', () => {
        const scope = new A_Scope({ name: 'Empty' });
        expect(() => scope.destroy()).not.toThrow();
        expect(scope.components).toEqual([]);
        expect(scope.fragments).toEqual([]);
        expect(scope.entities).toEqual([]);
        expect(scope.errors).toEqual([]);
    });

    it('Destroy clears registered components and removes them from A_Context', () => {
        const scope = new A_Scope({ name: 'WithComponent' });
        const component = new TestComponent();
        scope.register(component);

        // Pre-destroy invariants
        expect(scope.resolve(TestComponent)).toBe(component);
        expect(A_Context.scope(component)).toBe(scope);

        scope.destroy();

        // Post-destroy: scope is empty, component is deregistered from A_Context
        expect(scope.components).toEqual([]);
        expect(scope.resolve(TestComponent)).toBeUndefined();
        expect(() => A_Context.scope(component)).toThrow();
    });

    it('Destroy clears registered fragments and removes them from A_Context', () => {
        const scope = new A_Scope({ name: 'WithFragment' });
        const fragment = new TestFragment();
        scope.register(fragment);

        expect(scope.resolve(TestFragment)).toBe(fragment);
        expect(A_Context.scope(fragment)).toBe(scope);

        scope.destroy();

        expect(scope.fragments).toEqual([]);
        expect(scope.resolve(TestFragment)).toBeUndefined();
        expect(() => A_Context.scope(fragment)).toThrow();
    });

    it('Destroy clears registered entities and removes them from A_Context', () => {
        const scope = new A_Scope({ name: 'WithEntity' });
        const entity = new TestEntity({ name: 'first' });
        scope.register(entity);

        expect(scope.resolve(TestEntity)).toBe(entity);
        expect(A_Context.scope(entity)).toBe(scope);

        scope.destroy();

        expect(scope.entities).toEqual([]);
        expect(scope.resolve(TestEntity)).toBeUndefined();
        expect(() => A_Context.scope(entity)).toThrow();
    });

    it('Destroy clears registered errors (no A_Context dereg for errors)', () => {
        const scope = new A_Scope({ name: 'WithError' });
        const error = new TestError('oops');
        scope.register(error);

        expect(scope.errors).toHaveLength(1);
        expect(scope.resolve(TestError)).toBeInstanceOf(TestError);

        scope.destroy();

        expect(scope.errors).toEqual([]);
        expect(scope.resolve(TestError)).toBeUndefined();
    });

    it('Destroy clears a mixed scope (components + fragments + entities + errors)', () => {
        const scope = new A_Scope({ name: 'Mixed' });
        const component = new TestComponent();
        const fragment = new TestFragment();
        const entity = new TestEntity({ name: 'mix' });
        const error = new TestError('mixed');

        scope.register(component);
        scope.register(fragment);
        scope.register(entity);
        scope.register(error);

        scope.destroy();

        expect(scope.components).toEqual([]);
        expect(scope.fragments).toEqual([]);
        expect(scope.entities).toEqual([]);
        expect(scope.errors).toEqual([]);

        expect(() => A_Context.scope(component)).toThrow();
        expect(() => A_Context.scope(fragment)).toThrow();
        expect(() => A_Context.scope(entity)).toThrow();
    });

    it('Destroy clears multiple instances of the same entity class', () => {
        const scope = new A_Scope({ name: 'MultiEntity' });
        const e1 = new TestEntity({ name: 'a' });
        const e2 = new TestEntity({ name: 'b' });
        const e3 = new TestEntity({ name: 'c' });
        scope.register(e1);
        scope.register(e2);
        scope.register(e3);

        expect(scope.entities).toHaveLength(3);

        scope.destroy();

        expect(scope.entities).toEqual([]);
        expect(() => A_Context.scope(e1)).toThrow();
        expect(() => A_Context.scope(e2)).toThrow();
        expect(() => A_Context.scope(e3)).toThrow();
    });

    it('Destroy clears multiple fragments of different classes', () => {
        const scope = new A_Scope({ name: 'MultiFragment' });
        const f1 = new TestFragment();
        const f2 = new AnotherFragment();
        scope.register(f1);
        scope.register(f2);

        expect(scope.fragments).toHaveLength(2);

        scope.destroy();

        expect(scope.fragments).toEqual([]);
        expect(() => A_Context.scope(f1)).toThrow();
        expect(() => A_Context.scope(f2)).toThrow();
    });
});


// ──────────────────────────────────────────────────────────────────────────────
// 2. Inheritance-chain destroy semantics
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Scope destroy: inheritance chain', () => {

    it('Destroying the child does not destroy the parent', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        const parentComp = new TestComponent();
        const childComp = new AnotherComponent();
        parent.register(parentComp);
        child.register(childComp);

        child.destroy();

        // child cleared
        expect(child.components).toEqual([]);
        // parent intact
        expect(parent.components).toEqual([parentComp]);
        expect(parent.resolve(TestComponent)).toBe(parentComp);
        expect(A_Context.scope(parentComp)).toBe(parent);
    });

    it('After child destroy, child no longer subscribes to parent mutations', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        const v0 = (child as any)._version;
        // Sanity: mutating parent bumps child while subscribed.
        parent.register(new TestComponent());
        const v1 = (child as any)._version;
        expect(v1).not.toBe(v0);

        child.destroy();

        const v2 = (child as any)._version;
        // Mutating parent AFTER destroy must NOT bump child.
        parent.register(new AnotherComponent());
        const v3 = (child as any)._version;
        expect(v3).toBe(v2);
    });

    it('Destroying the parent leaves children logically referencing a parent that is now empty', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        const parentComp = new TestComponent();
        parent.register(parentComp);

        // Before destroy: child can resolve via parent.
        expect(child.resolve(TestComponent)).toBe(parentComp);

        parent.destroy();

        // Parent is cleaned out, so the inherited lookup no longer finds it.
        // (parent reference itself may still be held; behavior on resolve must
        //  return undefined, not throw.)
        expect(parent.components).toEqual([]);
        expect(() => child.resolve(TestComponent)).not.toThrow();
        expect(child.resolve(TestComponent)).toBeUndefined();
    });

    it('Three-level chain: sequential destroy bottom-up clears each level', () => {
        const grandparent = new A_Scope({ name: 'Grandparent' });
        const parent = new A_Scope({ name: 'Parent' }).inherit(grandparent);
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        const gpComp = new TestComponent();
        const pComp = new AnotherComponent();
        const cFrag = new TestFragment();

        grandparent.register(gpComp);
        parent.register(pComp);
        child.register(cFrag);

        // Bottom-up destroy
        child.destroy();
        expect(child.components).toEqual([]);
        expect(child.fragments).toEqual([]);
        expect(parent.resolve(AnotherComponent)).toBe(pComp);
        expect(grandparent.resolve(TestComponent)).toBe(gpComp);

        parent.destroy();
        expect(parent.components).toEqual([]);
        expect(grandparent.resolve(TestComponent)).toBe(gpComp);

        grandparent.destroy();
        expect(grandparent.components).toEqual([]);
    });

    it('Three-level chain: sequential destroy top-down does not corrupt children', () => {
        const grandparent = new A_Scope({ name: 'Grandparent' });
        const parent = new A_Scope({ name: 'Parent' }).inherit(grandparent);
        const child = new A_Scope({ name: 'Child' }).inherit(parent);

        const gpComp = new TestComponent();
        const pComp = new AnotherComponent();
        const cFrag = new TestFragment();

        grandparent.register(gpComp);
        parent.register(pComp);
        child.register(cFrag);

        // Top-down destroy
        expect(() => grandparent.destroy()).not.toThrow();
        // Grandparent cleaned, parent intact.
        expect(grandparent.components).toEqual([]);
        expect(parent.components).toEqual([pComp]);
        expect(parent.resolve(AnotherComponent)).toBe(pComp);

        // Child can still resolve its own fragment.
        expect(child.resolve(TestFragment)).toBe(cFrag);

        expect(() => parent.destroy()).not.toThrow();
        expect(parent.components).toEqual([]);
        // Child still alive with its own fragment.
        expect(child.fragments).toEqual([cFrag]);

        expect(() => child.destroy()).not.toThrow();
        expect(child.fragments).toEqual([]);
    });

    it('Two siblings sharing a parent: destroying one does not affect the other', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const a = new A_Scope({ name: 'SiblingA' }).inherit(parent);
        const b = new A_Scope({ name: 'SiblingB' }).inherit(parent);

        const compA = new TestComponent();
        const compB = new AnotherComponent();
        a.register(compA);
        b.register(compB);

        a.destroy();

        expect(a.components).toEqual([]);
        expect(b.components).toEqual([compB]);
        expect(b.resolve(AnotherComponent)).toBe(compB);

        // Mutating parent after siblingA destroyed should still bump siblingB.
        const vB0 = (b as any)._version;
        parent.register(new TestFragment());
        const vB1 = (b as any)._version;
        expect(vB1).not.toBe(vB0);
    });
});


// ──────────────────────────────────────────────────────────────────────────────
// 3. Import / deimport interaction with destroy
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Scope destroy: imports', () => {

    it('Destroying a scope detaches it from imported scopes (no more bumps)', () => {
        const imported = new A_Scope({ name: 'Imported' });
        const consumer = new A_Scope({ name: 'Consumer' });
        consumer.import(imported);

        // sanity: mutating imported bumps consumer
        const v0 = (consumer as any)._version;
        imported.register(new TestComponent());
        const v1 = (consumer as any)._version;
        expect(v1).not.toBe(v0);

        consumer.destroy();

        // imports must be cleared
        expect(consumer.imports).toEqual([]);

        // mutating imported AFTER consumer.destroy() must NOT bump consumer
        const v2 = (consumer as any)._version;
        imported.register(new AnotherComponent());
        const v3 = (consumer as any)._version;
        expect(v3).toBe(v2);
    });

    it('Destroying the imported scope does not crash the importer', () => {
        const imported = new A_Scope({ name: 'Imported' });
        const consumer = new A_Scope({ name: 'Consumer' });
        consumer.import(imported);

        imported.register(new TestComponent());
        expect(consumer.resolve(TestComponent)).toBeInstanceOf(TestComponent);

        expect(() => imported.destroy()).not.toThrow();
        // After import target is destroyed, lookups via import return undefined,
        // not throw.
        expect(() => consumer.resolve(TestComponent)).not.toThrow();
        expect(consumer.resolve(TestComponent)).toBeUndefined();
    });
});


// ──────────────────────────────────────────────────────────────────────────────
// 4. Idempotency / re-use after destroy
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Scope destroy: idempotency & post-destroy behavior', () => {

    it('Calling destroy twice does not throw', () => {
        const scope = new A_Scope({ name: 'Twice' });
        scope.register(new TestComponent());
        expect(() => scope.destroy()).not.toThrow();
        expect(() => scope.destroy()).not.toThrow();
        expect(scope.components).toEqual([]);
    });

    it('A destroyed scope can still register & resolve a brand-new component', () => {
        // This is not necessarily a guaranteed contract, but if destroy() is
        // meant to free children rather than poison the scope, this should work.
        const scope = new A_Scope({ name: 'Reuse' });
        scope.register(new TestComponent());
        scope.destroy();

        const comp = new AnotherComponent();
        expect(() => scope.register(comp)).not.toThrow();
        expect(scope.resolve(AnotherComponent)).toBe(comp);
    });

    it('After destroy A_Context.scope(component) throws for previously-registered component', () => {
        const scope = new A_Scope({ name: 'Probe' });
        const comp = new TestComponent();
        scope.register(comp);

        // Pre: resolves to the scope instance.
        expect(A_Context.scope(comp)).toBe(scope);

        scope.destroy();

        expect(() => A_Context.scope(comp)).toThrow();
    });
});


// ──────────────────────────────────────────────────────────────────────────────
// 5. The specific shape we use in A_Frame *.saveTo / *.loadFrom
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Scope destroy: transient fragment-carrying scope (saveTo pattern)', () => {

    it('A child scope carrying a fragment can be destroyed while the parent component lives', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const component = new TestComponent();
        parent.register(component);

        const fragment = new TestFragment();
        const opScope = new A_Scope({
            name: 'op',
            fragments: [fragment],
        }).inherit(parent);

        // While alive, the child resolves both its own fragment and the
        // parent's component.
        expect(opScope.resolve(TestFragment)).toBe(fragment);
        expect(opScope.resolve(TestComponent)).toBe(component);

        opScope.destroy();

        // Child cleaned out; parent component still resolvable from parent.
        expect(opScope.fragments).toEqual([]);
        expect(parent.resolve(TestComponent)).toBe(component);
        expect(A_Context.scope(component)).toBe(parent);

        // The transient fragment has been deregistered from A_Context.
        expect(() => A_Context.scope(fragment)).toThrow();
    });

    it('Repeated saveTo-style scopes do not pollute the parent across runs', () => {
        const parent = new A_Scope({ name: 'Parent' });
        const component = new TestComponent();
        parent.register(component);

        for (let i = 0; i < 3; i++) {
            const fragment = new TestFragment();
            const op = new A_Scope({
                name: `op-${i}`,
                fragments: [fragment],
            }).inherit(parent);
            try {
                expect(op.resolve(TestFragment)).toBe(fragment);
            } finally {
                op.destroy();
            }
            // Parent must remain pristine — no leaked fragments.
            expect(parent.fragments).toEqual([]);
        }

        // Component still healthy after the churn.
        expect(parent.resolve(TestComponent)).toBe(component);
    });
});
