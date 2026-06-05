import { A_Component } from "@adaas/a-concept/a-component";
import { A_Context } from "@adaas/a-concept/a-context";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_Error } from "@adaas/a-concept/a-error";
import {
    A_Feature,
    A_FeatureError,
    A_FeatureInterruption,
    A_TYPES__FeatureState,
} from "@adaas/a-concept/a-feature";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_StageError } from "@adaas/a-concept/a-stage";

jest.retryTimes(0);

// ──────────────────────────────────────────────────────────────────────────────
// Fixtures
// ──────────────────────────────────────────────────────────────────────────────

class DomainError extends A_Error {
    static readonly Kind = 'domain-thing-broke';
}

class MissingDep extends A_Component { }

class FailingComponent extends A_Component {
    failsSync(): void {
        throw new DomainError(DomainError.Kind, 'sync handler failed');
    }
    async failsAsync(): Promise<void> {
        throw new DomainError(DomainError.Kind, 'async handler failed');
    }
}

class ChainedFailure extends A_Component {
    // Throws a layered A_Error so we can verify the chain is preserved
    // (no root-collapse) at every wrap point.
    throwLayered(): void {
        const root = new DomainError(DomainError.Kind, 'root cause');
        const middle = new A_Error({
            title: 'mid layer',
            description: 'wrapped once',
            originalError: root,
        });
        throw middle;
    }
}

class NeedsMissingDep extends A_Component {
    // `@A_Dependency.Required()` forces resolution failure when MissingDep
    // is not registered — without it, scope.resolve auto-instantiates a
    // default A_Component subclass and the failure path never triggers.
    needsMissing(
        @A_Dependency.Required()
        @A_Inject(MissingDep) _m: MissingDep,
    ): void { /* unused */ }
}

