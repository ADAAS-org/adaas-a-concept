import { A_Command } from "@adaas/a-concept/global/A-Command/A-Command.class";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A_Concept.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";


jest.retryTimes(0);

describe('A-Concept tests', () => {

    it('Should Allow to create a concept', async () => {
        const concept = new A_Concept({ name: 'TestConcept' });
        expect(concept).toBeInstanceOf(A_Concept);
        expect(concept.Scope).toBeDefined();
        expect(concept.Scope).toBeInstanceOf(A_Scope);
    });
    it('Should allow to load a concept', async () => {
        const concept = new A_Concept({ name: 'TestConcept' });
        await concept.load();
    });
    it('Should allow to run concept abstractions', async () => {
        const concept = new A_Concept({ name: 'TestConcept' });
        await concept.load();
        await concept.start();
        await concept.deploy();
        await concept.build();
        await concept.publish();
        await concept.stop();
    });
    it('Should allow to provide all base entities to the concept', async () => {
        A_Context.reset();

        class MyCommand extends A_Command { }
        class MyEntity extends A_Entity { }
        class MyComponent extends A_Component { }
        class MyContainer extends A_Container { }
        class MyContext extends A_Fragment { }

        const concept = new A_Concept({
            name: 'TestConcept',
            commands: [MyCommand],
            entities: [new MyEntity()],
            components: [MyComponent],
            containers: [new MyContainer({ name: 'test' })],
            fragments: [new MyContext({ name: 'test' })]
        });


        expect(concept.Scope.resolveConstructor('MyCommand')).toBe(MyCommand);
        expect(concept.Scope.resolve(MyEntity)).toBeInstanceOf(MyEntity);
        expect(concept.Scope.resolve(MyComponent)).toBeInstanceOf(MyComponent);
        expect(concept.Scope.resolve(MyContext)).toBeInstanceOf(MyContext);
    });
    it('Should allow to separate entities by containers', async () => {
        A_Context.reset();

        class MyCommandA extends A_Command { }
        class MyCommandB extends A_Command { }
        class MyComponentA extends A_Component { }
        class MyComponentB extends A_Component { }
        class MyContainer extends A_Container { }
        class MyContext extends A_Fragment { }

        const containerA = new MyContainer({
            name: 'test',
            commands: [MyCommandA],
            components: [MyComponentA]

        });

        const containerB = new MyContainer({
            name: 'test2',
            commands: [MyCommandB],
            components: [MyComponentB]
        })

        const sharedContext = new MyContext({ name: 'test' })

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                containerA,
                containerB

            ],
            fragments: [sharedContext]
        });

        const containerAScope = A_Context.scope(containerA)
        const containerBScope = A_Context.scope(containerB)

        expect(containerAScope.resolveConstructor('MyCommandA')).toBe(MyCommandA);
        expect(() => {
            containerAScope.resolveConstructor('MyCommandB');
        }).toThrow();

        expect(containerBScope.resolveConstructor('MyCommandB')).toBe(MyCommandB);
        expect(() => {
            containerBScope.resolveConstructor('MyCommandA');
        }).toThrow();

        expect(concept.Scope.resolve(MyContext)).toEqual(sharedContext);
        expect(concept.Scope.resolve(MyContext)).toEqual(sharedContext);
    });

});