import { A_Inject } from '@adaas/a-concept/global/A-Inject/A-Inject.decorator';
import './test.setup';

import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';

jest.retryTimes(0);

describe('A-Component tests', () => {

    it('Should Allow to create a component', async () => {
        const component = new A_Component();
    });
    it('Should Allow to create a component with dependencies', async () => {
        class MyComponent extends A_Component { }

        class DependentComponent extends A_Component {
            constructor(
                @A_Inject(MyComponent) public dependency: MyComponent
            ) {
                super();
            }
        }

        A_Context.root.register(MyComponent);
        A_Context.root.register(DependentComponent);

        const dependentComponent = A_Context.root.resolve(DependentComponent);

        expect(dependentComponent.dependency).toBeInstanceOf(MyComponent);
    });
});