import fs from 'fs';
import { setupBash } from './setup';
import { getCompletionBlock, getAutocompleteDir, getBashrcFile, getAutocompleteFile } from './helpers';
import { cleanUpBash } from './cleanup';

jest.mock('fs');
jest.mock('./helpers');
jest.mock('./cleanup');

const mockFsMkdirSync = fs.mkdirSync as jest.Mock;
const mockFsAppendFileSync = fs.appendFileSync as jest.Mock;

const mockGetAutoCompleteDir = getAutocompleteDir as jest.Mock;
const mockGetAutoCompleteFile = getAutocompleteFile as jest.Mock;
const mockGetBashrcFile = getBashrcFile as jest.Mock;
const mockGetCompletionBlock = getCompletionBlock as jest.Mock;

const mockCleanUpBash = cleanUpBash as jest.Mock;

describe('setupBash', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        jest.clearAllMocks();
    });

    const binName = 'example';

    it('should call cleanUpBash with the correct bin name', () => {
        setupBash(binName);
        expect(mockCleanUpBash).toHaveBeenCalledWith(binName, false);
    });

    it('should create autocomplete directory with correct permissions', () => {
        const autocompleteDir = '/mocked/path';
        mockGetAutoCompleteDir.mockReturnValue(autocompleteDir);

        setupBash(binName);

        expect(mockFsMkdirSync).toHaveBeenCalledWith(autocompleteDir, { mode: 0o755, recursive: true });
    });

    it('should write the completion file with the correct content', () => {
        const completionFile = '/mocked/path/completion';
        mockGetAutoCompleteFile.mockReturnValue(completionFile);

        setupBash(binName);

        expect(mockFsAppendFileSync).toHaveBeenCalledWith(completionFile, expect.stringContaining(`function ${binName}_comp`));
    });

    it('should write to .bashrc with the correct completion block', () => {
        const bashrcFile = '/mocked/path/.bashrc';
        const completionFile = '/mocked/path/completion';
        const completionBlock = 'completion block content';
        mockGetBashrcFile.mockReturnValue(bashrcFile);
        mockGetAutoCompleteFile.mockReturnValue(completionFile);
        mockGetCompletionBlock.mockReturnValue(completionBlock);

        setupBash(binName);

        expect(mockFsAppendFileSync).toHaveBeenCalledWith(bashrcFile, completionBlock);
    });
});
