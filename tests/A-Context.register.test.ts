import { A_Component } from "@adaas/a-concept/a-component";
import { A_Context } from '@adaas/a-concept/a-context';
import { A_ContextError } from '@adaas/a-concept/a-context';
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Error } from "@adaas/a-concept/a-error";
import { A_Fragment } from '@adaas/a-concept/a-fragment';
import { A_Scope } from "@adaas/a-concept/a-scope";
import { ASEID } from '@adaas/a-concept/aseid';

jest.retryTimes(0);

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

class FixtureFragment extends A_Fragment { }
class FixtureComponent extends A_Component { }
class FixtureError extends A_Error { }

class FixtureEntity extends A_Entity<{ name: string }> {
    public name!: string;
    fromNew(props: { name: string }): void {
        this.aseid = new ASEID({
            concept: 'default',
            scope: 'default',
            entity: 'fixture-entity',
            id: `${props.name}-${Math.floor(Math.random() * 1_000_000_000)}`,
        });
        this.name = props.name;
    }
}

// ──────────────────────────────────────────────────────────────────────────────
// Strict-ownership invariant: one instance per scope, ever.
//
// Reasoning (verbatim from product owner):
//   "one fragment can't be registered in 2 scopes at the same time. If
//    instances (entity, component, fragment, or error) are registered in
//    a particular scope, they are strictly tight to it. To pass through
//    we have the possibility to import/inherit scopes, so we don't need
//    to create duplicates and can keep the inheritance chain. However it
//    should be possible to register 2 instances of the same fragment
//    type in 2 scopes — once per each scope."
//
// These tests pin that behavior at the A_Context boundary, which is the
// single chokepoint every scope routes through.
// ──────────────────────────────────────────────────────────────────────────────

