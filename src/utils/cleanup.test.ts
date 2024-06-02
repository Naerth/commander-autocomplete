import { beforeEach, describe, expect, it, jest, spyOn } from 'bun:test';
import fs from 'fs';
import { cleanUpBash } from './cleanup';
import * as helpers from './helpers.js';


describe('cleanUpBash', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    const binName = 'example';
    const completionFile = helpers.getAutocompleteFile(binName);
    const completionBlock = helpers.getCompletionBlock(completionFile);

    const mockedFsExists = spyOn(fs, 'existsSync');
    const mockedFsUnlink = spyOn(fs, 'unlinkSync');
    const mockedFsRead = spyOn(fs, 'readFileSync');
    const mockedFsWrite = spyOn(fs, 'writeFileSync');
    // Disable default console.log
    spyOn(console, 'log').mockImplementation(() => { });

    it('should remove completion file and write bashrc', () => {
        const mockedExists = mockedFsExists.mockReturnValue(true);
        const mockedUnlink = mockedFsUnlink.mockReturnValue();
        const mockedRead = mockedFsRead.mockReturnValue(completionBlock);
        const mockedWrite = mockedFsWrite.mockReturnValue();

        cleanUpBash(binName);

        expect(mockedExists).toHaveBeenCalledTimes(1);
        expect(mockedExists).toHaveBeenCalledWith(completionFile);

        expect(mockedUnlink).toHaveBeenCalledTimes(1);
        expect(mockedUnlink).toHaveBeenCalledWith(completionFile);

        expect(mockedRead).toHaveBeenCalledTimes(1);


        expect(mockedWrite).toHaveBeenCalled();
    });

    it('should remove completion file and not rewrite bashrc', () => {
        const mockedExists = mockedFsExists.mockReturnValue(true);
        const mockedUnlink = mockedFsUnlink.mockReturnValue();
        const mockedRead = mockedFsRead.mockReturnValue('');
        const mockedWrite = mockedFsWrite.mockReturnValue();

        cleanUpBash(binName);

        expect(mockedExists).toHaveBeenCalledTimes(1);
        expect(mockedExists).toHaveBeenCalledWith(completionFile);

        expect(mockedUnlink).toHaveBeenCalledTimes(1);

        expect(mockedRead).toHaveBeenCalledTimes(1);

        expect(mockedWrite).not.toHaveBeenCalled();
    });

    it('should not remove completion file and write bashrc', () => {

        const mockedExists = mockedFsExists.mockReturnValue(false);
        const mockedUnlink = mockedFsUnlink.mockReturnValue();
        const mockedRead = mockedFsRead.mockReturnValue(completionBlock);
        const mockedWrite = mockedFsWrite.mockReturnValue();

        cleanUpBash(binName);

        expect(mockedExists).toHaveBeenCalledTimes(1);
        expect(mockedExists).toHaveBeenCalledWith(completionFile);

        expect(mockedUnlink).not.toHaveBeenCalled();

        expect(mockedRead).toHaveBeenCalledTimes(1);
        expect(mockedWrite).toHaveBeenCalledTimes(1);
    });

    it('should not remove completion file and not rewrite bashrc', () => {
        const mockedExists = mockedFsExists.mockReturnValue(false);
        const mockedUnlink = mockedFsUnlink.mockReturnValue();
        const mockedRead = mockedFsRead.mockReturnValue('');
        const mockedWrite = mockedFsWrite.mockReturnValue();

        cleanUpBash(binName);

        expect(mockedExists).toHaveBeenCalledTimes(1);
        expect(mockedExists).toHaveBeenCalledWith(completionFile);

        expect(mockedUnlink).not.toHaveBeenCalled();

        expect(mockedRead).toHaveBeenCalledTimes(1);
        expect(mockedWrite).not.toHaveBeenCalled();
    });
});