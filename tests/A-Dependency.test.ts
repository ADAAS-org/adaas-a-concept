import { A_Component, A_Dependency, A_Entity, A_Error, A_Inject, A_Scope, A_ScopeError } from "../src";



describe('A-Dependency tests', () => {

    it('Should Allow to define a dependency', async () => {

        class Test extends A_Component {
            constructor(
                @A_Dependency.Required()
                @A_Inject(A_Component) component: A_Component,
            ) {
                super();
                expect(component).toBeInstanceOf(A_Component);
            }
        }
    });
    it('Should Resolve a component with undefined dependency', async () => {
        class DependencyRequiredComponent extends A_Component { }

        class Test extends A_Component {
            constructor(
                @A_Inject(DependencyRequiredComponent) public component?: A_Component,
            ) {
                super();
            }
        }

        const scope = new A_Scope({ components: [Test] });
        const instance = scope.resolve(Test);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(Test);
        expect(instance!.component).toBeUndefined();

    });
    it('Should throw an error if required dependency is not provided', async () => {
        class DependencyRequiredComponent extends A_Component { }

        class Test extends A_Component {
            constructor(
                @A_Dependency.Required()
                @A_Inject(DependencyRequiredComponent) component: A_Component,
            ) {
                super();
            }
        }

        const scope = new A_Scope({ components: [Test] });

        try {
            scope.resolve(Test);
        } catch (error) {
            expect(error).toBeInstanceOf(A_ScopeError);
            expect((error as A_ScopeError).title).toBe(A_ScopeError.ResolutionError);
        }

        const dependency = scope.resolve(DependencyRequiredComponent);

        expect(dependency).toBeUndefined();
    });
    it('Should resolve a component if it has default constructor for dependency', async () => {
        class MyCustomEntity extends A_Entity<{ foo: string }> {
            foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.foo = newEntity.foo;
            }
        }

        class TestC extends A_Component {
            constructor(
                @A_Dependency.Default({ foo: 'bar' })
                @A_Dependency.Required()
                @A_Inject(MyCustomEntity) public component: MyCustomEntity,
            ) {
                super();
            }
        }

        const scope = new A_Scope({ components: [TestC], entities: [MyCustomEntity] });

        const instance = scope.resolve(TestC);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(TestC);
        expect(instance!.component).toBeInstanceOf(MyCustomEntity);
        expect(instance!.component.foo).toBe('bar');
    });

});