// ──────────────────────────────────────────────────────────────────────────────
// PR1 — bugfixes (single-instance error, sync/async symmetry, typed arg-resolution)
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Feature error handling: PR1 invariants', () => {

    describe('createStageError no longer double-wraps', () => {
        it('feature.error and the thrown error are the SAME instance for sync handlers', async () => {
            const scope = new A_Scope({ name: 'pr1-sync-identity' });
            const comp = new FailingComponent();
            scope.register(comp);

            const feature = new A_Feature({
                name: 'sync-id',
                scope,
                template: [{
                    name: 'failing-sync',
                    dependency: new A_Dependency(FailingComponent),
                    handler: 'failsSync',
                }],
            });

            let thrown: unknown;
            try {
                await feature.process(scope);
            } catch (err) {
                thrown = err;
            }

            expect(thrown).toBeInstanceOf(A_FeatureError);
            expect(feature.state).toBe(A_TYPES__FeatureState.FAILED);
            // Identity check — was previously two distinct instances.
            expect(feature.error).toBe(thrown);

            scope.destroy();
        });

        it('feature.error and the thrown error are the SAME instance for async handlers', async () => {
            const scope = new A_Scope({ name: 'pr1-async-identity' });
            const comp = new FailingComponent();
            scope.register(comp);

            const feature = new A_Feature({
                name: 'async-id',
                scope,
                template: [{
                    name: 'failing-async',
                    dependency: new A_Dependency(FailingComponent),
                    handler: 'failsAsync',
                }],
            });

            let thrown: unknown;
            try {
                await feature.process(scope);
            } catch (err) {
                thrown = err;
            }

            expect(thrown).toBeInstanceOf(A_FeatureError);
            expect(feature.error).toBe(thrown);

            scope.destroy();
        });
    });

    describe('sync vs. async handler errors produce equivalent shapes', () => {
        async function runAndCatch(handler: 'failsSync' | 'failsAsync'): Promise<A_FeatureError> {
            const scope = new A_Scope({ name: `pr1-symmetry-${handler}` });
            scope.register(new FailingComponent());
            const feature = new A_Feature({
                name: `symmetry-${handler}`,
                scope,
                template: [{
                    name: `failing-${handler}`,
                    dependency: new A_Dependency(FailingComponent),
                    handler,
                }],
            });
            try {
                await feature.process(scope);
                throw new Error('expected feature to throw');
            } catch (err) {
                scope.destroy();
                return err as A_FeatureError;
            }
        }

        it('both wrap once into A_FeatureError(FeatureProcessingError) with the DomainError as immediate cause', async () => {
            const syncErr = await runAndCatch('failsSync');
            const asyncErr = await runAndCatch('failsAsync');

            for (const err of [syncErr, asyncErr]) {
                expect(err).toBeInstanceOf(A_FeatureError);
                expect(err.title).toBe(A_FeatureError.FeatureProcessingError);
                // Immediate cause: the DomainError thrown by the handler.
                // Previously the async path interposed an extra
                // `new A_Error(...)` wrap that flattened the title.
                expect(err.originalError).toBeInstanceOf(DomainError);
                expect((err.originalError as DomainError).title).toBe(DomainError.Kind);
            }
        });
    });

    describe('arg-resolution failures surface as A_StageError(ArgumentsResolutionError)', () => {
        it('missing @A_Inject dependency produces typed StageError with dep name in description', async () => {
            const scope = new A_Scope({ name: 'pr1-arg-resolution' });
            scope.register(new NeedsMissingDep());

            const feature = new A_Feature({
                name: 'arg-resolution',
                scope,
                template: [{
                    name: 'needs-missing-dep',
                    dependency: new A_Dependency(NeedsMissingDep),
                    handler: 'needsMissing',
                }],
            });

            let thrown: unknown;
            try {
                await feature.process(scope);
            } catch (err) {
                thrown = err;
            }

            expect(thrown).toBeInstanceOf(A_FeatureError);
            const fe = thrown as A_FeatureError;
            // The IMMEDIATE cause is now the typed stage error, not the raw
            // scope resolution error — investigators can see "arg resolution"
            // vs "handler threw" vs "compile error" at a glance.
            expect(fe.originalError).toBeInstanceOf(A_StageError);
            expect((fe.originalError as A_StageError).title)
                .toBe(A_StageError.ArgumentsResolutionError);
            // Description names the dependency target so users can locate
            // the offending @A_Inject() without reading a stack trace.
            expect((fe.originalError as A_StageError).description)
                .toMatch(/MissingDep/);

            scope.destroy();
        });
    });

    describe('A_Error chain is preserved (no root-collapse)', () => {
        it('originalError is the IMMEDIATE cause; rootCause walks to the deepest link', () => {
            const root = new DomainError(DomainError.Kind, 'root');
            const middle = new A_Error({ title: 'middle', originalError: root });
            const top = new A_Error({ title: 'top', originalError: middle });

            // Immediate cause is preserved (was previously collapsed to root).
            expect(top.originalError).toBe(middle);
            expect(middle.originalError).toBe(root);

            // rootCause walks the chain.
            expect(top.rootCause).toBe(root);
            expect(middle.rootCause).toBe(root);
            expect(root.rootCause).toBeUndefined();
        });

        it('chain getter returns the full linked list starting with this', () => {
            const root = new DomainError(DomainError.Kind, 'root');
            const middle = new A_Error({ title: 'middle', originalError: root });
            const top = new A_Error({ title: 'top', originalError: middle });

            expect(top.chain).toEqual([top, middle, root]);
        });

        it('full feature dispatch preserves the chain through the handler', async () => {
            const scope = new A_Scope({ name: 'pr1-chain' });
            scope.register(new ChainedFailure());
            const feature = new A_Feature({
                name: 'chain-test',
                scope,
                template: [{
                    name: 'throw-layered',
                    dependency: new A_Dependency(ChainedFailure),
                    handler: 'throwLayered',
                }],
            });

            let thrown: unknown;
            try {
                await feature.process(scope);
            } catch (err) {
                thrown = err;
            }

            const fe = thrown as A_FeatureError;
            expect(fe).toBeInstanceOf(A_FeatureError);

            // FeatureError → mid-layer A_Error → DomainError root.
            expect(fe.originalError).toBeInstanceOf(A_Error);
            expect((fe.originalError as A_Error).title).toBe('mid layer');
            expect(fe.rootCause).toBeInstanceOf(DomainError);
            expect((fe.rootCause as DomainError).title).toBe(DomainError.Kind);

            scope.destroy();
        });
    });
});


// ──────────────────────────────────────────────────────────────────────────────
// PR2 — structured fields, A_FeatureInterruption, Caused-by stack, toJSON
// ──────────────────────────────────────────────────────────────────────────────

