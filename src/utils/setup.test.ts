import fs from 'fs';
import os from 'os';
import path from 'path';
import { setupBash, generateBashTemplate } from './setup';

describe('setupBash', () => {
    const binName = 'example';
    let home: string;
    let bashrc: string;
    let completionFile: string;

    const backups = () => fs.readdirSync(home).filter(file => file.startsWith('.bashrc.'));

    beforeEach(() => {
        home = fs.mkdtempSync(path.join(os.tmpdir(), 'setup-test-'));
        bashrc = path.join(home, '.bashrc');
        completionFile = path.join(home, '.autocomplete', binName);
        jest.spyOn(os, 'homedir').mockReturnValue(home);
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        fs.rmSync(home, { recursive: true, force: true });
    });

    it('should throw on invalid binary name', () => {
        expect(() => setupBash('foo; rm -rf /')).toThrow('Invalid binary name');
    });

    it('should write the completion file', () => {
        setupBash(binName);
        expect(fs.readFileSync(completionFile, 'utf-8')).toBe(generateBashTemplate(binName));
    });

    it('should create .bashrc without backup when it does not exist', () => {
        setupBash(binName);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('source ~/.autocomplete/example\n');
        expect(backups()).toHaveLength(0);
    });

    it('should append to an existing .bashrc and back it up', () => {
        fs.writeFileSync(bashrc, 'export A=1\n');
        setupBash(binName);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('export A=1\nsource ~/.autocomplete/example\n');
        expect(backups()).toHaveLength(1);
        expect(fs.readFileSync(path.join(home, backups()[0]), 'utf-8')).toBe('export A=1\n');
    });

    it('should not glue the source line to an unterminated last line', () => {
        fs.writeFileSync(bashrc, 'export A=1');
        setupBash(binName);
        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('export A=1\nsource ~/.autocomplete/example\n');
    });

    it('should be idempotent: no duplicate line, no extra backup, completion file overwritten', () => {
        fs.writeFileSync(bashrc, 'export A=1\n');
        setupBash(binName);
        fs.writeFileSync(completionFile, 'outdated');
        setupBash(binName);

        expect(fs.readFileSync(bashrc, 'utf-8')).toBe('export A=1\nsource ~/.autocomplete/example\n');
        expect(backups()).toHaveLength(1);
        expect(fs.readFileSync(completionFile, 'utf-8')).toBe(generateBashTemplate(binName));
    });
});
