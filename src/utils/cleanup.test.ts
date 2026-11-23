import fs from 'fs';
import os from 'os';
import path from 'path';
import { cleanUpBash } from './cleanup';

describe('cleanUpBash', () => {
    const binName = 'test-bin';
    let home: string;
    let bashrc: string;
    let completionFile: string;

    const backups = () => fs.readdirSync(home).filter(file => file.startsWith('.bashrc.'));

    beforeEach(() => {
        home = fs.mkdtempSync(path.join(os.tmpdir(), 'cleanup-test-'));
        bashrc = path.join(home, '.bashrc');
        completionFile = path.join(home, '.autocomplete', binName);
        fs.mkdirSync(path.dirname(completionFile));
        jest.spyOn(os, 'homedir').mockReturnValue(home);
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        fs.rmSync(home, { recursive: true, force: true });
    });

    it('should throw on invalid binary name', () => {
        expect(() => cleanUpBash('../etc')).toThrow('Invalid binary name');
    });

    it('should remove the completion file and its line in .bashrc, with a backup', () => {
        const content = 'some content\nsource ~/.autocomplete/test-bin\nsome other content\n';
        fs.writeFileSync(completionFile, 'completion');
        fs.writeFileSync(bashrc, content);

        cleanUpBash(binName);

        expect(fs.existsSync(completionFile)).toBe(false);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('some content\nsome other content\n');
        expect(backups()).toHaveLength(1);
        expect(fs.readFileSync(path.join(home, backups()[0]), 'utf-8')).toBe(content);
    });

    it('should remove the line even when it is the unterminated last line', () => {
        fs.writeFileSync(bashrc, 'some content\nsource ~/.autocomplete/test-bin');
        cleanUpBash(binName);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('some content');
    });

    it('should keep lines of other binaries', () => {
        const content = 'source ~/.autocomplete/test-bin2\nsource ~/.autocomplete/other\n';
        fs.writeFileSync(bashrc, content);
        cleanUpBash(binName);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe(content);
    });

    it('should keep .bashrc intact and not back it up when there is nothing to remove', () => {
        fs.writeFileSync(bashrc, 'some content\n');
        const write = jest.spyOn(fs, 'writeFileSync');

        cleanUpBash(binName);

        expect(write).not.toHaveBeenCalled();
        expect(backups()).toHaveLength(0);
    });

    it('should handle missing .bashrc file gracefully', () => {
        fs.writeFileSync(completionFile, 'completion');
        expect(() => cleanUpBash(binName)).not.toThrow();
        expect(fs.existsSync(completionFile)).toBe(false);
        expect(fs.existsSync(bashrc)).toBe(false);
    });

    it('should not crash when both completion file and .bashrc are missing', () => {
        expect(() => cleanUpBash(binName)).not.toThrow();
    });

    it('should not create backup when backup option is false', () => {
        fs.writeFileSync(bashrc, 'source ~/.autocomplete/test-bin\n');
        cleanUpBash(binName, false);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('');
        expect(backups()).toHaveLength(0);
    });
});
