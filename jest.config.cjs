/** @type {import('jest').Config} */
const config = {
    verbose: true,
    moduleFileExtensions : ["js", "cjs"],
    roots: [
        "<rootDir>/test"
    ],
    "testMatch": ["**/node-*.cjs"],
};

module.exports = config;