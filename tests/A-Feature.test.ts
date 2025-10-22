import './test.setup';

import { A_Inject } from "@adaas/a-concept/global/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { A_Caller } from '@adaas/a-concept/global/A-Caller/A_Caller.class';
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';

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
                component: A_Component,
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
                    component: MyExtendedComponent,
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: [],
                    after: []
                },
                {
                    name: 'MyExtendedComponent.testHandler',
                    component: MyExtendedComponent,
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
        const myComponent = scope.resolve(MyComponent);
        expect(myComponent).toBeInstanceOf(MyComponent);
        expect(myComponent.sum).toBe(0);

        // 5) call the feature caller to execute the feature
        await myComponent.testHandler();

        // 6) check the results
        expect(myComponent.sum).toBe(2);

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
                    component: 'MyExtendedComponent2',
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: [],
                    after: []
                }]
            })
            async testHandler() { }
        }


        // 3) create a running scope 
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyExtendedComponent2);
        scope.register(MyComponent2);

        // 4) create an instance of the component from the scope
        const myComponent = scope.resolve(MyComponent2);
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
        const myComponent = scope.resolve(My_Component);
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
        const myComponent = scope.resolve(My_Component);
        expect(myComponent).toBeInstanceOf(My_Component);

        // 4) call the feature caller to execute the feature
        await myComponent.methodA();

        // 5) check the results
        expect(executionOrder).toEqual(['stepTwo', 'stepOne']);
    });
});