import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Caller } from '@adaas/a-concept/a-caller';
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Entity } from "@adaas/a-concept/a-entity";

jest.retryTimes(0);

/**
 * Two classes of the same name in one process — e.g. two versions of a
 * package loaded by a long-running host — are different components: each
 * scope runs the steps of the class it has.
 */
describe('A-Scope — classes of the same name', () => {

    class Turn extends A_Entity {
        log: string[] = [];
    }

    /** One "version" of a package: a component named `Responder` extending `respond`. */
    function version(tag: string) {
        const Responder = class Responder extends A_Component {
            respond(turn: Turn) {
                turn.log.push(tag);
            }
        };
        // What the decorators do (class expressions take no parameter decorators).
        A_Inject(A_Caller)(Responder.prototype, 'respond', 0);
        A_Feature.Extend({ name: 'respond' })(Responder.prototype, 'respond', Object.getOwnPropertyDescriptor(Responder.prototype, 'respond')!);
        return Responder;
    }

    it('each scope runs its own version, also after the other version ran', async () => {
        const V1 = version('v1');
        const V2 = version('v2');
        expect(V1.name).toBe(V2.name);

        const first = new Turn();
        const second = new Turn();
        const one = new A_Scope({ name: 'One', components: [V1], entities: [first] });
        const two = new A_Scope({ name: 'Two', components: [V2], entities: [second] });

        await first.call('respond', one);
        await second.call('respond', two);
        await first.call('respond', one);

        expect(first.log).toEqual(['v1', 'v1']);
        expect(second.log).toEqual(['v2']);
        expect(one.fingerprint).not.toBe(two.fingerprint);
    });
});
