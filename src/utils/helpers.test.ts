import os from 'os';
import { getAutocompleteFile, getCompletionBlock, getBashrcFile, getAutocompleteDir } from './helpers.js';

jest.mock('os');

const mockHomedir = os.homedir as jest.Mock;

describe('helpers', () => {
    beforeEach(() => {
        mockHomedir.mockReset();
    });

    it('should return the bashrc file', () => {
        mockHomedir.mockReturnValue('/home/user');
        const bashrcFile = getBashrcFile();
        expect(bashrcFile).toBe(`/home/user/.bashrc`);
    });

    it('should return the autocomplete dir', () => {
        mockHomedir.mockReturnValue('/home/user');
        const autocompleteDir = getAutocompleteDir();
        expect(autocompleteDir).toBe(`/home/user/.autocomplete`);
    });


    it('should return the autocomplete file', () => {

        mockHomedir.mockReturnValue('/home/user');

        const binName = 'example';
        const autocompleteFile = getAutocompleteFile(binName);
        expect(autocompleteFile).toBe(`/home/user/.autocomplete/example`);
    });

    it('should return the completion block', () => {

        mockHomedir.mockReturnValue('/home/user');

        const binName = 'example';
        const completionFile = getAutocompleteFile(binName);
        const completionBlock = getCompletionBlock(completionFile);

        expect(completionBlock).toBe(`source ~/.autocomplete/example\n`);
    });

});