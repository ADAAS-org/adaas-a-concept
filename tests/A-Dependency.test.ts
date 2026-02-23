import { A_Component } from "@adaas/a-concept/a-component";
import { A_Dependency } from "@adaas/a-concept/a-dependency";
import { A_Entity } from "@adaas/a-concept/a-entity";
import { A_Feature, A_FeatureError } from "@adaas/a-concept/a-feature";
import { A_Inject } from "@adaas/a-concept/a-inject";
import { A_Scope, A_ScopeError } from "@adaas/a-concept/a-scope";



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
    it('Should support directive All for query', async () => {

        const executionChain: number[] = [];

        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyComponent extends A_Component {


            @A_Feature.Extend()
            async allEntities(
                @A_Dependency.All()
                @A_Inject(MyEntity_A) entities: MyEntity_A[],
                @A_Inject(A_Scope) scope: A_Scope,
            ) {
                executionChain.push(entities.length);
            }

            @A_Feature.Extend()
            async allFlatEntities(
                @A_Dependency.Flat()
                //  That's important because current scope is feature scope, and plat applies for current scope only
                @A_Dependency.All()
                @A_Dependency.Parent(-1)
                @A_Inject(MyEntity_A) entities: MyEntity_A[],
                @A_Inject(A_Scope) scope: A_Scope,

            ) {
                executionChain.push(entities.length);
            }

            @A_Feature.Extend()
            async withImportedEntities(
                @A_Dependency.All()
                @A_Inject(MyEntity_A) entities: MyEntity_A[],
            ) {
                executionChain.push(entities.length);
            }
        }

        const parentScope = new A_Scope({
            name: 'Parent Scope',
            entities: [
                new MyEntity_A({ name: 'Entity 1' }),
                new MyEntity_A({ name: 'Entity 2' }),
                new MyEntity_A({ name: 'Entity 3' }),
            ]
        });

        const childScope = new A_Scope({
            name: 'Child Scope',
            components: [MyComponent],
            entities: [
                new MyEntity_A({ name: 'Entity 4' }),
                new MyEntity_A({ name: 'Entity 5' }),
            ]
        }, { parent: parentScope });


        const importScope = new A_Scope({
            name: 'Import Scope',
            entities: [
                new MyEntity_A({ name: 'Entity 6' }),
            ]
        });



        const componentInstance = childScope.resolve(MyComponent);

        await componentInstance?.call('allEntities');
        await componentInstance?.call('allFlatEntities');
        await componentInstance?.call('withImportedEntities');

        expect(executionChain).toEqual([5, 2, 5]);

        childScope.import(importScope);

        await componentInstance?.call('withImportedEntities');


        expect(executionChain).toEqual([5, 2, 5, 6]);


    });

    it('Should be possible to use query decorator for A_Entities in scope', async () => {

        class MyEntity_A extends A_Entity<{ name: string, group: string }> {
            name!: string;
            group!: string;

            fromNew(newEntity: { name: string; group: string }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
                this.group = newEntity.group;
            }
        }

        class MyComponent extends A_Component {
            @A_Feature.Extend()
            async simpleQuery(
                @A_Dependency.Query<MyEntity_A>({ name: 'Entity 1' })
                @A_Inject(MyEntity_A) entity: MyEntity_A,
            ) {
                expect(entity.name).toBe('Entity 1');
            }

            @A_Feature.Extend()
            async andQuery(
                @A_Dependency.Query<MyEntity_A>({ name: 'Entity 1', group: 'Group 1' })
                @A_Inject(MyEntity_A) entity: MyEntity_A,
            ) {
                expect(entity.name).toBe('Entity 1');
                expect(entity.group).toBe('Group 1');
            }

            @A_Feature.Extend()
            async paginationQuery(
                @A_Dependency.Query<MyEntity_A>({ name: 'Entity 1' }, { count: 2 })
                @A_Inject(MyEntity_A) entities: MyEntity_A[],
            ) {

                expect(entities.length).toBe(2);
                expect(entities[0].name).toBe('Entity 1');
                expect(entities[0].group).toBe('Group 1');
                expect(entities[1].name).toBe('Entity 1');
                expect(entities[1].group).toBe('Group 2');
            }
        }

        const scope = new A_Scope({
            name: 'Test Scope',
            components: [MyComponent],
            entities: [
                new MyEntity_A({ name: 'Entity 1', group: 'Group 1' }),
                new MyEntity_A({ name: 'Entity 2', group: 'Group 1' }),
                new MyEntity_A({ name: 'Entity 1', group: 'Group 2' }),
                new MyEntity_A({ name: 'Entity 2', group: 'Group 2' }),
                new MyEntity_A({ name: 'Entity 3', group: 'Group 2' }),
                new MyEntity_A({ name: 'Entity 1', group: 'Group 3' }),
                new MyEntity_A({ name: 'Entity 2', group: 'Group 3' }),
            ]
        });

        const componentInstance = scope.resolve(MyComponent);

        await componentInstance?.call('simpleQuery');
        await componentInstance?.call('andQuery');
        await componentInstance?.call('paginationQuery');

    });

});