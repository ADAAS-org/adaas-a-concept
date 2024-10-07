import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
    verbose: true,

    transform: {
        '^.+\\.tsx?$': 'ts-jest'
    },
    moduleNameMapper: {
        "@adaas/a-concept/constants/(.*)": ["<rootDir>/src/constants/$1"],
        "@adaas/a-concept/global/(.*)": ["<rootDir>/src/global/$1"],
        "@adaas/a-concept/types/(.*)": ["<rootDir>/src/types/$1"],
        "@adaas/a-concept/helpers/(.*)": ["<rootDir>/src/helpers/$1"],
        "@adaas/a-concept/decorators/(.*)": ["<rootDir>/src/decorators/$1"],
        "@adaas/a-concept/managers/(.*)": ["<rootDir>/src/managers/$1"],
        "@adaas/a-concept/providers/(.*)": ["<rootDir>/src/providers/$1"],
        "@adaas/a-concept/modules/(.*)": ["<rootDir>/src/modules/$1"],
    }

};
export default config;