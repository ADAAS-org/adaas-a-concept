import './test.setup';

import { A_Inject } from "@adaas/a-concept/decorators/A-Inject/A-Inject.decorator";
import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { A_FeatureCaller } from "@adaas/a-concept/global/A-Feature/A-FeatureCaller.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";

jest.retryTimes(0);

describe('A-Feature tests', () => {
    it('Should Allow to create a feature from undefined', async () => {
        const feature = new A_Feature({
            name: 'TestFeature',
            scope: new A_Scope({ name: 'TestScope' }),
            steps: [],
            caller: new A_Component()
        });
    });
    it('Should Allow to create a feature with steps', async () => {
        const feature = new A_Feature({
            name: 'TestFeature',
            scope: new A_Scope({ name: 'TestScope' }),
            steps: [
                {
                    name: 'A_Component.testHandler',
                    component: A_Component,
                    handler: 'testHandler',
                    behavior: 'sync',
                    before: [],
                    after: []
                }
            ],
            caller: new A_Component()
        });
    });
    it('Should be possible to execute a feature with steps as a template on the component', async () => {
        // 1) create a base component with some feature
        class MyExtendedComponent extends A_Component {

            async testHandler(
                @A_Inject(A_FeatureCaller) caller: MyComponent
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
                @A_Inject(A_FeatureCaller) caller: MyComponent2
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


});