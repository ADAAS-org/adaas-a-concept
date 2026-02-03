import { A_Component } from '@adaas/a-concept/global/A-Component/A-Component.class';
import { A_Concept } from '@adaas/a-concept/global/A-Concept/A-Concept.class';
import { A_Container } from '@adaas/a-concept/global/A-Container/A-Container.class';
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';
import { A_Inject } from '@adaas/a-concept/global/A-Inject/A-Inject.decorator';
import { A_Feature } from '@adaas/a-concept/global/A-Feature/A-Feature.class';

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


        const resolvedComponent = myContainer.scope.resolve(MyComponent)!;

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
    it('Should allow to define an async abstraction extension', async () => {
        A_Context.reset();

        class MyContainerA extends A_Container {
            _test: number = 0

            @A_Concept.Load()
            async myMethod() {
                this._test = 5;
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

        expect(containerA._test).toBe(5);
        expect(containerB._test).toBe(1);
    })
    it('Should execute abstraction in a proper order', async () => {
        A_Context.reset();

        const order: string[] = [];

        class MyContainerA extends A_Container {

            @A_Concept.Load()
            async step1() {
                order.push('step1');
            }

            @A_Concept.Load()
            async step2() {
                order.push('step2');
            }
        }
        class MyContainerB extends A_Container {

            @A_Concept.Load()
            async step3() {
                order.push('step3');
            }

            @A_Concept.Load()
            async step4() {
                order.push('step4');
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

        expect(order).toEqual(['step1', 'step2', 'step3', 'step4']);
    })
    it('Should execute abstraction in order with dependencies', async () => {
        A_Context.reset();

        const order: string[] = [];

        class MyContainerA extends A_Container {

            @A_Concept.Load()
            async step1(
                @A_Inject(A_Feature) feature: A_Feature,
            ) {
                // console.log(`Executing step1 in stage: ${feature.stage?.name}`);
                order.push('step1');
            }

            @A_Concept.Load({
                after: ['MyComponentA.step3']
            })
            async step2(
                @A_Inject(A_Feature) feature: A_Feature,
            ) {
                // console.log(`Executing step2 in stage: ${feature.stage?.name}`);
                order.push('step2');
            }
        }

        class MyComponentA extends A_Component {

            @A_Concept.Load()
            async step3(
                @A_Inject(A_Feature) feature: A_Feature,
            ) {
                // console.log(`Executing step3 in stage: ${feature.stage?.name}`);
                order.push('step3');
            }
        }


        class MyContainerB extends A_Container {

            @A_Concept.Load()
            async step4(
                @A_Inject(A_Feature) feature: A_Feature,
            ) {
                // console.log(`Executing step4 in stage: ${feature.stage?.name}`);
                order.push('step4');
            }

            @A_Concept.Load({
                before: ['MyContainerB.step4']
            })
            async step5(
                @A_Inject(A_Feature) feature: A_Feature,
            ) {
                // console.log(`Executing step5 in stage: ${feature.stage?.name}`);
                order.push('step5');
            }
        }


        const containerA = new MyContainerA({ name: 'ContainerA', components: [MyComponentA] });
        const containerB = new MyContainerB({ name: 'ContainerB' });

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                containerA,
                containerB
            ]
        });

        await concept.load();

        expect(order).toEqual(['step1', 'step3', 'step2', 'step5', 'step4']);
    })
    it('Should inherit abstraction extensions', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some abstraction
        class My_Component extends A_Component {

            @A_Concept.Load()
            async feature1() {
                executionOrder.push('stepOne');
            }
        }


        class My_Child_Component extends My_Component { }

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                new A_Container({
                    name: 'TestContainer',
                    components: [My_Child_Component],
                })
            ]
        });

        await concept.load();

        expect(executionOrder).toEqual(['stepOne']);
    });
    it('Should allow to override abstraction extensions', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some abstraction
        class My_Component extends A_Component {

            @A_Concept.Load()
            async feature1() {
                executionOrder.push('stepOne');
            }
        }


        class My_Child_Component extends My_Component {
            @A_Concept.Load()
            async feature1() {
                // do nothing
                executionOrder.push('stepTwo');

            }
        }

        const concept = new A_Concept({
            name: 'TestConcept',
            containers: [
                new A_Container({
                    name: 'TestContainer',
                    components: [My_Child_Component],
                })
            ]
        });

        await concept.load();

        console.log(executionOrder);

        expect(executionOrder).toEqual(['stepTwo']);
    });
});