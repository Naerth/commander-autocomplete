import { beforeEach, describe, expect, it, jest } from 'bun:test';
import { homedir } from 'os';
import * as helpers from './helpers.js';

describe('helpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return the autocomplete file', () => {

        const binName = 'example';
        const autocompleteFile = helpers.getAutocompleteFile(binName);

        expect(autocompleteFile).toBe(`${helpers.autocompleteDir}/example`);
    });

    it('should return the completion block', () => {
        const binName = 'example';
        const completionFile = helpers.getAutocompleteFile(binName);
        const completionBlock = helpers.getCompletionBlock(completionFile);

        expect(completionBlock).toBe(`source ${completionFile.replace(homedir(), "~")}\n`);
    });
});