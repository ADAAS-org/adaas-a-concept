import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from '@adaas/a-concept/global/A-Context/A-Context.class';
import { ASEID } from "@adaas/a-concept/global/ASEID/ASEID.class";

jest.retryTimes(0);

describe('ASEID Tests', () => {
    it('Should allow to create a new ASEID object with all parameters', async () => {
        const aseid = new ASEID({
            concept: 'my-concept',
            scope: 'my-scope',
            entity: 'my-entity',
            id: '123',
            version: 'v1',
            shard: 'shard1'
        });

        expect(aseid.concept).toBe('my-concept');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('123');
        expect(aseid.version).toBe('v1');
        expect(aseid.shard).toBe('shard1');
        expect(aseid.toString()).toBe('my-concept@my-scope:my-entity:shard1.123@v1');
    });
    it('Should allow to create a new ASEID object with required parameters only', async () => {
        const aseid = new ASEID({
            entity: 'my-entity',
            id: 123,
        });

        expect(aseid.concept).toBe('a-concept');
        expect(aseid.scope).toBe('root');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('0000000123');
        expect(aseid.version).toBeUndefined();
        expect(aseid.shard).toBeUndefined();
        expect(aseid.toString()).toBe('a-concept@root:my-entity:0000000123');
    });
    it('Should allow to create a new ASEID object from string', async () => {
        const aseid = new ASEID('my-concept@my-scope:my-entity:shard1.123@v1');

        expect(aseid.concept).toBe('my-concept');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('123');
        expect(aseid.version).toBe('v1');
        expect(aseid.shard).toBe('shard1');
        expect(aseid.toString()).toBe('my-concept@my-scope:my-entity:shard1.123@v1');
    });
    it('Should allow to create with Custom Env Variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME] = 'my-project';
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE] = 'my-scope';

        A_Context.reset();

        const aseid = new ASEID({
            entity: 'my-entity',
            id: 123,
        });

        expect(aseid.concept).toBe('my-project');
        expect(aseid.scope).toBe('my-scope');
        expect(aseid.entity).toBe('my-entity');
        expect(aseid.id).toBe('0000000123');
        expect(aseid.version).toBeUndefined();
        expect(aseid.shard).toBeUndefined();
        expect(aseid.toString()).toBe('my-project@my-scope:my-entity:0000000123');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAME];
        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_ROOT_SCOPE];
    });
});