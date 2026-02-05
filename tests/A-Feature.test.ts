import { A_Inject } from "@adaas/a-concept/global/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Caller } from '@adaas/a-concept/global/A-Caller/A_Caller.class';
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';
import { A_TYPES__ComponentMetaKey } from '@adaas/a-concept/global/A-Component/A-Component.constants';
import { A_Dependency, A_Entity, A_Error, A_TYPES__FeatureState } from "../src";

jest.retryTimes(0);

describe('A-Feature tests', () => {
    it('Should Allow to create a feature from component', async () => {
        const testComponent = new A_Component()
        A_Context.root.register(testComponent);

        const feature = new A_Feature({
            name: 'testFeature',
            component: testComponent,
        });

        expect(feature).toBeInstanceOf(A_Feature);
        expect(feature.scope.parent).toBe(A_Context.root);

    });
    it('Should Allow to create a feature with steps', async () => {
        const template = [
            {
                name: 'A_Component.testHandler',
                dependency: new A_Dependency(A_Component),
                handler: 'testHandler',
            }
        ]

        const feature = new A_Feature({
            name: 'testFeature',
            scope: new A_Scope(),
            template
        });

        expect(feature).toBeInstanceOf(A_Feature);
    });
    it('Should be possible to execute a feature with steps as a template on the component', async () => {
        // 1) create a base component with some feature
        class MyExtendedComponent extends A_Component {

            async testHandler(
                @A_Inject(A_Caller) caller: MyComponent
            ) {
                caller.sum = 2;
            }
        }

        // 2) create a custom component with a defined template feature
        class MyComponent extends A_Component {
            sum: number = 0;

            @A_Feature.Define({
                invoke: true,
                template: [{
                    name: 'MyExtendedComponent.testHandler',
                    dependency: new A_Dependency(MyExtendedComponent),
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: '',
                    after: ''
                },
                {
                    name: 'MyExtendedComponent.testHandler',
                    dependency: new A_Dependency(MyExtendedComponent),
                    handler: 'testHandler'
                }]
            })
            async testHandler() { }
        }


        // 3) create a running scope 
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyExtendedComponent);
        scope.register(MyComponent);

        // 4) create an instance of the component from the scope
        const myComponent = scope.resolve(MyComponent)!;
        expect(myComponent).toBeInstanceOf(MyComponent);
        expect(myComponent.sum).toBe(0);

        // 5) call the feature caller to execute the feature
        await myComponent.testHandler();

        // 6) check the results
        expect(myComponent.sum).toBe(2);

    });


    it('Should fail execution when error occurs', async () => {
        // 1) create a base component with some feature
        class MyExtendedComponent extends A_Component {

            async testHandler(
                @A_Inject(A_Caller) caller: MyComponent
            ) {
                throw new Error('Deliberate error in testHandler');
            }
        }

        // 2) create a custom component with a defined template feature
        class MyComponent extends A_Component {
            sum: number = 0;

            @A_Feature.Define({
                invoke: true,
                template: [{
                    name: 'MyExtendedComponent.testHandler',
                    dependency: new A_Dependency(MyExtendedComponent),
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: '',
                    after: ''
                },
                {
                    name: 'MyExtendedComponent.testHandler',
                    dependency: new A_Dependency(MyExtendedComponent),
                    handler: 'testHandler'
                }]
            })
            async testHandler() { }
        }


        // 3) create a running scope 
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyExtendedComponent);
        scope.register(MyComponent);

        // 4) create an instance of the component from the scope
        const myComponent = scope.resolve(MyComponent)!;
        expect(myComponent).toBeInstanceOf(MyComponent);
        expect(myComponent.sum).toBe(0);

        // 5) call the feature caller to execute the feature
        try {
            await myComponent.testHandler();

        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(Error);
            expect((error as A_Error).originalError.message).toBe('Deliberate error in testHandler');
        }

        // 6) check the results
        expect(myComponent.sum).toBe(0);

    });
    it('Should be possible to execute a feature with steps as a template on the component with string component declaration', async () => {
        // 1) create a base component with some feature
        class MyExtendedComponent2 extends A_Component {

            async testHandler(
                @A_Inject(A_Caller) caller: MyComponent2
            ) {
                caller.sum = 2;
            }
        }

        // 2) create a custom component with a defined template feature
        class MyComponent2 extends A_Component {
            sum: number = 0;

            @A_Feature.Define({
                invoke: true,
                template: [{
                    name: 'MyExtendedComponent2.testHandler',
                    dependency: new A_Dependency('MyExtendedComponent2'),
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: '',
                    after: ''
                }]
            })
            async testHandler() { }
        }


        // 3) create a running scope 
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyExtendedComponent2);
        scope.register(MyComponent2);

        // 4) create an instance of the component from the scope
        const myComponent = scope.resolve(MyComponent2)!;
        expect(myComponent).toBeInstanceOf(MyComponent2);
        expect(myComponent.sum).toBe(0);

        // 5) call the feature caller to execute the feature
        await myComponent.testHandler();

        // 6) check the results
        expect(myComponent.sum).toBe(2);

    });
    it('Should execute feature steps in base order', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some feature
        class My_Component extends A_Component {
            async methodA() {
                await this.call('myFeature')
            }

            @A_Feature.Extend({
                name: 'myFeature',
            })
            async stepOne(
            ) {
                executionOrder.push('stepOne');
            }

            @A_Feature.Extend({
                name: 'myFeature',
            })
            async stepTwo(
            ) {
                executionOrder.push('stepTwo');
            }

            @A_Feature.Extend({
                name: 'myFeature',
            })
            async stepThree(
            ) {
                executionOrder.push('stepThree');
            }
        }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [My_Component] });

        // 3) create an instance of the component from the scope
        const myComponent = scope.resolve(My_Component)!;
        expect(myComponent).toBeInstanceOf(My_Component);

        // 4) call the feature caller to execute the feature
        await myComponent.methodA();

        // 5) check the results
        expect(executionOrder).toEqual(['stepOne', 'stepTwo', 'stepThree']);
    });
    it('Should execute feature steps in proper order', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some feature
        class My_Component extends A_Component {
            async methodA() {
                await this.call('myFeature')
            }

            @A_Feature.Extend({
                name: 'myFeature',
                after: ['My_Component.stepTwo'],
            })
            async stepOne(
            ) {
                executionOrder.push('stepOne');
            }

            @A_Feature.Extend({
                name: 'myFeature',
            })
            async stepTwo(
            ) {
                executionOrder.push('stepTwo');
            }
        }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [My_Component] });

        // 3) create an instance of the component from the scope
        const myComponent = scope.resolve(My_Component)!;
        expect(myComponent).toBeInstanceOf(My_Component);

        // 4) call the feature caller to execute the feature
        await myComponent.methodA();

        // 5) check the results
        expect(executionOrder).toEqual(['stepTwo', 'stepOne']);
    });

    it('Should allow to define a feature', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some feature
        class My_Component extends A_Component {


            @A_Feature.Define({ invoke: true })
            @A_Feature.Extend({
                name: 'myFeature',
            })
            async feature1(
                @A_Inject(A_Component) component: A_Component
            ) { }

            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension() {
                executionOrder.push('stepOne');
            }

            @A_Feature.Define()
            async feature2() {
                await this.call('feature2');
            }

            @A_Feature.Extend({
                name: 'feature2',
            })
            async feature2Extension() {
                executionOrder.push('stepTwo');
            }

        }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [My_Component] });

        // 3) create an instance of the component from the scope
        const myComponent = scope.resolve(My_Component)!;
        expect(myComponent).toBeInstanceOf(My_Component);

        // 4) call the feature caller to execute the feature
        await myComponent.feature1(new A_Component());

        await myComponent.feature2();

        // 5) check the results
        expect(executionOrder).toEqual(['stepOne', 'stepTwo']);
    });
    it('Should inherit feature definitions & extensions', async () => {
        const executionOrder: string[] = [];

        class Parent_Component extends A_Component {

            @A_Feature.Define({ invoke: false })
            async feature1() {
                executionOrder.push('stepOne');

                await this.call('feature1');
            }

            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension(
                @A_Inject(A_Scope) scope: A_Scope
            ) {
                executionOrder.push('stepTwo');
            }

            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension2(
                @A_Inject(A_Scope) scope: A_Scope
            ) {
                executionOrder.push('stepFour');
            }
        }

        // 1) create a base component with some feature
        class My_Component extends Parent_Component {
            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension(
                @A_Inject(A_Scope) scope: A_Scope
            ) {
                executionOrder.push('stepThree');
            }
        }


        class My_Child_Component extends My_Component { }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [My_Child_Component] });

        // 3) create an instance of the component from the scope
        const myComponent = scope.resolve(My_Child_Component)!;


        const featureDefinition = A_Context.featureTemplate('feature1', myComponent, scope)

        expect(featureDefinition).toBeDefined();
        expect(featureDefinition.length).toBe(2);

        expect(myComponent).toBeInstanceOf(My_Child_Component);

        await myComponent.feature1();

        expect(executionOrder).toEqual(['stepOne', 'stepThree', 'stepFour']);
    });

    it('Should allow override feature extension', async () => {
        const executionOrder: string[] = [];

        // 1) create a base component with some feature
        class My_Component extends A_Component {

            @A_Feature.Define({ invoke: true })
            async feature1() {
                executionOrder.push('stepOne');
            }

            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension(
                @A_Inject(A_Scope) scope: A_Scope
            ) {
                executionOrder.push('stepTwo');
            }
        }


        class My_Child_Component extends My_Component {

            async feature1Extension(
                @A_Inject(A_Scope) scope: A_Scope
            ) {
                executionOrder.push('stepThree');
            }
        }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [My_Child_Component] });

        // 3) create an instance of the component from the scope
        const myComponent = scope.resolve(My_Child_Component)!;
        expect(myComponent).toBeInstanceOf(My_Child_Component);

        await myComponent.feature1();

        expect(executionOrder).toEqual(['stepOne', 'stepThree']);
    });

    it('Should allow proceed with external scope', async () => {
        const executionOrder: string[] = [];

        class CustomComponent extends A_Component {

            doSomething() {
                executionOrder.push('customComponentAction');
            }

        }

        // 1) create a base component with some feature
        class ComponentA extends A_Component {

            @A_Feature.Define({ invoke: false })
            async feature1() {
                const scope = new A_Scope({ name: 'ExternalScopeCaller', components: [CustomComponent] });

                executionOrder.push('stepOne');

                await this.call('feature1', scope);
            }
        }


        class ComponentB extends A_Component {

            @A_Feature.Extend({
                name: 'feature1',
            })
            async feature1Extension(
                @A_Inject(A_Scope) scope: A_Scope,
                @A_Inject(CustomComponent) customComponent: CustomComponent
            ) {
                expect(customComponent).toBeInstanceOf(CustomComponent);
                expect(customComponent.doSomething).toBeInstanceOf(Function);

                executionOrder.push('stepThree');
            }
        }
        try {

            // 2) create a running scope 
            const scope = new A_Scope({ name: 'TestScope', components: [ComponentA, ComponentB] });


            // 3) create an instance of the component from the scope
            const myComponent = scope.resolve(ComponentA)!;
            expect(myComponent).toBeInstanceOf(ComponentA);

            await myComponent.feature1();

            expect(executionOrder).toEqual(['stepOne', 'stepThree']);

        } catch (error) {
            console.error('Error during feature processing: ', error);
        }

    });
    it('Should allow to interrupt a new feature', async () => {
        const feature = new A_Feature({
            name: 'testFeature',
            scope: new A_Scope(),
            template: [
                {
                    name: 'A_Component.testHandler',
                    dependency: new A_Dependency('A_Component'),
                    handler: 'testHandler',
                }
            ]
        });


        feature.interrupt();

        expect(feature.state).toBe(A_TYPES__FeatureState.INTERRUPTED);
    });
    it('Should allow to interrupt feature with async processing', async () => {
        const executionOrder: string[] = [];


        // 1) create a base component with some feature
        class ComponentA extends A_Component {

            async feature1() {
                await new Promise<void>(async (resolve) => {
                    setTimeout(() => {
                        executionOrder.push('feature1');
                        resolve();
                    }, 500);
                });
            }

            async feature2() {
                await new Promise<void>(async (resolve) => {
                    setTimeout(() => {
                        executionOrder.push('feature2');
                        resolve();
                    }, 500);
                });
            }

            async feature3() {
                await new Promise<void>(async (resolve) => {
                    setTimeout(() => {
                        executionOrder.push('feature3');
                        resolve();
                    }, 500);
                });
            }
        }


        // 2) create a running scope 
        const scope = new A_Scope({ name: 'TestScope', components: [ComponentA] });


        const feature = new A_Feature({
            name: 'testFeature',
            scope,
            template: [
                {
                    name: 'ComponentA.feature1',
                    dependency: new A_Dependency('ComponentA'),
                    handler: 'feature1',
                },
                {
                    name: 'ComponentA.feature2',
                    dependency: new A_Dependency('ComponentA'),
                    handler: 'feature2',
                },
                {
                    name: 'ComponentA.feature3',
                    dependency: new A_Dependency('ComponentA'),
                    handler: 'feature3',
                },
            ]
        });

        feature.process();

        await new Promise<void>(async (resolve) => {
            setTimeout(() => {
                feature.interrupt();
            }, 1000);


            setTimeout(() => {
                expect(feature.state).toBe(A_TYPES__FeatureState.INTERRUPTED);
                expect(executionOrder).toEqual(['feature1', 'feature2']);

                resolve();

            }, 3000);
        });

    }, 5000);
    it('Should allow to use extension if only parent class provided', async () => {
        const executionResults: string[] = [];

        class BaseEntity extends A_Entity {
            async test() {
                await this.call('myFeature');
            }
        }

        class MyComponent extends A_Component {

            @A_Feature.Extend({
                name: 'myFeature',
                scope: [BaseEntity]
            })
            testMethod() {
                executionResults.push('testMethod');
            }
        }

        class My_Entity extends BaseEntity { }

        const scope = new A_Scope({ name: 'TestScope', components: [MyComponent] });


        const myEntity = new My_Entity({ name: 'MyEntityInstance' });
        const baseEntity = new BaseEntity({ name: 'BaseEntityInstance' });


        scope.register(myEntity);
        scope.register(baseEntity);

        await baseEntity.test();

        expect(executionResults).toEqual(['testMethod']);

        await myEntity.test();

        expect(executionResults).toEqual(['testMethod', 'testMethod']);
    });
    it('Should allow be possible to do a Feature Chaining without Caller Change', async () => {
        const executionResults: string[] = [];

        class Component_B extends A_Component {

            @A_Feature.Extend()
            featureB(
                @A_Inject(A_Caller) caller: Component_A
            ) {
                executionResults.push('featureB');

                expect(caller).toBeInstanceOf(Component_A);
            }
        }

        class Component_A extends A_Component {

            @A_Feature.Extend()
            async featureA(
                @A_Inject(A_Feature) feature: A_Feature,
                @A_Inject(Component_B) compb: Component_B
            ) {
                executionResults.push('featureA');

                await feature.chain(compb, 'featureB');
            }
        }



        const scope = new A_Scope({ name: 'TestScope', components: [Component_A, Component_B] });


        const compA = scope.resolve(Component_A)!;

        await compA.call('featureA');

        expect(executionResults).toEqual(['featureA', 'featureB']);


    });
    it('Should override extensions meta for inherited method with the same name', async () => {

        const resultChain: string[] = [];

        class BaseComponent extends A_Component {

            @A_Feature.Extend({
                name: 'testFeature',
                scope: [BaseComponent]
            })
            async test() {
                resultChain.push('BaseComponent.test');
            }

            @A_Feature.Extend({
                name: 'testFeature',
                scope: [BaseComponent]
            })
            async test2() {
                resultChain.push('BaseComponent.test2');
            }
        }


        class ChildComponent_A extends BaseComponent {

            @A_Feature.Extend({
                name: 'testFeature',
                scope: [ChildComponent_A]
            })
            async test() {
                resultChain.push('ChildComponent_A.test');
            }
        }


        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A] });

        const extensionsMeta = A_Context.meta(ChildComponent_A).get(A_TYPES__ComponentMetaKey.EXTENSIONS)!.entries();

        await testScope.resolve(ChildComponent_A)!.call('testFeature');

        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'BaseComponent.test2'
        ]);
    })

    it('Should properly define inheritance chain of the features', async () => {

        const resultChain: string[] = [];

        class BaseComponent extends A_Component {

            @A_Feature.Extend({
                name: 'testFeature',
                scope: [BaseComponent]
            })
            async test() {
                resultChain.push('BaseComponent.test');
            }
        }

        class ChildComponent_A extends BaseComponent {
            @A_Feature.Extend({
                name: 'testFeature',
                scope: [ChildComponent_A]
            })
            async test() {
                resultChain.push('ChildComponent_A.test');
            }
        }

        class ChildComponent_B extends BaseComponent {
            @A_Feature.Extend({
                name: 'testFeature',
                scope: [ChildComponent_B]
            })
            async test() {
                resultChain.push('ChildComponent_B.test');
            }
        }


        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A, ChildComponent_B] });

        await testScope.resolve(ChildComponent_A)!.call('testFeature');

        expect(resultChain).toEqual([
            'ChildComponent_A.test'
        ]);

    })
    it('Should execute Sync operations properly', async () => {

        const resultChain: string[] = [];


        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            test1() {
                resultChain.push('ChildComponent_A.test');
            }
        }

        class ChildComponent_B extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            test2() {
                resultChain.push('ChildComponent_B.test');
            }
        }


        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A, ChildComponent_B] });

        testScope.resolve(ChildComponent_A)!.call('testFeature');


        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'ChildComponent_B.test'
        ]);

    })

    it('Should execute Async operations properly', async () => {

        const resultChain: string[] = [];


        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async test1() {
                resultChain.push('ChildComponent_A.test');

                await new Promise<void>(async (resolve) => {
                    setTimeout(() => {
                        resolve();
                    }, 3000);
                });
            }
        }

        class ChildComponent_B extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async test2() {
                resultChain.push('ChildComponent_B.test');
            }
        }

        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A, ChildComponent_B] });

        await Promise.all([
            new Promise<void>(async (resolve) => {
                setTimeout(() => {
                    resultChain.push('feature3');

                    resolve();
                }, 2000);
            }),
            testScope.resolve(ChildComponent_A)!.call('testFeature')
        ]);

        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'feature3',
            'ChildComponent_B.test'
        ]);

    })
});