import os from 'os';
import fs from 'fs';
import { getAutocompleteFile, getCompletionBlock, getBashrcFile, getAutocompleteDir, backupBashRc } from './helpers.js';

jest.mock('fs');
jest.mock('os');

const mockDateNow = jest.spyOn(Date, 'now').mockImplementation(() => 1234567890);
const mockFsCopyFileSync = fs.copyFileSync as jest.Mock;
const mockHomedir = os.homedir as jest.Mock;

describe('helpers', () => {
    beforeEach(() => {
        mockHomedir.mockReset();
        mockFsCopyFileSync.mockReset();
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

    it('should copy the bashrc file to a backup file', () => {

        mockFsCopyFileSync.mockImplementation(() => { });
        const bashRcFile = '/home/user/.bashrc';
        const backupBashRcFile = backupBashRc(bashRcFile);

        expect(mockDateNow).toHaveBeenCalled();
        expect(mockFsCopyFileSync).toHaveBeenCalledWith(bashRcFile, `${bashRcFile}.1234567890`);
        expect(backupBashRcFile).toBe(`${bashRcFile}.1234567890`);
    });

});