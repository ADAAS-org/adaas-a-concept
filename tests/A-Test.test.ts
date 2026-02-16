import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from "@adaas/a-concept/a-context";
import {
    A_Entity,
    A_TYPES__Entity_Serialized
} from "@adaas/a-concept/a-entity";
import { A_Feature } from "@adaas/a-concept/a-feature";
import { ASEID } from '@adaas/a-concept/aseid';

jest.retryTimes(0);

describe('A-Entity tests', () => {
    it('Should Allow to create an entity from undefined', async () => {
        A_Entity.concept
        const entity = new A_Entity();
    });
    it('Should Allow to create an entity with Default ASEID', async () => {
        const entity = new A_Entity();

        expect(entity.aseid).toBeInstanceOf(ASEID);
        expect(entity.aseid.scope).toBe('root');
        expect(entity.aseid.concept).toBe('a-concept');

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
    // it('Should Allow to create an entity with overridden ASEID Scope or Concept from ENV Variables', async () => {
    //     process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = 'env-scope';
    //     process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'env-concept';

    //     A_Context.reset();

    //     const entity = new A_Entity();

    //     expect(entity.aseid).toBeInstanceOf(ASEID);
    //     expect(entity.aseid.scope).toBe('env-scope');
    //     expect(entity.aseid.concept).toBe('env-concept');

    //     delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE];
    //     delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME];

    //     A_Context.reset();
    // });
   
});