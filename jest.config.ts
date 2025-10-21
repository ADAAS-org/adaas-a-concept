import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,
    roots: ['<rootDir>/tests'],
    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        "@adaas/a-concept/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@adaas/a-concept/global/(.*)": ["<rootDir>/src/global/$1"],
        "@adaas/a-concept/types/(.*)": ["<rootDir>/src/types/$1"],
        "@adaas/a-concept/helpers/(.*)": ["<rootDir>/src/helpers/$1"],
        "@adaas/a-concept/decorators/(.*)": ["<rootDir>/src/decorators/$1"],
        "@adaas/a-concept/base/(.*)": ["<rootDir>/src/base/$1"],
        "@adaas/a-concept/utils/(.*)": ["<rootDir>/src/utils/$1"]
    }

};
export default config;