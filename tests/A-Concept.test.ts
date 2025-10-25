import { A_Caller } from '@adaas/a-concept/global/A-Caller/A_Caller.class';
import './test.setup';
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Concept } from "@adaas/a-concept/global/A-Concept/A-Concept.class";
import { A_Container } from "@adaas/a-concept/global/A-Container/A-Container.class";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Entity_Init, A_TYPES__Entity_Serialized } from '@adaas/a-concept/global/A-Entity/A-Entity.types';
import { A_Fragment } from "@adaas/a-concept/global/A-Fragment/A-Fragment.class";
import { A_Inject } from '@adaas/a-concept/global/A-Inject/A-Inject.decorator';
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Feature } from '@adaas/a-concept/global/A-Feature/A-Feature.class';
import { A_TYPES__EntityFeatures } from '@adaas/a-concept/global/A-Entity/A-Entity.constants';


jest.retryTimes(0);

describe('A-Concept tests', () => {

    it('Should Allow to create a concept', async () => {
        const concept = new A_Concept({ name: 'TestConcept' });
        expect(concept).toBeInstanceOf(A_Concept);
        expect(concept.scope).toBeDefined();
        expect(concept.scope).toBeInstanceOf(A_Scope);
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

        class MyEntityA extends A_Entity { }
        class MyEntity extends A_Entity { }
        class MyComponent extends A_Component { }
        class MyContainer extends A_Container { }
        class MyContext extends A_Fragment { }

        const concept = new A_Concept({
            name: 'TestConcept',
            entities: [new MyEntity(), MyEntityA],
            components: [MyComponent],
            containers: [new MyContainer({ name: 'test' })],
            fragments: [new MyContext({ name: 'test' })]
        });


        expect(concept.scope.resolveConstructor('MyEntityA')).toBe(MyEntityA);
        expect(concept.scope.resolve(MyEntity)).toBeInstanceOf(MyEntity);
        expect(concept.scope.resolve(MyComponent)).toBeInstanceOf(MyComponent);
        expect(concept.scope.resolve(MyContext)).toBeInstanceOf(MyContext);
    });
    it('Should allow to separate entities by containers', async () => {
        A_Context.reset();

        class MyEntityA extends A_Entity { }
        class MyEntityB extends A_Entity { }
        class MyComponentA extends A_Component { }
        class MyComponentB extends A_Component { }
        class MyContainer extends A_Container { }
        class MyContext extends A_Fragment { }

        const containerA = new MyContainer({
            name: 'test',
            entities: [MyEntityA],
            components: [MyComponentA]

        });

        const containerB = new MyContainer({
            name: 'test2',
            entities: [MyEntityB],
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

        expect(containerAScope.resolveConstructor('MyEntityA')).toBe(MyEntityA);
        expect(() => {
            containerAScope.resolveConstructor('MyEntityB');
        }).toThrow();

        expect(containerBScope.resolveConstructor('MyEntityB')).toBe(MyEntityB);
        expect(() => {
            containerBScope.resolveConstructor('MyEntityA');
        }).toThrow();

        expect(concept.scope.resolve(MyContext)).toEqual(sharedContext);
        expect(concept.scope.resolve(MyContext)).toEqual(sharedContext);
    });
    it('Should allow to register multiple containers', async () => {
        A_Context.reset();

        class MyContainerA extends A_Container { }
        class MyContainerB extends A_Container { }

        const containerA = new MyContainerA({ name: 'ContainerA' });
        const containerB = new MyContainerB({ name: 'ContainerB' });

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                containerA,
                containerB
            ]
        });

        expect(containerA.scope.resolve(MyContainerA)).toBeInstanceOf(MyContainerA);
        expect(containerB.scope.resolve(MyContainerB)).toBeInstanceOf(MyContainerB);
    })
    it('Should have different entity behavior depending on the container', async () => {
        A_Context.reset();
        class MyEntityA extends A_Entity { testValue!: string; }

        class ComponentA extends A_Component {
            @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD })
            async createEntityInstance(
                @A_Inject(A_Caller) caller: MyEntityA
            ) {
                caller.testValue = 'ContainerA';
            }
        }

        class ComponentB extends A_Component {
            @A_Feature.Extend({ name: A_TYPES__EntityFeatures.LOAD })
            async createEntityInstance(
                @A_Inject(A_Caller) caller: MyEntityA
            ) {
                caller.testValue = 'ContainerB';
            }
        }

        const containerA = new A_Container({ name: 'ContainerA', components: [ComponentA], entities: [MyEntityA] });
        const containerB = new A_Container({ name: 'ContainerB', components: [ComponentB], entities: [MyEntityA] });

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                containerA,
                containerB
            ]
        });

        const entityFromContainerA = new MyEntityA();
        const entityFromContainerB = new MyEntityA();

        //  with registration
        containerB.scope.register(entityFromContainerB)
        await entityFromContainerB.load();

        // without registration 
        await entityFromContainerA.load(containerA.scope);

        expect(entityFromContainerA.testValue).toBe('ContainerA');
        expect(entityFromContainerB.testValue).toBe('ContainerB');
    })

});