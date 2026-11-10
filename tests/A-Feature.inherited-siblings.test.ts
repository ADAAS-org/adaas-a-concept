import { A_Component } from "@adaas/a-concept/a-component";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Entity } from "@adaas/a-concept/a-entity";

/**
 * C-2 (open): a step declared on a base component runs once per registered subclass. Today, with two undecorated
 * subclasses of the base in one scope, the step is collected once (bound to the base) and runs for only the first
 * subclass found. Workaround in apps: each subclass declares its own step. Remove `.failing` when fixed.
 */
describe('A_Feature: an inherited step with sibling subclasses (C-2)', () => {
    it.failing('runs the step of every subclass in the scope', async () => {
        const ran: string[] = [];

        class Trigger extends A_Entity {
            async fire() { await this.call('c2Feature'); }
        }

        class BaseStep extends A_Component {
            @A_Feature.Extend({ name: 'c2Feature', scope: [Trigger] })
            step() { ran.push(this.constructor.name); }
        }
        class FirstStep extends BaseStep { }
        class SecondStep extends BaseStep { }

        const scope = new A_Scope({ name: 'C2Scope', components: [FirstStep, SecondStep] });
        const trigger = new Trigger({ name: 'trigger' });
        scope.register(trigger);
        await trigger.fire();

        expect(ran.sort()).toEqual(['FirstStep', 'SecondStep']);
    });
});
