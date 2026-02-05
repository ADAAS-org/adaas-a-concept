import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Concept } from '@adaas/a-concept/global/A-Concept/A-Concept.class';
import { A_Container } from '@adaas/a-concept/global/A-Container/A-Container.class';
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Feature } from '@adaas/a-concept/global/A-Feature/A-Feature.class';
import { A_Fragment } from '@adaas/a-concept/global/A-Fragment/A-Fragment.class';
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { ASEID } from '@adaas/a-concept/global/ASEID/ASEID.class';
import { A_Dependency, A_Error } from '../src';

jest.retryTimes(0);

describe('A-Scope tests', () => {

    it('Should Allow to create a scope', async () => {
        const scope = new A_Scope({ name: 'TestScope' });
    });
    it('Should allow to register a component', async () => {
        const component = new A_Component();
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(component);

    });
    it('Should allow to resolve a component', async () => {
        const component = new A_Component();
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(component);

        const resolved = scope.resolve(A_Component);
        expect(resolved).toBe(component);
    });
    it('Should return an undefined when resolving a non-registered component', async () => {
        const scope = new A_Scope({ name: 'TestScope' });
        const resolved = scope.resolve(A_Component);
        expect(resolved).toBeUndefined();
    });
    it('Should be possible to set and get meta variables for scope', async () => {
        const scope = new A_Scope<{ userId: string, role: string }>({ name: 'TestScope' });

        scope.set('userId', '12345');
        scope.set('role', 'admin');

        const userId = scope.get('userId');
        const role = scope.get('role');

        expect(userId).toBe('12345');
        expect(role).toBe('admin');
    });
    it('Should be possible to set meta via constructor', async () => {
        const scope = new A_Scope<{ userId: string, role: string }>({
            name: 'TestScope',
            meta: {
                userId: '12345',
                role: 'admin'
            }
        });

        const userId = scope.get('userId');
        const role = scope.get('role');

        expect(userId).toBe('12345');
        expect(role).toBe('admin');
    });
    it('Should properly use types and generics', async () => {
        const scope = new A_Scope<{ userId: string, role: { name: string } }>({ name: 'TestScope' });

        scope.set('userId', '12345');
        scope.set('role', { name: 'admin' });

        const userId = scope.get('userId');
        const role = scope.get('role');

        expect(userId).toBe('12345');
        expect(role).toEqual({ name: 'admin' });
    });
    it('Should allow to register and resolve a component with dependencies', async () => {
        class DependentComponent extends A_Component {
            constructor(
                public dependency: A_Component
            ) {
                super();
            }
        }

        const component = new A_Component();
        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(component);
        scope.register(new DependentComponent(component));

        const resolved = scope.resolve(DependentComponent)!;
        expect(resolved).toBeInstanceOf(DependentComponent);
        expect(resolved.dependency).toBe(component);
    });

    it('should resolve component registered in parent scope', async () => {
        const parentScope = new A_Scope({ name: 'ParentScope' });
        const childScope = new A_Scope({ name: 'ChildScope' });

        childScope.inherit(parentScope);

        const component = new A_Component();
        parentScope.register(component);

        const resolved = childScope.resolve(A_Component);
        expect(resolved).toBe(component);
    });

    it('Should resolve only one entity if no query is provided', async () => {
        class MyEntity extends A_Entity<{ bar: string }> {
            public bar!: string;
            fromNew(newEntity: { bar: string; }): void {
                this.aseid = new ASEID({
                    concept: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                })
                this.bar = newEntity.bar;
            }
        }


        const scope = new A_Scope({ name: 'TestScope' });
        const entity1 = new MyEntity({ bar: 'bar' });
        const entity2 = new MyEntity({ bar: 'baz' });
        scope.register(entity1);
        scope.register(entity2);
        const resolved = scope.resolve(MyEntity);
        expect(resolved).toBe(entity1);

    });
    it('Should resolve entities based on a query', async () => {
        class MyEntity extends A_Entity<{ bar: string }> {
            public bar!: string;
            fromNew(newEntity: { bar: string; }): void {
                this.aseid = new ASEID({
                    concept: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                })
                this.bar = newEntity.bar;
            }
        }

        const scope = new A_Scope({ name: 'TestScope' });
        const entity1 = new MyEntity({ bar: 'bar' });
        const entity2 = new MyEntity({ bar: 'baz' });
        scope.register(entity1);
        scope.register(entity2);
        const resolved = scope.resolve(new A_Dependency(MyEntity, { query: { bar: 'baz' } }));
        expect(resolved).toBe(entity2);


    });
    it('Should return array if pagination.count is provided', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;
            fromNew(newEntity: { foo: string; }): void {
                this.aseid = new ASEID({
                    concept: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                })
                this.foo = newEntity.foo;
            }
        }
        const scope = new A_Scope({ name: 'TestScope' });
        for (let i = 0; i < 15; i++) {
            const entity = new MyEntity({ foo: 'bar' });
            scope.register(entity);
        }
        const resolved = scope.resolveDependency(new A_Dependency(MyEntity, { pagination: { count: 10 } }));
        expect(Array.isArray(resolved)).toBe(true);
    });
    it('Should return array with pagination.count and provided filter', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;
            fromNew(newEntity: { foo: string; }): void {
                this.aseid = new ASEID({
                    concept: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                })
                this.foo = newEntity.foo;
            }
        }
        const scope = new A_Scope({ name: 'TestScope' });
        for (let i = 0; i < 5; i++) {
            const entity = new MyEntity({ foo: 'bar' });
            scope.register(entity);
        }
        for (let i = 0; i < 5; i++) {
            const entity = new MyEntity({ foo: 'baz' });
            scope.register(entity);
        }
        const resolved = scope.resolve(new A_Dependency(MyEntity, { query: { foo: 'baz' }, pagination: { count: 10, from: 'start' } }));
        expect(Array.isArray(resolved)).toBe(true);
        expect((resolved as Array<MyEntity>).length).toBe(5);
        (resolved as Array<MyEntity>).forEach(r => {
            expect(r.foo).toBe('baz');
        });

    });
    it('Should allow to resolve A-Entity by classname', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;

            fromUndefined(): void {
                super.fromUndefined();
                this.foo = 'bar';
            }

        }

        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyEntity);

        const resolved = scope.resolveConstructor<MyEntity>('my_entity');
        const resolved2 = scope.resolveConstructor<MyEntity>('my-entity');
        const resolved3 = scope.resolveConstructor<MyEntity>('MyEntity');
        expect(resolved).toBe(MyEntity);
        expect(resolved2).toBe(MyEntity);
        expect(resolved3).toBe(MyEntity);

        const wrongConstructor = scope.resolveConstructor<MyEntity>('mya__entity');

        expect(wrongConstructor).toBeUndefined();


        const instance = new resolved();

        expect(instance).toBeInstanceOf(MyEntity);
        expect(instance.foo).toBe('bar');

    });
    it('Should allow to resolve A-Entity by classname', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.foo = newEntity.foo;
            }

        }

        const scope = new A_Scope({ name: 'TestScope' });
        scope.register(MyEntity);

        const resolved = scope.resolveConstructor<MyEntity>('my-entity');
        const resolved2 = scope.resolveConstructor<MyEntity>('my_entity');
        const resolved3 = scope.resolveConstructor<MyEntity>('MyEntity');
        expect(resolved).toBe(MyEntity);
        expect(resolved2).toBe(MyEntity);
        expect(resolved3).toBe(MyEntity);

        const wrongConstructor = scope.resolveConstructor<MyEntity>('myS-entity');

        expect(wrongConstructor).toBeUndefined();


        const instance = new resolved({ foo: 'bar' });

        expect(instance).toBeInstanceOf(MyEntity);
        expect(instance.foo).toBe('bar');

    });

    it('Should provide a proper inheritance chain', async () => {
        class customContainer extends A_Container { }
        class customEntity extends A_Entity { }

        const container = new customContainer({ name: 'CustomContainer', entities: [customEntity] })

        const concept = new A_Concept({
            containers: [container],
        });

        // root scope
        expect(concept.scope).toBe(A_Context.root);
        // root -> container.scope
        expect(container.scope.parent).toBe(concept.scope);
        const feature = new A_Feature({
            name: 'test',
            component: container
        });
        //  root -> container.scope -> feature.scope
        expect(feature.scope.parent).toBe(container.scope);
    });

    it('Should correctly resolve all dependencies', async () => {
        class fragmentA extends A_Fragment { }
        class fragmentB extends A_Fragment { }

        class componentA extends A_Component { }
        class componentB extends A_Component { }

        class customContainer extends A_Container { }
        class customEntity extends A_Entity { }


        const container = new customContainer({
            name: 'CustomContainer',
            entities: [customEntity, new customEntity()],
            components: [componentA, componentB],
            fragments: [new fragmentA(), new fragmentB()]
        })

        expect(container).toBeInstanceOf(customContainer);
        const scope = container.scope;

        expect(scope.resolve(componentA)).toBeInstanceOf(componentA);
        expect(scope.resolve(componentB)).toBeInstanceOf(componentB);

        const resolvedFragmentA = scope.resolve(fragmentA);
        const resolvedFragmentB = scope.resolve(fragmentB);

        expect(resolvedFragmentA).toBeInstanceOf(fragmentA);
        expect(resolvedFragmentB).toBeInstanceOf(fragmentB);

        expect(scope.resolve(customEntity)).toBeInstanceOf(customEntity);
    });

    it('Should resolve inherited components', async () => {
        class componentA extends A_Component { }
        class componentB extends componentA { }

        class customContainer extends A_Container { }

        const container = new customContainer({
            name: 'CustomContainer',
            components: [componentB],
        })
        expect(container.scope.has(componentB)).toBe(true);
        expect(container.scope.has(componentA)).toBe(true);

        expect(container).toBeInstanceOf(customContainer);
        const scope = container.scope;

        expect(scope.resolve(componentA)).toBeInstanceOf(componentB);
        expect(scope.resolve(componentB)).toBeInstanceOf(componentB);

    });

    it('Should be able to resolve itself', async () => {

        const scope = new A_Scope({ name: 'TestScope' });

        const resolved = scope.resolve(A_Scope);
        expect(resolved).toBe(scope);
    });
    it('Should be able to resolve scope issuer', async () => {

        const container = new A_Container();

        const resolved = container.scope.resolve(A_Container);
        expect(resolved).toBe(container);

        expect(container.scope.issuer()).toBe(container);
    });

    it('Should be able to resolve Error in scope', async () => {

        const container = new A_Container();

        container.scope.register(new A_Error('Test Error'));

        const resolved = container.scope.resolve(A_Error) as A_Error;
        expect(resolved).toBeInstanceOf(A_Error);
        expect(resolved?.message).toBe('Test Error');

        expect(container.scope.issuer()).toBe(container);
    });
    it('Should be able to resolve all Component of particular type from scope', async () => {

        class BaseComponent extends A_Component { }
        class ComponentA extends BaseComponent { }
        class ComponentB extends BaseComponent { }
        class ComponentC extends A_Component { }

        const scope = new A_Scope({ name: 'TestScope' });

        scope.register(ComponentA);
        scope.register(ComponentB);
        scope.register(ComponentC);

        const resolvedComponents = scope.resolveAll<BaseComponent>(BaseComponent);

        expect(resolvedComponents.length).toBe(2);
        //  some of  resolvedComponents should be instances of ComponentA and ComponentB
        expect(resolvedComponents.some(c => c instanceof ComponentA)).toBe(true)
        expect(resolvedComponents.some(c => c instanceof ComponentB)).toBe(true)
        //  should not contain class instance of ComponentC
        expect(resolvedComponents.some(c => c instanceof ComponentC)).toBe(false)

    });

    it('Should be able to resolve all Component of particular type from all parent scopes as well with priority from current scope', async () => {

        class BaseComponent extends A_Component { }
        class ComponentA extends BaseComponent { }
        class ComponentB extends BaseComponent { }
        class ComponentC extends BaseComponent { }
        class ComponentD extends A_Component { }

        const parentScope = new A_Scope({ name: 'ParentScope' });
        const childScope = new A_Scope({ name: 'ChildScope' });

        childScope.inherit(parentScope);

        parentScope.register(ComponentA);
        parentScope.register(ComponentB);
        childScope.register(ComponentC);
        childScope.register(ComponentD);


        const resolvedComponents = childScope.resolveAll<BaseComponent>(BaseComponent);

        expect(resolvedComponents.length).toBe(3);

        //  should not contain class instance of ComponentD
        expect(resolvedComponents).not.toContain(ComponentD);

        //  some of  resolvedComponents should be instances of ComponentA, ComponentB and ComponentC
        expect(resolvedComponents.some(c => c instanceof ComponentA)).toBe(true)
        expect(resolvedComponents.some(c => c instanceof ComponentB)).toBe(true)
        expect(resolvedComponents.some(c => c instanceof ComponentC)).toBe(true)

        //  the first element should be instance of ComponentC as it is registered in child scope
        expect(resolvedComponents[0] instanceof ComponentC).toBe(true);
    });
    it('Should resolve all entities registered in the scope', async () => {

        class MyEntity extends A_Entity { }


        const scope = new A_Scope({ name: 'TestScope' });

        scope.register(new MyEntity());
        scope.register(new MyEntity());
        scope.register(new MyEntity());

        const resolvedEntities = scope.resolveAll<MyEntity>(MyEntity);

        expect(resolvedEntities.length).toBe(3);
        resolvedEntities.forEach(entity => {
            expect(entity).toBeInstanceOf(MyEntity);
        });

    });
    it('Should resolve entities from both current and parent scopes with resolveAll', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedEntities = scope.resolveAll<MyEntity_A>(MyEntity_A);

        expect(resolvedEntities.length).toBe(2);
        expect(resolvedEntities[0].name).toBe('Entity2');
        expect(resolvedEntities[0]).toBeInstanceOf(MyEntity_A);
        expect(resolvedEntities[1].name).toBe('Entity1');
        expect(resolvedEntities[1]).toBeInstanceOf(MyEntity_B);
    });

    it('Should resolve entities from current scope only with resolveFlatAll', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedFlatEntities = scope.resolveFlatAll<MyEntity_A>(MyEntity_A);

        expect(resolvedFlatEntities.length).toBe(1);
        expect(resolvedFlatEntities[0].name).toBe('Entity2');
        expect(resolvedFlatEntities[0]).toBeInstanceOf(MyEntity_A);
    });

    it('Should resolve base class entity from current scope with resolve', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedA = scope.resolve<MyEntity_A>(MyEntity_A);

        expect(resolvedA).toBeDefined();
        expect(resolvedA?.name).toBe('Entity2');
        expect(resolvedA).toBeInstanceOf(MyEntity_A);
        expect(resolvedA).not.toBeInstanceOf(MyEntity_B);
    });

    it('Should resolve derived class entity from parent scope with resolve', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedB = scope.resolve<MyEntity_B>(MyEntity_B);

        expect(resolvedB).toBeDefined();
        expect(resolvedB?.name).toBe('Entity1');
        expect(resolvedB).toBeInstanceOf(MyEntity_B);
    });

    it('Should not resolve derived class entity from parent scope with resolveFlat', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedFlatB = scope.resolveFlat<MyEntity_A>(MyEntity_B);
        expect(resolvedFlatB).toBeUndefined();
    });

    it('Should resolve entity by class name from current scope', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedByNameA = scope.resolve<MyEntity_A>('MyEntity_A') as MyEntity_A;
        expect(resolvedByNameA).toBeInstanceOf(MyEntity_A);
        expect(resolvedByNameA?.name).toBe('Entity2');
    });

    it('Should resolve entity by class name from parent scope', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolvedByName = scope.resolve<MyEntity_B>('MyEntity_B') as MyEntity_B;
        expect(resolvedByName).toBeInstanceOf(MyEntity_B);
        expect(resolvedByName?.name).toBe('Entity1')
    });

    it('Should not resolve entity by class name from parent scope with resolveFlat', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const parentScope = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scope = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        }).inherit(parentScope);

        const resolveByNameFlat = scope.resolveFlat<MyEntity_A>('MyEntity_B');
        expect(resolveByNameFlat).toBeUndefined();
    });

    it('Should allow to extend scope with imports', async () => {
        class MyEntity_A extends A_Entity<{ name: string }> {
            name!: string;

            fromNew(newEntity: { name: string; }): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
            }
        }

        class MyEntity_B extends MyEntity_A { }

        const scopeA = new A_Scope({
            name: 'ParentScope',
            entities: [new MyEntity_B({ name: 'Entity1' })]
        });

        const scopeB = new A_Scope({
            name: 'TestScope',
            entities: [new MyEntity_A({ name: 'Entity2' })]
        });

        scopeB.import(scopeA);

        const resolvedA = scopeB.resolve<MyEntity_B>(MyEntity_B);
        expect(resolvedA).toBeInstanceOf(MyEntity_B);
        expect(resolvedA?.name).toBe('Entity1');
    });

    it('Should deregister entities properly', async () => {

        class MyEntity extends A_Entity { }

        class MyFragment extends A_Fragment { }

        class MyComponent extends A_Component { }

        const scope = new A_Scope({ name: 'TestScope' });



        const entity = new MyEntity();
        const fragment = new MyFragment();

        scope.register(entity);
        scope.register(fragment);
        scope.register(MyComponent);

        expect(scope.has(MyEntity)).toBe(true);
        expect(scope.has(MyFragment)).toBe(true);
        expect(scope.has(MyComponent)).toBe(true);

        scope.deregister(entity);
        scope.deregister(fragment);
        scope.deregister(MyComponent);

        expect(scope.has(MyEntity)).toBe(false);
        expect(scope.has(MyFragment)).toBe(false);
        expect(scope.has(MyComponent)).toBe(false);
    });

    it('Should deregister all entities by class', async () => {

        class BaseEntity extends A_Entity { }

        class MyEntityA extends A_Entity { }
        class MyEntityB extends BaseEntity { }


        const scope = new A_Scope({ name: 'TestScope' });



        const entityA1 = new MyEntityA();
        const entityA2 = new MyEntityA();
        const entityB1 = new MyEntityB();

        scope.register(entityA1);
        scope.register(entityA2);
        scope.register(entityB1);

        expect(scope.resolveAll(MyEntityA).length).toBe(2);
        expect(scope.resolveAll(BaseEntity).length).toBe(1);

        scope.deregister(MyEntityA);

        expect(scope.resolveAll(MyEntityA).length).toBe(0);
        expect(scope.resolveAll(BaseEntity).length).toBe(1);

        const entityB2 = new MyEntityB();
        scope.register(entityB2);

        expect(scope.resolveAll(BaseEntity).length).toBe(2);

        scope.deregister(BaseEntity);

        expect(scope.resolveAll(BaseEntity).length).toBe(0);
    });
    it('Should register/deregister fragments with the same names', async () => {

        class MyFragment extends A_Fragment {

            array: string[] = [];

            constructor(name: string) {
                super({ name });
            }
        }

        const scope = new A_Scope({ name: 'TestScope' });

        const fragmentA1 = new MyFragment('fragmentA');

        scope.register(fragmentA1);

        expect(scope.has(MyFragment)).toBe(true);
        expect(scope.resolve(MyFragment)).toBe(fragmentA1);

        scope.deregister(fragmentA1);

        fragmentA1.array.push('newData');


        expect(scope.has(MyFragment)).toBe(false);

        const fragmentA2 = new MyFragment('fragmentA');

        scope.register(fragmentA2);

        expect(scope.has(MyFragment)).toBe(true);
        expect(scope.resolve(MyFragment)).toBe(fragmentA2);
        expect(fragmentA2.array.length).toBe(0);
    });
});
