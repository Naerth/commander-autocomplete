import fs from 'fs';
import { cleanUpBash } from './cleanup';
import * as helpers from './helpers.js';

jest.mock('fs');
jest.mock('./helpers');

const mockExistsSync = fs.existsSync as jest.Mock;
const mockUnlinkSync = fs.unlinkSync as jest.Mock;
const mockWriteFileSync = fs.writeFileSync as jest.Mock;
const mockReadFileSync = fs.readFileSync as jest.Mock;

const mockGetAutocompleteFile = helpers.getAutocompleteFile as jest.Mock;
const mockGetBashrcFile = helpers.getBashrcFile as jest.Mock;
const mockGetCompletionBlock = helpers.getCompletionBlock as jest.Mock;
const mockBackupBashRc = helpers.backupBashRc as jest.Mock;



describe('cleanUpBash', () => {

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => { });
        mockExistsSync.mockReset();
        mockUnlinkSync.mockReset();
        mockReadFileSync.mockReset();
        mockWriteFileSync.mockReset();
        mockGetAutocompleteFile.mockReset();
        mockGetBashrcFile.mockReset();
        mockGetCompletionBlock.mockReset();
        mockBackupBashRc.mockReset();
    });

    const bin_name = 'test-bin';
    const completionFile = '/path/to/completion/file';
    const bashRcFile = '/path/to/bashrc/file';
    const bashrcContent = 'some content\ncompletion block\nsome other content';
    const completionBlock = 'completion block';
    // const newBashrcContent = 'some content\nsome other content';

    it('should remove the completion file if it exists and should overide bashrc file', async () => {

        mockExistsSync.mockReturnValue(true);
        mockGetAutocompleteFile.mockReturnValue(completionFile);
        mockWriteFileSync.mockImplementation(() => { });
        mockGetBashrcFile.mockReturnValue(bashRcFile);
        mockGetCompletionBlock.mockReturnValue(completionBlock);
        mockReadFileSync.mockReturnValue(bashrcContent);

        cleanUpBash(bin_name);

        // existsSync is called twice: once for completion file, once for bashrc
        expect(mockExistsSync).toHaveBeenCalledTimes(2);
        expect(mockExistsSync).toHaveBeenNthCalledWith(1, completionFile);
        expect(mockExistsSync).toHaveBeenNthCalledWith(2, bashRcFile);
        expect(mockGetBashrcFile).toHaveBeenCalledTimes(1);
        expect(mockWriteFileSync).toHaveBeenCalledTimes(1);
        expect(mockUnlinkSync).toHaveBeenCalledWith(completionFile);
        expect(mockReadFileSync).toHaveBeenCalledWith(bashRcFile, { encoding: 'utf-8' });
    });


    it('should keep bashrc intact', async () => {


        mockExistsSync.mockReturnValue(true);
        mockGetAutocompleteFile.mockReturnValue(completionFile);
        mockWriteFileSync.mockImplementation(() => { });
        mockGetBashrcFile.mockReturnValue(bashRcFile);
        mockGetCompletionBlock.mockReturnValue("completion block2");
        mockReadFileSync.mockReturnValue(bashrcContent);

        cleanUpBash(bin_name);


        expect(mockWriteFileSync).not.toHaveBeenCalled()
    });

    it('should handle missing .bashrc file gracefully', async () => {
        // First call: completion file exists, Second call: bashrc doesn't exist
        mockExistsSync
            .mockReturnValueOnce(true)  // completion file exists
            .mockReturnValueOnce(false); // bashrc doesn't exist
        mockGetAutocompleteFile.mockReturnValue(completionFile);
        mockGetBashrcFile.mockReturnValue(bashRcFile);
        mockUnlinkSync.mockImplementation(() => { });

        cleanUpBash(bin_name);

        // Should still remove completion file
        expect(mockUnlinkSync).toHaveBeenCalledWith(completionFile);
        // Should not try to read or write bashrc
        expect(mockReadFileSync).not.toHaveBeenCalled();
        expect(mockWriteFileSync).not.toHaveBeenCalled();
    });

    it('should not crash when both completion file and bashrc are missing', async () => {
        mockExistsSync.mockReturnValue(false);
        mockGetAutocompleteFile.mockReturnValue(completionFile);
        mockGetBashrcFile.mockReturnValue(bashRcFile);

        // Should not throw
        expect(() => cleanUpBash(bin_name)).not.toThrow();
        expect(mockUnlinkSync).not.toHaveBeenCalled();
        expect(mockReadFileSync).not.toHaveBeenCalled();
    });

    it('should not create backup when backup option is false', async () => {
        mockExistsSync.mockReturnValue(true);
        mockGetAutocompleteFile.mockReturnValue(completionFile);
        mockGetBashrcFile.mockReturnValue(bashRcFile);
        mockGetCompletionBlock.mockReturnValue(completionBlock);
        mockReadFileSync.mockReturnValue(bashrcContent);

        cleanUpBash(bin_name, false);

        expect(mockBackupBashRc).not.toHaveBeenCalled();
    });
});