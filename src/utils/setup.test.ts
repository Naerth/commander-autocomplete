import { beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import fs from 'fs';
import { setupBash } from './setup';
import * as cleanup from './cleanup.js';
import { autocompleteDir } from './helpers.js';

describe('setupBash', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const binName = 'example';
    const mockedMkdirSync = spyOn(fs, 'mkdirSync');
    const mockedAppendFileSync = spyOn(fs, 'appendFileSync').mockImplementation(() => { });
    const mockedCleanUpBash = spyOn(cleanup, 'cleanUpBash');

    // Disable default console.log
    spyOn(console, 'log').mockImplementation(() => { });


    it('should call cleanUpBash', () => {
        setupBash(binName);
        expect(mockedCleanUpBash).toHaveBeenCalledTimes(1);
        expect(mockedCleanUpBash).toHaveBeenCalledWith(binName);
    });

    it('should create autocomplete directory', () => {
        setupBash(binName);

        expect(mockedMkdirSync).toHaveBeenCalledTimes(1);
        expect(mockedMkdirSync).toHaveBeenCalledWith(autocompleteDir, { mode: 0o755, recursive: true });
    });

    it('should write completion file and bashrc', () => {
        setupBash(binName);
        expect(mockedAppendFileSync).toHaveBeenCalledTimes(2);
    });
});