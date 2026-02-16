import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    displayName: 'adaas-a-concept',
    preset: 'ts-jest',
    testEnvironment: 'node',
    resetModules: true,
    rootDir: '.',
    testMatch: ['<rootDir>/tests/**/*.test.ts'],
    setupFilesAfterEnv: ['<rootDir>/tests/jest.setup.ts'],
    moduleNameMapper: {
        '^@adaas/a-concept/constants/(.*)$': '<rootDir>/src/constants/$1',
        '^@adaas/a-concept/utils/(.*)$': '<rootDir>/src/utils/$1',
        '^@adaas/a-concept/env$': '<rootDir>/src/env/index.node.ts',
        '^@adaas/a-concept/helpers/(.*)$': '<rootDir>/src/helpers/$1',
        '^@adaas/a-concept/types$': '<rootDir>/src/types',
        '^@adaas/a-concept/a-abstraction$': '<rootDir>/src/lib/A-Abstraction',
        '^@adaas/a-concept/a-caller$': '<rootDir>/src/lib/A-Caller',
        '^@adaas/a-concept/a-component$': '<rootDir>/src/lib/A-Component',
        '^@adaas/a-concept/a-concept$': '<rootDir>/src/lib/A-Concept',
        '^@adaas/a-concept/a-container$': '<rootDir>/src/lib/A-Container',
        '^@adaas/a-concept/a-context$': '<rootDir>/src/lib/A-Context',
        '^@adaas/a-concept/a-dependency$': '<rootDir>/src/lib/A-Dependency',
        '^@adaas/a-concept/a-entity$': '<rootDir>/src/lib/A-Entity',
        '^@adaas/a-concept/a-error$': '<rootDir>/src/lib/A-Error',
        '^@adaas/a-concept/a-feature$': '<rootDir>/src/lib/A-Feature',
        '^@adaas/a-concept/a-fragment$': '<rootDir>/src/lib/A-Fragment',
        '^@adaas/a-concept/a-inject$': '<rootDir>/src/lib/A-Inject',
        '^@adaas/a-concept/a-meta$': '<rootDir>/src/lib/A-Meta',
        '^@adaas/a-concept/a-scope$': '<rootDir>/src/lib/A-Scope',
        '^@adaas/a-concept/a-stage$': '<rootDir>/src/lib/A-Stage',
        '^@adaas/a-concept/a-step-manager$': '<rootDir>/src/lib/A-StepManager',
        '^@adaas/a-concept/aseid$': '<rootDir>/src/lib/ASEID',
    },
    collectCoverageFrom: ['src/**/*.ts', '!src/**/*.d.ts'],
};
export default config;