import { A_Inject } from "@adaas/a-concept/a-inject";
import {
    A_Component,
    A_TYPES__ComponentMetaKey
} from "@adaas/a-concept/a-component";
import { A_Feature, A_TYPES__FeatureState } from "@adaas/a-concept/a-feature";
import { A_Scope } from "@adaas/a-concept/a-scope";
import { A_Caller } from '@adaas/a-concept/a-caller';
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_Error } from "@adaas/a-concept/a-error";
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Fragment } from "@adaas/a-concept/a-fragment";

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

        await Promise.all([
            feature.process(),
            new Promise<void>(async (resolve) => {
                setTimeout(() => {
                    feature.interrupt();
                    resolve();
                }, 800);
            }),
            new Promise<void>(async (resolve) => {
                setTimeout(() => {
                    expect(feature.state).toBe(A_TYPES__FeatureState.INTERRUPTED);
                    resolve();
                }, 1000);
            })
        ]);

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
    it('Should throw a Sync error  when executed sync', async () => {

        const resultChain: string[] = [];


        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            test1() {
                resultChain.push('ChildComponent_A.test');
                throw new A_Error('Deliberate Sync Error in test1');
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

        try {
            testScope.resolve(ChildComponent_A)!.call('testFeature');
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(A_Error)
            expect((error as A_Error).originalError.message).toBe('Deliberate Sync Error in test1');
        }

        expect(resultChain).toEqual([
            'ChildComponent_A.test'
        ]);
        const feature = new A_Feature({
            name: 'testFeature',
            component: testScope.resolve(ChildComponent_A)!,
        })

        try {
            feature.process();
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(A_Error)
            expect((error as A_Error).originalError.message).toBe('Deliberate Sync Error in test1');
        }

        expect(feature.state).toBe(A_TYPES__FeatureState.FAILED);

        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'ChildComponent_A.test'
        ]);
    })
    it('Should throw an Async error when executed async', async () => {

        const resultChain: string[] = [];

        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async test1() {
                resultChain.push('ChildComponent_A.test');

                await new Promise<void>(async (resolve, reject) => {
                    setTimeout(() => {
                        reject(new A_Error('Deliberate Async Error in test1'));
                    }, 2000);
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
        try {
            await Promise.all([
                new Promise<void>(async (resolve) => {
                    setTimeout(() => {
                        resultChain.push('feature3');

                        resolve();
                    }, 1000);
                }),
                testScope.resolve(ChildComponent_A)!.call('testFeature')
            ]);

        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(A_Error)
            expect((error as A_Error).originalError.message).toBe('Deliberate Async Error in test1');
        }
        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'feature3'
        ]);

        const feature = new A_Feature({
            name: 'testFeature',
            component: testScope.resolve(ChildComponent_A)!,
        })

        try {
            await feature.process();
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(A_Error)
            expect((error as A_Error).originalError.message).toBe('Deliberate Async Error in test1');
        }

        expect(feature.state).toBe(A_TYPES__FeatureState.FAILED);

        expect(resultChain).toEqual([
            'ChildComponent_A.test',
            'feature3',
            'ChildComponent_A.test'
        ]);
    })

    it('Should throw an Async error when executed async and error in method', async () => {

        const resultChain: string[] = [];

        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async test1() {
                resultChain.push('ChildComponent_A.test');

                throw new A_Error('Deliberate Async Error in test1');
            }
        }

        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A] });

        const feature = new A_Feature({
            name: 'testFeature',
            component: testScope.resolve(ChildComponent_A)!,
        })

        try {
            await feature.process();
        } catch (error) {
            expect(error).toBeInstanceOf(A_Error);
            expect((error as A_Error).originalError).toBeInstanceOf(A_Error)
            expect((error as A_Error).originalError.message).toBe('Deliberate Async Error in test1');
        }

        expect(feature.state).toBe(A_TYPES__FeatureState.FAILED);

        expect(resultChain).toEqual([
            'ChildComponent_A.test'
        ]);
    })
    it('Should keep override definition', async () => {

        const resultChain: string[] = [];

        class ChildComponent_A extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async test1() {
                resultChain.push('ChildComponent_A.test1');
            }

            @A_Feature.Extend({
                name: 'testFeature',
                override: ['test1']
            })
            async test2() {
                resultChain.push('ChildComponent_A.test2');
            }
        }

        const testScope = new A_Scope({ name: 'TestScope', components: [ChildComponent_A] });

        const featureDefinition = A_Context.featureTemplate('testFeature', testScope.resolve(ChildComponent_A)!, testScope);


        expect(featureDefinition).toBeDefined();
        expect(featureDefinition.length).toBe(1);
        expect(featureDefinition[0].handler).toBe('test2');

        await testScope.resolve(ChildComponent_A)!.call('testFeature');

        expect(resultChain).toEqual([
            'ChildComponent_A.test2'
        ]);
    })

    it('Should allow to define 2 extension under the same method', async () => {

        const resultChain: string[] = [];

        class ComponentA extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature1',
            })
            @A_Feature.Extend({
                name: 'testFeature2',
            })
            async feature1() {
                resultChain.push('ComponentA.feature1');
            }
        }

        const testScope = new A_Scope({ name: 'TestScope', components: [ComponentA] });

        const component = testScope.resolve(ComponentA)!;

        component.call('testFeature1');
        component.call('testFeature2');

        expect(resultChain).toEqual([
            'ComponentA.feature1',
            'ComponentA.feature1'
        ]);
    })
    it('Should return promise if at least one step is async', async () => {

        const resultChain: string[] = [];

        class ComponentA extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            async step1() {
                resultChain.push('ComponentA.step1');
            }

            @A_Feature.Extend({
                name: 'testFeature',
            })
            step2() {
                resultChain.push('ComponentA.step2');
            }
        }


        class MyEntity extends A_Entity {
            async test() {
                return await this.call('testFeature');
            }
        }


        const testScope = new A_Scope({ name: 'TestScope', components: [ComponentA] });

        const component = testScope.resolve(ComponentA)!;

        const myEntity = new MyEntity();

        testScope.register(myEntity);

        const res = component.call('testFeature');
        const res2 = myEntity.test();

        expect(res).toBeInstanceOf(Promise);
        expect(res2).toBeInstanceOf(Promise);

        await res;
        await res2;


        expect(resultChain).toEqual([
            'ComponentA.step1',
            'ComponentA.step1',
            'ComponentA.step2',
            'ComponentA.step2'
        ]);
    })
    it('Should execute sync if all steps are synchronous', async () => {

        const resultChain: string[] = [];

        class ComponentA extends A_Component {
            @A_Feature.Extend({
                name: 'testFeature',
            })
            step1() {
                resultChain.push('ComponentA.step1');
            }

            @A_Feature.Extend({
                name: 'testFeature',
            })
            step2() {
                resultChain.push('ComponentA.step2');
            }
        }


        class MyEntity extends A_Entity {
            test() {
                return this.call('testFeature');
            }
        }

        const testScope = new A_Scope({ name: 'TestScope', components: [ComponentA] });

        const component = testScope.resolve(ComponentA)!;

        const myEntity = new MyEntity();

        testScope.register(myEntity);

        const res = component.call('testFeature');
        const res2 = myEntity.test();

        expect(res).not.toBeInstanceOf(Promise);
        expect(res2).not.toBeInstanceOf(Promise);

        expect(resultChain).toEqual([
            'ComponentA.step1',
            'ComponentA.step2',
            'ComponentA.step1',
            'ComponentA.step2'
        ]);
    })

    it('Should allow extension B to receive a fragment registered into scope by extension A (runs first via before:/.*/)', async () => {
        // Regression test for a-utils A-Signal pattern:
        // ComponentA.onEvent runs first (before: /.*/), registers a result Fragment into the
        // passed scope, then ComponentB.onEvent runs and receives that Fragment via injection.

        class ResultFragment extends A_Fragment {
            value: string = '';
            constructor(v: string) { super({ name: 'ResultFragment' }); this.value = v; }
        }

        const FEATURE = 'onEvent';
        let bReceivedFragment: ResultFragment | undefined;

        class BusComponent extends A_Component {
            @A_Feature.Extend({ before: /.*/ })
            async onEvent(
                @A_Inject(A_Scope) scope: A_Scope,
            ) {
                scope.register(new ResultFragment('hello'));
            }
        }

        class ListenerComponent extends A_Component {
            @A_Feature.Extend()
            async onEvent(
                @A_Inject(ResultFragment) fragment: ResultFragment,
            ) {
                bReceivedFragment = fragment;
            }
        }

        // Set up a single scope with both components registered
        const scope = new A_Scope({ name: 'test-scope' });
        scope.register(BusComponent);
        scope.register(ListenerComponent);

        const bus = scope.resolve(BusComponent)!;
        expect(bus).toBeInstanceOf(BusComponent);

        // Create a call scope that inherits from the component scope
        const callScope = new A_Scope({ name: 'call-scope' }).inherit(A_Context.scope(bus));

        // Call the feature — BusComponent.onEvent should run first and register
        // ResultFragment into callScope, then ListenerComponent.onEvent should receive it
        await bus.call(FEATURE, callScope);

        expect(bReceivedFragment).toBeDefined();
        expect(bReceivedFragment).toBeInstanceOf(ResultFragment);
        expect(bReceivedFragment!.value).toBe('hello');
    });
    it('Should return different set of injected arguments for each call', async () => {
        try {
            const results: string[] = [];

            class TestEntity extends A_Entity {

                static get Feature() {
                    return (target: any, propertyKey: string, descriptor: PropertyDescriptor) => {
                        return A_Feature.Extend({
                            name: 'feature',
                            scope: [TestEntity],
                        })(target, propertyKey, descriptor);
                    }
                }

                @A_Feature.Define({ invoke: true })
                feature() {
                    results.push('step1')
                }
            }

            class InjectableComponentA extends A_Component { }
            class InjectableComponentB extends A_Component { }

            class BaseComponent extends A_Component {

                @TestEntity.Feature
                feature(
                    @A_Inject(InjectableComponentA) a: InjectableComponentA
                ) {
                    expect(a).toBeInstanceOf(InjectableComponentA);
                    results.push('baseStep');
                }
            }


            class ComponentA extends BaseComponent {
                @TestEntity.Feature
                feature(
                    @A_Inject(InjectableComponentA) a: InjectableComponentA
                ) {
                    expect(a).toBeInstanceOf(InjectableComponentA);
                    results.push('step2');
                }
            }

            class ComponentB extends BaseComponent {

                @TestEntity.Feature
                feature(
                    @A_Inject(InjectableComponentB) b: InjectableComponentB
                ) {
                    expect(b).toBeInstanceOf(InjectableComponentB);
                    results.push('step3');
                }
            }

            const scope = new A_Scope({ name: 'TestScope', components: [ComponentA, ComponentB, InjectableComponentA, InjectableComponentB] });

            const entity = new TestEntity({ name: 'test-entity' });
            scope.register(entity);

            entity.feature();

            expect(results).toEqual([
                'step1',
                'step2',
                'step3'
            ]);

        } catch (error) {
            console.log((error as A_Error).toJSON())
        }
    })

    it('Should resolve @Dependency.Required dep registered by a before:/.*/ extension into the same call scope (A_SignalBus pattern)', async () => {
        // Regression test for the meta-subtype bug:
        //   new A_Meta() was used instead of inheritedMeta.clone() when no existing inner meta
        //   existed. This caused A_ComponentMeta to be replaced with a plain A_Meta at the
        //   INJECTIONS key, breaking injection lookup for @A_Dependency.Required() decorators.
        //
        // Pattern mirrors A_SignalBus exactly:
        //   - onBeforeNext (before: /.*/) — registers StateFragment into call scope via @A_Inject(A_Scope)
        //   - onNext                      — requires StateFragment via @A_Dependency.Required() @A_Inject(StateFragment)
        //   - ListenerComponent.onNext    — also extends onNext, receives StateFragment optionally

        class StateFragment extends A_Fragment {
            value: number = 0;
            constructor(v: number) { super({ name: 'StateFragment' }); this.value = v; }
        }

        const ON_BEFORE = 'onBeforeNext';
        const ON_NEXT = 'onNext';

        let receivedState: StateFragment | undefined;
        let onNextFired = false;

        class BusComponent extends A_Component {

            @A_Feature.Extend({ before: /.*/ })
            async onBeforeNext(
                @A_Inject(A_Scope) scope: A_Scope,
            ) {
                scope.register(new StateFragment(42));
            }

            @A_Feature.Extend()
            async onNext(
                @A_Dependency.Required()
                @A_Inject(StateFragment) state: StateFragment,
            ) {
                onNextFired = true;
                receivedState = state;
            }
        }

        class ListenerComponent extends A_Component {
            @A_Feature.Extend()
            async onNext(
                @A_Inject(StateFragment) state: StateFragment,
            ) {
                receivedState = state;
            }
        }

        const scope = new A_Scope({ name: 'test-scope' });
        scope.register(BusComponent);
        scope.register(ListenerComponent);

        const bus = scope.resolve(BusComponent)!;
        expect(bus).toBeInstanceOf(BusComponent);

        const callScope = new A_Scope({ name: 'call-scope' }).inherit(A_Context.scope(bus));

        await bus.call(ON_BEFORE, callScope);
        await bus.call(ON_NEXT, callScope);

        expect(onNextFired).toBe(true);
        expect(receivedState).toBeDefined();
        expect(receivedState).toBeInstanceOf(StateFragment);
        expect(receivedState!.value).toBe(42);
    });

    it('Should not pull in sibling subclass extensions when calling a base-class feature (cc4db Command pattern)', async () => {
        // This test reproduces a bug observed in cc4db where a base class (A_Command)
        // declares @A_Feature.Extend() with no `scope:` filter, producing a wildcard
        // regex (e.g. `.*\.featureName$`) in the base meta. That meta is then cloned
        // into each subclass's _metaStorage entry. When multiple sibling subclasses
        // are registered in the scope and one of them is invoked, the wildcard regex
        // in each *sibling*'s cloned meta also matches the caller's callName, and
        // the framework emits steps whose `dependency` is the sibling class.
        // Resolving those siblings from the caller's execution scope then fails with
        // "Unable to resolve component <Sibling> from scope ...".

        const executionOrder: string[] = [];

        class BaseCommand extends A_Component {
            async run() {
                await this.call('cmdExecute');
            }

            @A_Feature.Extend({ name: 'cmdExecute' })
            async _baseStep() {
                executionOrder.push(`${this.constructor.name}._baseStep`);
            }
        }

        class SearchCmd  extends BaseCommand {}
        class CompactCmd extends BaseCommand {}
        class SchemaCmd  extends BaseCommand {}

        const scope = new A_Scope({
            name: 'TestScope',
            components: [SearchCmd, CompactCmd, SchemaCmd],
        });

        const compact = scope.resolve(CompactCmd)!;

        // Should NOT throw "Unable to resolve component SearchCmd / SchemaCmd ..."
        await compact.run();

        // The base step should run exactly once, on the caller (CompactCmd) — not also
        // on SearchCmd or SchemaCmd.
        expect(executionOrder).toEqual(['CompactCmd._baseStep']);
    });

    it('Should allow a handler component to extend the same base feature for multiple sibling subclass scopes', async () => {
        // This is the cc4db CC4CommandHandlers pattern: a single component declares
        // multiple @A_Feature.Extend handlers each scoped to a different sibling
        // subclass of a common base. Each scoped handler must fire only for its
        // own scope class, never for the others.

        const calls: string[] = [];

        class BaseCmd extends A_Component {
            async run() { await this.call('cmdExec'); }

            @A_Feature.Extend({ name: 'cmdExec' })
            async _base() { calls.push(`base:${this.constructor.name}`); }
        }
        class CmdA extends BaseCmd {}
        class CmdB extends BaseCmd {}
        class CmdC extends BaseCmd {}

        class Handlers extends A_Component {
            @A_Feature.Extend({ name: 'cmdExec', scope: [CmdA] })
            async onA(@A_Inject(A_Caller) c: CmdA) { calls.push('onA'); }

            @A_Feature.Extend({ name: 'cmdExec', scope: [CmdB] })
            async onB(@A_Inject(A_Caller) c: CmdB) { calls.push('onB'); }

            @A_Feature.Extend({ name: 'cmdExec', scope: [CmdC] })
            async onC(@A_Inject(A_Caller) c: CmdC) { calls.push('onC'); }
        }

        const scope = new A_Scope({
            name: 'TestScope',
            components: [CmdA, CmdB, CmdC, Handlers],
        });

        // For each sibling, exactly the matching scoped handler must run — never
        // a sibling's handler. (Order between the base wildcard `_base` and the
        // scoped handler is not asserted here because it depends on meta
        // registration order; both must fire.)

        calls.length = 0;
        await scope.resolve(CmdA)!.run();
        expect(calls.sort()).toEqual(['base:CmdA', 'onA'].sort());

        calls.length = 0;
        await scope.resolve(CmdB)!.run();
        expect(calls.sort()).toEqual(['base:CmdB', 'onB'].sort());

        calls.length = 0;
        await scope.resolve(CmdC)!.run();
        expect(calls.sort()).toEqual(['base:CmdC', 'onC'].sort());
    });

});