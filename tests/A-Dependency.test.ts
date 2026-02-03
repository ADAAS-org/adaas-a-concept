import { A_Component, A_Dependency, A_Entity, A_Error, A_Feature, A_FeatureError, A_Inject, A_Scope, A_ScopeError } from "../src";



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

        class testEntity extends A_Entity {
            
            @A_Feature.Extend({
                name: 'test'
            })
            async test(
                @A_Dependency.Required()
                @A_Inject(DependencyRequiredComponent) component: DependencyRequiredComponent,
            ) {

            }
        }

        const scope = new A_Scope({ components: [Test], entities: [new testEntity()] });

        try {
            scope.resolve(Test);
        } catch (error) {
            expect(error).toBeInstanceOf(A_ScopeError);
            expect((error as A_ScopeError).title).toBe(A_ScopeError.ResolutionError);
        }

        const dependency = scope.resolve(DependencyRequiredComponent);

        expect(dependency).toBeUndefined();


        const entityInstance = scope.resolve(testEntity);

        try {
            await entityInstance?.call('test');
        } catch (error) {
            expect(error).toBeInstanceOf(A_FeatureError);
            expect((error as A_FeatureError).originalError).toBeInstanceOf(A_ScopeError);
            expect((error as A_FeatureError).originalError.title).toBe(A_ScopeError.ResolutionError);
        }

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
    it('Should resolve only dependency on the same level with Flat directive', async () => {
        class ParentComponent extends A_Component { }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Flat()
                @A_Inject(ParentComponent) public parentComponent?: ParentComponent,
            ) {
                super();

            }
        }

        const parentScope = new A_Scope({ components: [ParentComponent] });
        const childScope = new A_Scope({ components: [ChildComponent] }, { parent: parentScope });

        const instance = childScope.resolve(ChildComponent);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.parentComponent).toBeUndefined();
    });

    it('Should resolve create dependency with Create directive', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Default({ name: 'Entity A' })
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();

            }
        }

        const childScope = new A_Scope({ components: [ChildComponent], entities: [MyEntity_A] });

        const instance = childScope.resolve(ChildComponent);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.myEntityA).toBeInstanceOf(MyEntity_A);
        expect(instance!.myEntityA.name).toBe('Entity A');
    });
    it('Should resolve Parent entity if it exists, even if Default provided', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Default({ name: 'Child Entity' })
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();

            }
        }

        const parentScope = new A_Scope({ entities: [new MyEntity_A({ name: 'Parent Entity' })] });
        const childScope = new A_Scope({ components: [ChildComponent] }, { parent: parentScope });

        const instance = childScope.resolve(ChildComponent);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.myEntityA).toBeInstanceOf(MyEntity_A);
        expect(instance!.myEntityA.name).toBe('Parent Entity');
    });
    it('Should resolve dependencies properly with combination of Directives', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Flat()
                @A_Dependency.Default({ name: 'Child Entity' })
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();
            }
        }

        const parentScope = new A_Scope({ name: 'Parent Scope', entities: [new MyEntity_A({ name: 'Parent Entity' })] });
        const childScope = new A_Scope({ name: 'Child Scope', components: [ChildComponent] }, { parent: parentScope });

        const instance = childScope.resolveDependency(new A_Dependency<ChildComponent>(ChildComponent)) as ChildComponent;

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.myEntityA).toBeInstanceOf(MyEntity_A);
        expect(instance!.myEntityA.name).toBe('Child Entity');
    })
    it('Should resolve dependency from parent scope with  Parent Directive', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Parent()
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();

            }
        }

        const parentScope = new A_Scope({
            name: 'Parent Scope',
            entities: [new MyEntity_A({ name: 'Parent Entity' })]
        });
        const childScope = new A_Scope({
            name: 'Child Scope',
            components: [ChildComponent],
            entities: [new MyEntity_A({ name: 'Child Entity' })]
        }, { parent: parentScope });

        const instance = childScope.resolve(ChildComponent);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.myEntityA).toBeInstanceOf(MyEntity_A);
        expect(instance!.myEntityA.name).toBe('Parent Entity');
    });
    it('Should resolve dependency from parent scope with  Parent Directive and offset', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class ChildComponent extends A_Component {
            constructor(
                @A_Dependency.Parent(-2)
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();

            }
        }

        const grandparentScope = new A_Scope({
            name: 'Grandparent Scope',
            entities: [new MyEntity_A({ name: 'Grandparent Entity' })]
        });

        const parentScope = new A_Scope({
            name: 'Parent Scope',
            entities: [new MyEntity_A({ name: 'Parent Entity' })]
        }, { parent: grandparentScope });

        const childScope = new A_Scope({
            name: 'Child Scope',
            components: [ChildComponent],
            entities: [new MyEntity_A({ name: 'Child Entity' })]
        }, { parent: parentScope });

        const instance = childScope.resolve(ChildComponent);

        expect(instance).toBeDefined();
        expect(instance).toBeInstanceOf(ChildComponent);
        expect(instance!.myEntityA).toBeInstanceOf(MyEntity_A);
        expect(instance!.myEntityA.name).toBe('Grandparent Entity');
    });

    it('Should support proper types declaration', async () => {

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyComponent extends A_Component {
            constructor(
                @A_Dependency.Parent(-2)
                @A_Inject(MyEntity_A) public myEntityA: MyEntity_A,
            ) {
                super();

            }
        }


        const dependency = new A_Dependency(MyEntity_A, {
            query: {
                name: 'Test Entity'
            },
            pagination: {
                count: 5,
                from: 'start'
            }
        });


        // const dependency2 = new A_Dependency(MyComponent, {
        //     query: {
        //         name: 'Test Entity'
        //     },
        //     pagination: {
        //         count: 5,
        //         from: 'start'
        //     }
        // });

    });

});