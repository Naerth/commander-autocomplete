import os from 'os';
import fs from 'fs';
import { getAutocompleteFile, getCompletionBlock, getBashrcFile, getAutocompleteDir, backupBashRc, validateBinName } from './helpers.js';

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

    it('should keep path unchanged when not in home directory', () => {
        mockHomedir.mockReturnValue('/home/user');

        const completionFile = '/opt/custom/path';
        const completionBlock = getCompletionBlock(completionFile);

        expect(completionBlock).toBe(`source /opt/custom/path\n`);
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

describe('validateBinName', () => {
    it('should accept valid binary names', () => {
        expect(() => validateBinName('myapp')).not.toThrow();
        expect(() => validateBinName('my-app')).not.toThrow();
        expect(() => validateBinName('my_app')).not.toThrow();
        expect(() => validateBinName('MyApp123')).not.toThrow();
        expect(() => validateBinName('_private')).not.toThrow();
        expect(() => validateBinName('app2')).not.toThrow();
    });

    it('should reject empty or non-string binary names', () => {
        expect(() => validateBinName('')).toThrow('Binary name is required and must be a string');
        expect(() => validateBinName(null as any)).toThrow('Binary name is required and must be a string');
        expect(() => validateBinName(undefined as any)).toThrow('Binary name is required and must be a string');
        expect(() => validateBinName(123 as any)).toThrow('Binary name is required and must be a string');
    });

    it('should reject binary names that are too long', () => {
        const longName = 'a'.repeat(256);
        expect(() => validateBinName(longName)).toThrow('Binary name exceeds maximum length of 255 characters');
    });

    it('should reject binary names with path traversal attempts', () => {
        expect(() => validateBinName('../etc/passwd')).toThrow('Invalid binary name');
        expect(() => validateBinName('../../root')).toThrow('Invalid binary name');
        expect(() => validateBinName('foo/bar')).toThrow('Invalid binary name');
    });

    it('should reject binary names with command injection characters', () => {
        expect(() => validateBinName('foo; rm -rf /')).toThrow('Invalid binary name');
        expect(() => validateBinName('foo && cat /etc/passwd')).toThrow('Invalid binary name');
        expect(() => validateBinName('foo | cat')).toThrow('Invalid binary name');
        expect(() => validateBinName('foo`whoami`')).toThrow('Invalid binary name');
        expect(() => validateBinName('$(whoami)')).toThrow('Invalid binary name');
        expect(() => validateBinName('foo"bar')).toThrow('Invalid binary name');
        expect(() => validateBinName("foo'bar")).toThrow('Invalid binary name');
    });

    it('should reject binary names starting with numbers or hyphens', () => {
        expect(() => validateBinName('123app')).toThrow('Invalid binary name');
        expect(() => validateBinName('-myapp')).toThrow('Invalid binary name');
    });

    it('should reject binary names with spaces', () => {
        expect(() => validateBinName('my app')).toThrow('Invalid binary name');
        expect(() => validateBinName('my\tapp')).toThrow('Invalid binary name');
    });
});