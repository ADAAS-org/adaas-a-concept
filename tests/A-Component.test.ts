import { A_Inject } from '@adaas/a-concept/a-inject';
import {
    A_Component,
    A_TYPES__ComponentMetaKey
} from "@adaas/a-concept/a-component";
import { A_Context } from '@adaas/a-concept/a-context';
import { A_Concept } from '@adaas/a-concept/a-concept';

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

        const dependentComponent = A_Context.root.resolve(DependentComponent)!;

        expect(dependentComponent.dependency).toBeInstanceOf(MyComponent);
    });
    it('Should inherit component meta correctly', async () => {
        class BaseComponent extends A_Component {
            @A_Concept.Load()
            test() {

            }
        }

        class ChildComponent extends BaseComponent { }

        const baseMeta = A_Context.meta(BaseComponent);
        const childMeta = A_Context.meta(ChildComponent);

        const baseAbstractions = baseMeta.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)
        const childAbstractions = childMeta.get(A_TYPES__ComponentMetaKey.ABSTRACTIONS)

        for (const [key, value] of baseAbstractions!) {
            expect(childAbstractions!.has(key)).toBe(true);
            expect(childAbstractions!.get(key)).toBe(value);
        }
    });

}); 