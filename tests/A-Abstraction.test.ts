import { A_Component } from '@adaas/a-concept/global/A-Component/A-Component.class';
import './test.setup'
import { A_Concept } from '@adaas/a-concept/global/A-Concept/A-Concept.class';
import { A_Container } from '@adaas/a-concept/global/A-Container/A-Container.class';
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';

jest.retryTimes(0);

describe('A-Abstraction Tests', () => {
    it('It should be possible to extend abstraction on A-Component level', async () => {
        class MyComponent extends A_Component {
            private _test: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test++;
            }
        }
    });

    it('It should be possible to extend abstraction on A-Container level', async () => {
        class MyContainer extends A_Container {
            private _test: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test++;
            }
        }
    });


    it('It should be possible to proceed Concept Abstraction', async () => {
        class MyComponent extends A_Component {
            _test2: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test2++;
            }
        }

        class MyContainer extends A_Container {
            _test: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test++;
            }
        }

        const myContainer = new MyContainer({
            name: 'MyContainer',
            components: [MyComponent]
        });

        const testConcept = new A_Concept({
            name: 'TestConcept',
            containers: [myContainer]
        });

        await testConcept.load();


        const resolvedComponent = myContainer.scope.resolve(MyComponent);

        expect(resolvedComponent).toBeInstanceOf(MyComponent);
        expect(myContainer._test).toBe(1);
        expect(resolvedComponent._test2).toBe(1);

    });
    it('Should allow to extend abstraction with multiple containers', async () => {
        A_Context.reset();

        class MyContainerA extends A_Container {
            _test: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test++;
            }
        }
        class MyContainerB extends A_Container {
            _test: number = 0

            @A_Concept.Load()
            myMethod() {
                this._test++;
            }
        }

        const containerA = new MyContainerA({ name: 'ContainerA' });
        const containerB = new MyContainerB({ name: 'ContainerB' });

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                containerA,
                containerB
            ]
        });

        await concept.load();

        expect(containerA.scope.resolve(MyContainerA)).toBeInstanceOf(MyContainerA);
        expect(containerB.scope.resolve(MyContainerB)).toBeInstanceOf(MyContainerB);

        expect(containerA._test).toBe(1);
        expect(containerB._test).toBe(1);

    })
});

