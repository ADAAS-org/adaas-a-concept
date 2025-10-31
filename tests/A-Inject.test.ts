import { A_Component, A_Error, A_Inject, A_Scope } from "../src";

jest.retryTimes(0);

describe('A-Inject tests', () => {

    it('Should to Inject Error into constructor', async () => {

        class testComponent extends A_Component {

            constructor(
                @A_Inject(A_Error) public error: A_Error
            ) {
                super();
            }

        }

        const scope = new A_Scope({ name: 'TestScope', components: [testComponent] });

        scope.register(new A_Error('Test Error'));

        const resolvedComponent = scope.resolve(testComponent)!;

        expect(resolvedComponent).toBeInstanceOf(testComponent);
        expect(resolvedComponent.error).toBeInstanceOf(A_Error);
        expect(resolvedComponent.error.message).toBe('Test Error');
    });


    it('Should to Inject another component into constructor', async () => {

        class componentA extends A_Component {
        }

        class componentB extends A_Component {

            constructor(
                @A_Inject(componentA) public component: componentA
            ) {
                super();
            }

        }

        const scope = new A_Scope({ name: 'TestScope', components: [componentA, componentB] });

        const resolvedComponent = scope.resolve(componentB)!;

        expect(resolvedComponent).toBeInstanceOf(componentB);
        expect(resolvedComponent.component).toBeInstanceOf(componentA);
    });
})