import './test.setup';

import { A_ConfigLoader } from "@adaas/a-concept/base/A-Config/A-Config.container";
import { A_Config } from "@adaas/a-concept/base/A-Config/A-Config.context";
import { ENVConfigReader } from "@adaas/a-concept/base/A-Config/components/ENVConfigReader.component";
import { FileConfigReader } from "@adaas/a-concept/base/A-Config/components/FileConfigReader.component";
import { A_CONSTANTS__DEFAULT_ENV_VARIABLES } from "@adaas/a-concept/constants/env.constants";
import { A_Context } from "@adaas/a-concept/global/A-Context/A-Context.class";
import fs from 'fs';

jest.retryTimes(0);

describe('A-Config tests', () => {
    it('Should Allow to create a config object', async () => {
        const config = new A_Config({
            variables: [],
            defaults: {}
        });
    });
    it('Should Allow to create a config object with default values', async () => {
        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        expect(config.get('TEST_VAR1')).toBe('default1');
        expect(config.get('TEST_VAR2')).toBeUndefined();
    });
    it('Should Allow to create a config object with ENV values', async () => {
        process.env['TEST_VAR1'] = 'env1';
        process.env['TEST_VAR2'] = 'env2';

        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [ENVConfigReader]
        })

        await configLoader.prepare(config as any);
        await configLoader.readVariables(config as any);



        expect(config.get('TEST_VAR1')).toBe('env1');
        expect(config.get('TEST_VAR2')).toBe('env2');

        delete process.env['TEST_VAR1'];
        delete process.env['TEST_VAR2'];
    });
    it('Should not Change Names of default env variables', async () => {
        process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE] = 'my-project';
        process.env['TEST_VAR2'] = 'env2';

        A_Context.reset();


        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [ENVConfigReader]
        })


        await configLoader.prepare(config as any);
        await configLoader.readVariables(config as any);


        expect(config.get('TEST_VAR1')).toBe('default1');
        expect(config.get('TEST_VAR2')).toBe('env2');
        expect(config.get('A_CONCEPT_NAMESPACE')).toBe('my-project');

        delete process.env[A_CONSTANTS__DEFAULT_ENV_VARIABLES.A_CONCEPT_NAMESPACE];
        delete process.env['TEST_VAR2'];

        // then reset context root
        A_Context.reset();

    });
    it('Should Throw an error if strict is true and variable is not defined', async () => {
        expect(() => {
            const config = new A_Config({
                strict: true,
                variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
                defaults: {
                    TEST_VAR1: 'default1',
                }
            });

            config.get('TEST_VAR3' as any);

        }).toThrowError();
    });
    it('Should Allow to create a config object with variables from File', async () => {

        // 1. create a config file
        fs.writeFileSync('a-concept.conf.json', JSON.stringify({
            testVar1: 'env1',
            testVar2: 'env2'
        }, null, 4));

        const config = new A_Config({
            variables: ['TEST_VAR1', 'TEST_VAR2'] as const,
            defaults: {
                TEST_VAR1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [FileConfigReader]
        })

        await configLoader.prepare(config as any);
        await configLoader.readVariables(config as any);



        expect(config.get('TEST_VAR1')).toBe('env1');
        expect(config.get('TEST_VAR1')).toBe('env1');

        // 3. delete the config file
        fs.unlinkSync('a-concept.conf.json');
    });
      it('Should Allow to create a config object with variables from File with different variable cases', async () => {

        // 1. create a config file
        fs.writeFileSync('a-concept.conf.json', JSON.stringify({
            testVar2: 'env2'
        }, null, 4));

        const config = new A_Config({
            variables: ['testVar1', 'testVar2'] as const,
            defaults: {
                testVar1: 'default1',
            }
        });

        const configLoader = new A_ConfigLoader({
            name: 'test-config-loader',
            fragments: [config],
            components: [FileConfigReader]
        })

        await configLoader.prepare(config as any);
        await configLoader.readVariables(config as any);



        expect(config.get('testVar1')).toBe('default1');
        expect(config.get('testVar2')).toBe('env2');

        // 3. delete the config file
        fs.unlinkSync('a-concept.conf.json');
    });
});