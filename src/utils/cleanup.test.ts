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

        expect(mockExistsSync).toHaveBeenCalledTimes(1);
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
});