describe('A-Feature error handling: PR2 enhancements', () => {

    describe('A_FeatureError exposes structured stage context', () => {
        it('featureName / stageName / handler / component are populated from the live stage', async () => {
            const scope = new A_Scope({ name: 'pr2-struct' });
            scope.register(new FailingComponent());

            const feature = new A_Feature({
                name: 'struct-feature',
                scope,
                template: [{
                    name: 'failing-sync',
                    dependency: new A_Dependency(FailingComponent),
                    handler: 'failsSync',
                }],
            });

            let fe: A_FeatureError | undefined;
            try {
                await feature.process(scope);
            } catch (err) {
                fe = err as A_FeatureError;
            }

            expect(fe).toBeDefined();
            expect(fe!.featureName).toBe('struct-feature');
            expect(fe!.stageName).toMatch(/A-Stage\(struct-feature/);
            expect(fe!.handler).toBe('failsSync');
            expect(fe!.component).toBe('FailingComponent');
            // The live stage reference is also available for in-process use.
            expect(fe!.stage).toBeDefined();

            scope.destroy();
        });

        it('toJSON includes the structured fields AND the serialized cause chain', async () => {
            const scope = new A_Scope({ name: 'pr2-json' });
            scope.register(new FailingComponent());

            const feature = new A_Feature({
                name: 'json-feature',
                scope,
                template: [{
                    name: 'failing-async',
                    dependency: new A_Dependency(FailingComponent),
                    handler: 'failsAsync',
                }],
            });

            let fe: A_FeatureError | undefined;
            try { await feature.process(scope); } catch (err) { fe = err as A_FeatureError; }

            const json: any = fe!.toJSON();
            expect(json.featureName).toBe('json-feature');
            expect(json.stageName).toMatch(/A-Stage\(json-feature/);
            expect(json.handler).toBe('failsAsync');
            expect(json.component).toBe('FailingComponent');
            // originalError is now a STRUCTURED object (not a plain string)
            // so transports preserve the chain.
            expect(typeof json.originalError).toBe('object');
            expect(json.originalError.title).toBe(DomainError.Kind);

            scope.destroy();
        });

        it('toJSON survives JSON.stringify (no circular refs, no live stage)', async () => {
            const scope = new A_Scope({ name: 'pr2-stringify' });
            scope.register(new FailingComponent());

            const feature = new A_Feature({
                name: 'stringify-feature',
                scope,
                template: [{
                    name: 'failing-sync',
                    dependency: new A_Dependency(FailingComponent),
                    handler: 'failsSync',
                }],
            });

            let fe: A_FeatureError | undefined;
            try { await feature.process(scope); } catch (err) { fe = err as A_FeatureError; }

            // Should not throw "Converting circular structure to JSON".
            expect(() => JSON.stringify(fe!.toJSON())).not.toThrow();

            scope.destroy();
        });
    });

    describe('A_FeatureInterruption is a distinct subclass', () => {
        it('feature.interrupt(reason) yields an A_FeatureInterruption (still an A_FeatureError)', () => {
            const scope = new A_Scope({ name: 'pr2-interrupt' });
            scope.register(new A_Component());
            const feature = new A_Feature({
                name: 'interruptible',
                scope,
                template: [{
                    name: 'noop',
                    dependency: new A_Dependency(A_Component),
                    handler: 'whatever',
                }],
            });

            const err = feature.interrupt('user pressed cancel');

            expect(err).toBeInstanceOf(A_FeatureInterruption);
            // Subclass still satisfies the broader A_FeatureError type guard
            // so existing catch blocks continue to work.
            expect(err).toBeInstanceOf(A_FeatureError);
            expect(feature.state).toBe(A_TYPES__FeatureState.INTERRUPTED);
            // Caller code can now distinguish via instanceof instead of
            // string-matching the error code.
            const isOperatorCancel = err instanceof A_FeatureInterruption;
            expect(isOperatorCancel).toBe(true);

            scope.destroy();
        });

        it('an interruption is NOT caught as a generic A_FeatureError-only check', () => {
            // Documents the discriminator pattern.
            const scope = new A_Scope({ name: 'pr2-interrupt-classify' });
            scope.register(new A_Component());
            const feature = new A_Feature({
                name: 'classify',
                scope,
                template: [{
                    name: 'noop',
                    dependency: new A_Dependency(A_Component),
                    handler: 'whatever',
                }],
            });

            const err = feature.interrupt();

            const classification =
                err instanceof A_FeatureInterruption ? 'interruption' :
                err instanceof A_FeatureError ? 'failure' : 'unknown';

            expect(classification).toBe('interruption');

            scope.destroy();
        });
    });

    describe('Caused-by stack is appended to the wrapper stack', () => {
        it('the wrapper A_Error stack contains the original error stack after a "Caused by:" marker', () => {
            const root = new DomainError(DomainError.Kind, 'with stack');
            const wrapper = new A_Error({
                title: 'wrap',
                description: 'wrapping',
                originalError: root,
            });

            // Only assert when V8-style stacks are available — guard for
            // engines that don't populate `.stack`.
            if (root.stack && wrapper.stack) {
                expect(wrapper.stack).toContain('Caused by:');
                expect(wrapper.stack).toContain(root.stack);
            }
        });

        it('does NOT double-append the same Caused-by block on re-wrap', () => {
            const root = new DomainError(DomainError.Kind, 'no double');
            const a = new A_Error({ title: 'a', originalError: root });
            const b = new A_Error({ title: 'b', originalError: a });

            if (b.stack && root.stack) {
                // The root stack appears exactly once in b's stack even though
                // it transitively chains through `a`.
                const occurrences = b.stack.split(root.stack).length - 1;
                expect(occurrences).toBeLessThanOrEqual(1);
            }
        });
    });
});
