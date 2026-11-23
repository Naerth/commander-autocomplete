/**
 * End-to-end test of the generated bash script:
 * the script is sourced by a real bash, with a fake binary on the PATH.
 */
import { spawnSync } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { setupBash } from './setup';

const hasBash = spawnSync('bash', ['--version']).status === 0;
const describeWithBash = hasBash ? describe : describe.skip;

describeWithBash('generated bash completion script', () => {
    const binName = 'my-cli';
    let home: string;
    let argsFile: string;
    let pwnedFile: string;

    /**
     * Simulates a <TAB> in bash and returns the content of COMPREPLY
     */
    const complete = (words: string[], cword = words.length - 1) => {
        const script = [
            `source "$HOME/.autocomplete/${binName}"`,
            `COMP_WORDS=(${words.map(word => `'${word}'`).join(' ')})`,
            `COMP_CWORD=${cword}`,
            `_${binName}_completion`,
            `printf '%s\\n' "\${COMPREPLY[@]}"`,
        ].join('\n');

        const result = spawnSync('bash', ['--norc', '--noprofile', '-c', script], {
            encoding: 'utf-8',
            env: { ...process.env, HOME: home, PATH: `${path.join(home, 'bin')}${path.delimiter}${process.env.PATH}` },
        });

        expect(result.stderr).toBe('');
        return result.stdout.split('\n').filter(Boolean);
    };

    const receivedArgs = () => fs.readFileSync(argsFile, 'utf-8').split('\n').slice(0, -1);

    beforeEach(() => {
        home = fs.mkdtempSync(path.join(os.tmpdir(), 'bash-e2e-'));
        argsFile = path.join(home, 'args');
        pwnedFile = path.join(home, 'pwned');

        jest.spyOn(os, 'homedir').mockReturnValue(home);
        jest.spyOn(console, 'log').mockImplementation(() => { });
        setupBash(binName);

        // Fake binary: records its arguments and prints hostile suggestions
        const bin = path.join(home, 'bin', binName);
        fs.mkdirSync(path.dirname(bin));
        fs.writeFileSync(bin, [
            '#!/bin/sh',
            `printf '%s\\n' "$@" > '${argsFile}'`,
            `printf '%s\\n' 'alpha' 'a b' '$(touch ${pwnedFile})' '\`touch ${pwnedFile}\`' 'beta'`,
            '',
        ].join('\n'), { mode: 0o755 });
    });

    afterEach(() => {
        jest.restoreAllMocks();
        fs.rmSync(home, { recursive: true, force: true });
    });

    it('passes the words after "--" and never executes suggestions', () => {
        const reply = complete([binName, '--help', '']);

        expect(receivedArgs()).toEqual(['completion', '--', binName, '--help', '']);
        expect(reply).toHaveLength(5);
        expect(reply).toContain('alpha');
        expect(reply).toContain('beta');
        expect(fs.existsSync(pwnedFile)).toBe(false);
    });

    it('keeps suggestions containing spaces in one piece (escaped)', () => {
        expect(complete([binName, 'a'])).toEqual(['alpha', 'a\\ b']);
    });

    it('filters suggestions with the word being typed', () => {
        expect(complete([binName, 'be'])).toEqual(['beta']);
    });

    it('only sends the words up to the cursor', () => {
        expect(complete([binName, 'al', 'after-cursor'], 1)).toEqual(['alpha']);
        expect(receivedArgs()).toEqual(['completion', '--', binName, 'al']);
    });

    it('registers the completion function for the binary', () => {
        const result = spawnSync('bash', ['--norc', '--noprofile', '-c', `source "$HOME/.autocomplete/${binName}" && complete -p ${binName}`], {
            encoding: 'utf-8',
            env: { ...process.env, HOME: home },
        });
        expect(result.stdout.trim()).toBe(`complete -o bashdefault -o default -F _${binName}_completion ${binName}`);
    });
});
