import './test.setup';

import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";

jest.retryTimes(0);

describe('A-Component tests', () => {

    it('Should Allow to create a component', async () => {
        const component = new A_Component();
    });
    it('Should Allow to create a component with dependencies', async () => {
        class DependentComponent extends A_Component {
            constructor(
                public dependency: A_Component
            ) {
                super();
            }
        }

        const component = new A_Component();
        const dependentComponent = new DependentComponent(component);
        expect(dependentComponent.dependency).toBe(component);
    });
   

});