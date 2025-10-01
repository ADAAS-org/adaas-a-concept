import './test.setup';

import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import { A_Entity } from "@adaas/a-concept/global/A-Entity/A-Entity.class";
import { A_TYPES__Entity_JSON } from "@adaas/a-concept/global/A-Entity/A-Entity.types";
import { A_Feature } from "@adaas/a-concept/global/A-Feature/A-Feature.class";
import { ASEID } from "@adaas/a-utils";

jest.retryTimes(0);

describe('A-Entity tests', () => {
    it('Should Allow to create an entity from undefined', async () => {
        const entity = new A_Entity();
    });
    it('Should Allow to create an entity with Default ASEID', async () => {
        const entity = new A_Entity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('core');
        expect(entity.aseid.namespace).toBe('a-concept');

    });
    it('Should Allow to create an entity with overridden ASEID Scope or Namespace', async () => {
        class MyEntity extends A_Entity {
            static get entity(): string {
                return 'my-entity-test';
            }

            static get scope(): string {
                return 'custom-scope';
            }

            static get namespace(): string {
                return 'custom-namespace';
            }
        }

        const entity = new MyEntity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('custom-scope');
        expect(entity.aseid.namespace).toBe('custom-namespace');
        expect(entity.aseid.entity).toBe('my-entity-test');

    });
    it('Should Allow to create an entity with overridden ASEID Scope or Namespace from ENV Variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_DEFAULT_SCOPE] = 'env-scope';
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE] = 'env-namespace';

        A_Context.reset();

        const entity = new A_Entity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('env-scope');
        expect(entity.aseid.namespace).toBe('env-namespace');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_DEFAULT_SCOPE];
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE];

        A_Context.reset();
    });
    it('Should Allow to create an entity from ASEID', async () => {
        const entity = new A_Entity(
            new ASEID({
                namespace: 'default',
                scope: 'default',
                entity: 'entity-a',
                id: Math.floor(Math.random() * 1000000000).toString(),
            })
        );
    });
    it('Should Allow to create an entity from string', async () => {
        const entity = new A_Entity('default@default:entity-a:123456789');

        expect(entity.aseid.toString()).toBe('default@default:entity-a:123456789');
        expect(entity.aseid.id).toBe('123456789');
    });
    it('Should Allow to create an entity from object', async () => {

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_JSON> {
            foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.aseid = new ASEID({
                    namespace: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                });
                this.foo = newEntity.foo;
            }
        }

        const entity = new MyEntity({ foo: 'bar' });

        expect(entity.foo).toBe('bar');
    });
    it('Should return an error when creating an entity from invalid string', async () => {
        expect(() => {
            const entity = new A_Entity('invalid-string');
        }).toThrowError();
    });
    it('Should Allow to rewrite initializer method without changes to other methods', async () => {

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_JSON> {
            foo!: string;

            protected getInitializer(props?: string | { foo: string; } | ({ foo: string; } & A_TYPES__Entity_JSON) | ASEID | undefined): (props: any) => void | (() => void) {
                if (typeof props === 'object' && props !== null && 'foo' in props) {
                    return this.fromFoo.bind(this);
                }
                return super.getInitializer(props);
            }


            fromFoo(props: { foo: string; }): void {
                this.foo = props.foo;
            }

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.aseid = new ASEID({
                    namespace: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                });
                this.foo = 'not a bar';
            }
        }

        const entity = new MyEntity({ foo: 'bar' });

        expect(entity.foo).toBe('bar');
    });

    it('Should allow to define a feature on an entity', async () => {


        class MyEntity extends A_Entity {
            public foo!: string;


            @A_Feature.Define()
            async doSomething() { }
        }

    });
    it('Should allow to serialize and deserialize an entity', async () => {

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_JSON> {
            public foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                this.aseid = new ASEID({
                    namespace: 'default',
                    scope: 'default',
                    entity: 'entity-a',
                    id: Math.floor(Math.random() * 1000000000).toString(),
                });
                this.foo = newEntity.foo;
            }

            fromJSON(serialized: { foo: string; } & A_TYPES__Entity_JSON): void {
                this.aseid = new ASEID(serialized.aseid);
                this.foo = serialized.foo;
                return;
            }

            toJSON(): { foo: string } & A_TYPES__Entity_JSON {
                return {
                    ...super.toJSON(),
                    foo: this.foo,
                };
            }
        }

        const entity = new MyEntity({ foo: 'baz' });
        const aseid = entity.aseid.toString();

        const serialized = entity.toJSON();
        expect(serialized.foo).toBe('baz');

        const entity2 = new MyEntity(serialized);
        expect(entity2.foo).toBe('baz');
        expect(entity2.aseid.toString()).toBe(aseid);
        expect(entity2.aseid.toString()).toBe(entity.aseid.toString());
    });

});