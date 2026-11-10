import { A_Component } from "@adaas/a-concept/a-component";
import { A_Container } from "@adaas/a-concept/a-container";
import { A_Context } from "@adaas/a-concept/a-context";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Fragment } from "@adaas/a-concept/a-fragment";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Caller } from '@adaas/a-concept/a-caller';
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Entity } from "@adaas/a-concept/a-entity";

jest.retryTimes(0);

/**
 * The feature-template cache is keyed by `featureFingerprint`: what decides a
 * feature's steps (components and container issuers reachable, imports) — not
 * the scope's whole content. Nested scopes that add only entities or fragments
 * (one per rendered node, one per call) reuse their parent's templates.
 */
describe('A-Scope — feature fingerprint', () => {

    class Turn extends A_Entity {
        log: string[] = [];
    }

    class Note extends A_Fragment { }

    class Responder extends A_Component {
        @A_Feature.Extend({ name: 'respond' })
        respond(@A_Inject(A_Caller) turn: Turn) {
            turn.log.push('responder');
        }
    }

    it('a scope adding only entities and fragments shares its parent\'s feature fingerprint', () => {
        const parent = new A_Scope({ name: 'Parent', components: [Responder] });
        const child = new A_Scope({ name: 'Child', entities: [new Turn()], fragments: [new Note()] }).inherit(parent);
        const grandchild = new A_Scope({ name: 'Grandchild', entities: [new Turn()] }).inherit(child);

        expect(child.featureFingerprint).toBe(parent.featureFingerprint);
        expect(grandchild.featureFingerprint).toBe(parent.featureFingerprint);
        expect(child.fingerprint).not.toBe(parent.fingerprint);
    });

    it('nested node scopes reuse one feature template', () => {
        const parent = new A_Scope({ name: 'Parent', components: [Responder] });
        const a = new Turn();
        const b = new Turn();
        const one = new A_Scope({ name: 'One', entities: [a] }).inherit(parent);
        const two = new A_Scope({ name: 'Two', entities: [b] }).inherit(new A_Scope({ name: 'Between', fragments: [new Note()] }).inherit(parent));

        expect(A_Context.featureTemplate('respond', a, one)).toBe(A_Context.featureTemplate('respond', b, two));
    });

    it('a component added to a nested scope changes its feature fingerprint and its steps', async () => {
        const parent = new A_Scope({ name: 'Parent' });
        const turn = new Turn();
        const child = new A_Scope({ name: 'Child', entities: [turn] }).inherit(parent);

        await turn.call('respond', child);
        expect(turn.log).toEqual([]);

        const before = child.featureFingerprint;
        child.register(Responder);
        expect(child.featureFingerprint).not.toBe(before);
        expect(child.featureFingerprint).not.toBe(parent.featureFingerprint);

        await turn.call('respond', child);
        expect(turn.log).toEqual(['responder']);
    });

    it('a component added to the parent reaches the nested scopes', async () => {
        const parent = new A_Scope({ name: 'Parent' });
        const turn = new Turn();
        const child = new A_Scope({ name: 'Child', entities: [turn] }).inherit(parent);

        await turn.call('respond', child);
        parent.register(Responder);
        await turn.call('respond', child);

        expect(turn.log).toEqual(['responder']);
        expect(child.featureFingerprint).toBe(parent.featureFingerprint);
    });

    it('scopes issued by different containers differ', () => {
        class Left extends A_Container { }
        class Right extends A_Container { }
        const left = new Left({ name: 'Left' });
        const right = new Right({ name: 'Right' });

        expect(left.scope.featureFingerprint).not.toBe(right.scope.featureFingerprint);
    });
});
