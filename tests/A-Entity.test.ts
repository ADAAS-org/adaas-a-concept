import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from "@adaas/a-concept/a-context";
import {
    A_Entity,
    A_TYPES__Entity_Serialized
} from "@adaas/a-concept/a-entity";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { ASEID } from '@adaas/a-concept/aseid';
import { A_Scope } from "@adaas/a-concept/a-scope";

jest.retryTimes(0);

describe('A-Entity tests', () => {
    it('Should Allow to create an entity from undefined', async () => {
        const entity = new A_Entity();
    });
    it('Should Allow to create an entity with Default ASEID', async () => {
        const entity = new A_Entity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('root');
        expect(entity.aseid.concept).toBe('a-concept');

    });
    it('Should handle proper types declaration', async () => {
        type MyInitType = {
            name: string;
            customId: number;
        }

        type mySerializedType = {
            name: string;
            serializedFlag: boolean;
            customId: number;
        } & A_TYPES__Entity_Serialized;

        class MyEntity extends A_Entity<MyInitType, mySerializedType> {
            public name!: string;
            public customId!: number;

            fromNew(newEntity: MyInitType): void {
                super.fromNew(newEntity);
                this.name = newEntity.name;
                this.customId = newEntity.customId;
            }

            fromJSON(serialized: mySerializedType): void {
                this.aseid = new ASEID(serialized.aseid);
                this.name = serialized.name;
                this.customId = serialized.customId;
                return;
            }


            toJSON(): mySerializedType {
                return {
                    ...super.toJSON(),
                    name: this.name,
                    customId: this.customId,
                    serializedFlag: true,
                };
            }
        }


        const entityInstance = new MyEntity({
            name: 'Test Entity',
            customId: 42,
        });

        expect(entityInstance.name).toBe('Test Entity');
        expect(entityInstance.customId).toBe(42);

        const serialized = entityInstance.toJSON();
        expect(serialized.name).toBe('Test Entity');
        expect(serialized.customId).toBe(42);
        expect(serialized.serializedFlag).toBe(true);

        const deserializedEntity = new MyEntity(serialized);
        expect(deserializedEntity.name).toBe('Test Entity');
        expect(deserializedEntity.customId).toBe(42);
        expect(deserializedEntity.aseid.toString()).toBe(entityInstance.aseid.toString());
    });
    it('Should be possible to allocate a scope for entity', async () => {

        let resultScope: A_Scope | undefined = undefined;


        class MyEntity extends A_Entity {

            scope!: A_Scope;

            fromNew(newEntity: any): void {
                super.fromNew(newEntity);

                resultScope = new A_Scope({ name: 'entity-scope' });

                this.scope = A_Context.allocate(this, resultScope);
            }

            fromUndefined(): void {
                super.fromUndefined();

                resultScope = new A_Scope({ name: 'entity-scope' });

                this.scope = A_Context.allocate(this, resultScope);
            }

        }


        const entityInstance = new MyEntity();


        const ParentScope = new A_Scope({
            name: 'parent-scope',
            entities: [entityInstance]
        });

        expect(resultScope).toBeInstanceOf(A_Scope);
        expect(entityInstance.scope).toBe(resultScope);
        expect(resultScope!.issuer()).toBe(entityInstance);
        expect(A_Context.scope(entityInstance)).toBe(ParentScope);
    });
    it('Should Allow to create an entity with overridden ASEID Scope or Concept', async () => {
        class MyEntity extends A_Entity {
            static get entity(): string {
                return 'my-entity-test';
            }

            static get scope(): string {
                return 'custom-scope';
            }

            static get concept(): string {
                return 'custom-concept';
            }
        }

        const entity = new MyEntity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('custom-scope');
        expect(entity.aseid.concept).toBe('custom-concept');
        expect(entity.aseid.entity).toBe('my-entity-test');

    });
    it('Should Allow to create an entity with overridden ASEID Scope or Concept from ENV Variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = 'env-scope';
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'env-concept';

        A_Context.reset();

        const entity = new A_Entity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('env-scope');
        expect(entity.aseid.concept).toBe('env-concept');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE];
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME];

        A_Context.reset();
    });
    it('Should Allow to create an entity from ASEID', async () => {
        const entity = new A_Entity(
            new ASEID({
                concept: 'default',
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

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_Serialized> {
            foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.aseid = new ASEID({
                    concept: 'default',
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

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_Serialized> {
            foo!: string;

            protected getInitializer(props?: string | { foo: string; } | ({ foo: string; } & A_TYPES__Entity_Serialized) | ASEID | undefined): (props: any) => void | (() => void) {
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
                    concept: 'default',
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

        class MyEntity extends A_Entity<{ foo: string }, { foo: string } & A_TYPES__Entity_Serialized> {
            public foo!: string;

            fromNew(newEntity: { foo: string; }): void {
                super.fromNew(newEntity);
                this.foo = newEntity.foo;
            }

            fromJSON(serialized: { foo: string; } & A_TYPES__Entity_Serialized): void {
                this.aseid = new ASEID(serialized.aseid);
                this.foo = serialized.foo;
                return;
            }

            toJSON(): { foo: string } & A_TYPES__Entity_Serialized {
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