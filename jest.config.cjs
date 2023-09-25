/** @type {import('jest').Config} */
const config = {
    verbose: true,
    moduleFileExtensions : ["js", "cjs"],
    roots: [
        "<rootDir>/tests/node"
    ],
    "testMatch": ["**/node-*.cjs"],
};

module.exports = config;