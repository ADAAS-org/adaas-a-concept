import { A_Component } from "@adaas/a-concept/global/A-Component/A-Component.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_Scope } from "@adaas/a-concept/global/A-Scope/A-Scope.class";
import { ASEID } from "@adaas/a-utils";

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
    it('Should return an error when resolving a non-registered component', async () => {
        const scope = new A_Scope({ name: 'TestScope' });
        expect(() => scope.resolve(A_Component)).toThrowError();
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

        const resolved = scope.resolve(DependentComponent);
        expect(resolved).toBeInstanceOf(DependentComponent);
        expect(resolved.dependency).toBe(component);
    });

    it('should resolve component registered in parent scope', async () => {
        const parentScope = new A_Scope({ name: 'ParentScope' });
        const childScope = new A_Scope({ name: 'ChildScope'});

        childScope.parent(parentScope);

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
                    namespace: 'default',
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
                    namespace: 'default',
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
        const resolved = scope.resolve(MyEntity, { query: { bar: 'baz' } });
        expect(resolved).toBe(entity2);


    });
    it('Should return array if pagination.count is provided', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;
            fromNew(newEntity: { foo: string; }): void {
                this.aseid = new ASEID({
                    namespace: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                })
                this.foo = newEntity.foo;
            }
        }
        const scope = new A_Scope({ name: 'TestScope' });
        for (let i = 0; i < 10; i++) {
            const entity = new MyEntity({ foo: 'bar' });
            scope.register(entity);
        }
        const resolved = scope.resolve(MyEntity, { pagination: { count: 10 } });
        expect(Array.isArray(resolved)).toBe(true);
    });
    it('Should return array with pagination.count and provided filter', async () => {
        class MyEntity extends A_Entity<{ foo: string }> {
            public foo!: string;
            fromNew(newEntity: { foo: string; }): void {
                this.aseid = new ASEID({
                    namespace: 'default',
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
        const resolved = scope.resolve(MyEntity, { query: { foo: 'baz' }, pagination: { count: 10 } });
        expect(Array.isArray(resolved)).toBe(true);
        expect((resolved as Array<MyEntity>).length).toBe(5);
        (resolved as Array<MyEntity>).forEach(r => {
            expect(r.foo).toBe('baz');
        });

    });

});
