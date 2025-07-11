import type { Config } from 'jest';

const config: Config = {
    transform: {
        "\\.[jt]s$": "ts-jest",
    },
    verbose: true,
    preset: 'ts-jest',
    moduleFileExtensions: ['ts', 'js'],
    roots: ['<rootDir>/src'],
    testMatch: ['**/*.test.ts'],
    moduleNameMapper: {
        "(.+)\\.js$": "$1"
    },
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'html', 'json-summary'],
};

export default config;