describe('A_Context strict ownership: an instance belongs to exactly one scope', () => {

    describe('A_Context.has', () => {
        it('returns false for an instance that was never registered', () => {
            const fragment = new FixtureFragment();
            expect(A_Context.has(fragment)).toBe(false);
        });

        it('returns true after the instance is registered in a scope', () => {
            const scope = new A_Scope({ name: 'has-true' });
            const fragment = new FixtureFragment();
            scope.register(fragment);
            try {
                expect(A_Context.has(fragment)).toBe(true);
            } finally {
                scope.destroy();
            }
        });

        it('returns false again after the owning scope is destroyed', () => {
            const scope = new A_Scope({ name: 'has-after-destroy' });
            const fragment = new FixtureFragment();
            scope.register(fragment);
            scope.destroy();
            expect(A_Context.has(fragment)).toBe(false);
        });

        it('returns false for null/undefined without throwing', () => {
            expect(A_Context.has(null as any)).toBe(false);
            expect(A_Context.has(undefined as any)).toBe(false);
        });
    });

    describe('cross-scope re-registration THROWS for every instance kind', () => {

        it('Fragment: same instance into a second scope throws ComponentAlreadyRegisteredInOtherScopeError', () => {
            const scopeA = new A_Scope({ name: 'frag-A' });
            const scopeB = new A_Scope({ name: 'frag-B' });
            const fragment = new FixtureFragment();

            scopeA.register(fragment);

            try {
                expect(() => scopeB.register(fragment)).toThrow(
                    /already registered in scope "frag-A"/,
                );

                // Ownership did NOT change — scopeA still owns it.
                expect(A_Context.scope(fragment)).toBe(scopeA);
                expect(scopeA.resolve(FixtureFragment)).toBe(fragment);

                // scopeB never absorbed the fragment because register threw
                // BEFORE A_Context.set; allowedFragments should not show
                // it either at runtime since the local Map.set never ran.
                expect(scopeB.fragments).toEqual([]);
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });

        it('Component: same instance into a second scope throws', () => {
            const scopeA = new A_Scope({ name: 'comp-A' });
            const scopeB = new A_Scope({ name: 'comp-B' });
            const component = new FixtureComponent();

            scopeA.register(component);

            try {
                expect(() => scopeB.register(component)).toThrow(
                    A_ContextError.ComponentAlreadyRegisteredInOtherScopeError,
                );

                expect(A_Context.scope(component)).toBe(scopeA);
                expect(scopeA.resolve(FixtureComponent)).toBe(component);
                expect(scopeB.components).toEqual([]);
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });

        it('Entity: same instance into a second scope throws', () => {
            const scopeA = new A_Scope({ name: 'ent-A' });
            const scopeB = new A_Scope({ name: 'ent-B' });
            const entity = new FixtureEntity({ name: 'alpha' });

            scopeA.register(entity);

            try {
                expect(() => scopeB.register(entity)).toThrow(
                    A_ContextError.ComponentAlreadyRegisteredInOtherScopeError,
                );

                expect(A_Context.scope(entity)).toBe(scopeA);
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });

        it('Error: same instance into a second scope throws', () => {
            const scopeA = new A_Scope({ name: 'err-A' });
            const scopeB = new A_Scope({ name: 'err-B' });
            const err = new FixtureError('test error');

            scopeA.register(err);

            try {
                expect(() => scopeB.register(err)).toThrow(
                    A_ContextError.ComponentAlreadyRegisteredInOtherScopeError,
                );

                expect(A_Context.scope(err as any)).toBe(scopeA);
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });

        it('The thrown error message names the original owning scope', () => {
            const ownerScope = new A_Scope({ name: 'the-original-owner' });
            const intruderScope = new A_Scope({ name: 'the-intruder' });
            const fragment = new FixtureFragment();

            ownerScope.register(fragment);

            try {
                expect(() => intruderScope.register(fragment))
                    .toThrow(/already registered in scope "the-original-owner"/);
            } finally {
                ownerScope.destroy();
                intruderScope.destroy();
            }
        });
    });

    describe('multiple instances of the same type CAN coexist across scopes', () => {

        it('Fragment: two DIFFERENT instances of the same class in two scopes is fine', () => {
            const scopeA = new A_Scope({ name: 'multi-A' });
            const scopeB = new A_Scope({ name: 'multi-B' });
            const fragmentA = new FixtureFragment();
            const fragmentB = new FixtureFragment();

            try {
                expect(() => scopeA.register(fragmentA)).not.toThrow();
                expect(() => scopeB.register(fragmentB)).not.toThrow();

                expect(A_Context.scope(fragmentA)).toBe(scopeA);
                expect(A_Context.scope(fragmentB)).toBe(scopeB);

                // Each scope resolves to its OWN instance — not the other's.
                expect(scopeA.resolve(FixtureFragment)).toBe(fragmentA);
                expect(scopeB.resolve(FixtureFragment)).toBe(fragmentB);
                expect(scopeA.resolve(FixtureFragment))
                    .not.toBe(scopeB.resolve(FixtureFragment));
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });

        it('Component: two DIFFERENT instances of the same class in two scopes is fine', () => {
            const scopeA = new A_Scope({ name: 'multi-comp-A' });
            const scopeB = new A_Scope({ name: 'multi-comp-B' });
            const compA = new FixtureComponent();
            const compB = new FixtureComponent();

            try {
                scopeA.register(compA);
                scopeB.register(compB);

                expect(A_Context.scope(compA)).toBe(scopeA);
                expect(A_Context.scope(compB)).toBe(scopeB);
                expect(scopeA.resolve(FixtureComponent)).toBe(compA);
                expect(scopeB.resolve(FixtureComponent)).toBe(compB);
            } finally {
                scopeA.destroy();
                scopeB.destroy();
            }
        });
    });

    describe('inheritance is the supported sharing mechanism', () => {

        it('Child scope resolves a parent-owned fragment WITHOUT re-registering it', () => {
            const parent = new A_Scope({ name: 'parent-owner' });
            const child = new A_Scope({ name: 'child-borrower' }).inherit(parent);
            const fragment = new FixtureFragment();

            parent.register(fragment);

            try {
                // Resolution walks up the chain — no duplicate registration.
                expect(child.resolve(FixtureFragment)).toBe(fragment);

                // Ownership stays with the parent.
                expect(A_Context.scope(fragment)).toBe(parent);

                // Attempting to re-register into the child still throws.
                expect(() => child.register(fragment)).toThrow(
                    A_ContextError.ComponentAlreadyRegisteredInOtherScopeError,
                );

                // After the failed attempt, parent ownership is intact.
                expect(A_Context.scope(fragment)).toBe(parent);
            } finally {
                child.destroy();
                parent.destroy();
            }
        });

        it('After the original owner is destroyed, the instance can be registered elsewhere', () => {
            const firstOwner = new A_Scope({ name: 'first-owner' });
            const fragment = new FixtureFragment();
            firstOwner.register(fragment);
            firstOwner.destroy();

            // Now the instance is orphaned — a new scope may adopt it.
            const secondOwner = new A_Scope({ name: 'second-owner' });
            try {
                expect(() => secondOwner.register(fragment)).not.toThrow();
                expect(A_Context.scope(fragment)).toBe(secondOwner);
            } finally {
                secondOwner.destroy();
            }
        });
    });

    describe('idempotency: re-registering into the SAME scope does not throw', () => {
        it('Fragment: registering the same instance twice in the same scope is a safe no-op', () => {
            const scope = new A_Scope({ name: 'idempotent' });
            const fragment = new FixtureFragment();

            scope.register(fragment);

            try {
                expect(() => scope.register(fragment)).not.toThrow();
                expect(A_Context.scope(fragment)).toBe(scope);
                expect(scope.resolve(FixtureFragment)).toBe(fragment);
            } finally {
                scope.destroy();
            }
        });
    });
});
