/**
 * End-to-end tests of the `completion` sub-command:
 * the words go through the real Commander.js parsing, like when bash calls the binary.
 */
import { Option } from 'commander';
import { Command } from './command.js';
import { setupBash } from '../utils/setup.js';
import { cleanUpBash } from '../utils/cleanup.js';

jest.mock('../utils/setup');
jest.mock('../utils/cleanup');

const createProgram = () => {
    const program = new Command();
    program.name('example').version('9.9.9').option('-g, --global');

    const hello = program
        .command('hello')
        .alias('hi')
        .option('-d, --debug')
        .action(() => { });

    hello
        .command('world')
        .option('--loud')
        .addOption(new Option('--type <type>').choices(['full', 'shallow']))
        .action(() => { });

    program
        .command('dyn')
        .autocomplete(() => ['a b', '$(touch /tmp/pwned)'])
        .action(() => { });

    return program;
};

describe('completion sub-command', () => {
    let log: jest.SpyInstance;
    let stdout: jest.SpyInstance;

    /**
     * Run `example completion ...args` and return the printed suggestions
     */
    const complete = async (...args: string[]) => {
        await createProgram().parseAsync(['node', 'example', 'completion', ...args]);
        return log.mock.calls.flatMap(call => String(call[0]).split('\n'));
    };

    beforeEach(() => {
        jest.clearAllMocks();
        log = jest.spyOn(console, 'log').mockImplementation(() => { });
        stdout = jest.spyOn(process.stdout, 'write').mockImplementation(() => true);
        jest.spyOn(process, 'exit').mockImplementation((code) => {
            throw new Error(`process.exit(${code}) called`);
        });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it('suggests root commands and options', async () => {
        expect(await complete('--', 'example', '')).toEqual(['--global', '--version', '-V', '-g', 'dyn', 'hello']);
    });

    it('still works when the words are not preceded by "--" (older bash scripts)', async () => {
        expect(await complete('example', 'hello', '')).toEqual(['--debug', '-d', 'world']);
    });

    it('goes down to nested sub-commands', async () => {
        expect(await complete('--', 'example', 'hello', 'world', '')).toEqual(['--loud', '--type']);
    });

    it('resolves sub-commands by alias', async () => {
        expect(await complete('--', 'example', 'hi', 'world', '--l')).toEqual(['--loud']);
    });

    it('suggests option choices of nested sub-commands', async () => {
        expect(await complete('--', 'example', 'hello', 'world', '--type', '')).toEqual(['full', 'shallow']);
    });

    it('does not suggest a root option already typed', async () => {
        expect(await complete('--', 'example', '-g', '')).toEqual(['--version', '-V', 'dyn', 'hello']);
    });

    it.each([
        ['with "--"', ['--']],
        ['without "--"', []],
    ])('never interprets typed words as real options (%s)', async (_, prefix) => {
        expect(await complete(...prefix, 'example', 'hello', '--help', '')).toEqual(['--debug', '-d', 'world']);
        log.mockClear();
        expect(await complete(...prefix, 'example', '--version', '')).toEqual(['--global', '-g', 'dyn', 'hello']);
        log.mockClear();
        expect(await complete(...prefix, 'example', '--setup', '')).toEqual(['--global', '--version', '-V', '-g', 'dyn', 'hello']);
        log.mockClear();
        expect(await complete(...prefix, 'example', '--cleanup', '')).toEqual(['--global', '--version', '-V', '-g', 'dyn', 'hello']);

        expect(stdout).not.toHaveBeenCalled();
        expect(setupBash).not.toHaveBeenCalled();
        expect(cleanUpBash).not.toHaveBeenCalled();
    });

    it('prints one suggestion per line, so suggestions can contain spaces', async () => {
        await complete('--', 'example', 'dyn', '');
        expect(log).toHaveBeenCalledTimes(1);
        expect(log).toHaveBeenCalledWith('$(touch /tmp/pwned)\na b');
    });

    it('prints nothing when there is no suggestion', async () => {
        expect(await complete('--', 'example', 'hello', 'world', 'zzz')).toEqual([]);
    });

    it('works with the synchronous parse()', async () => {
        createProgram().parse(['node', 'example', 'completion', '--', 'example', 'hello', '']);
        await new Promise(resolve => setImmediate(resolve));
        expect(log).toHaveBeenCalledWith('--debug\n-d\nworld');
    });

    it('still runs setup and cleanup outside of completion', () => {
        expect(() => createProgram().parse(['node', 'example', '--setup'])).toThrow('process.exit(0) called');
        expect(setupBash).toHaveBeenCalledWith('example');
        expect(() => createProgram().parse(['node', 'example', '--cleanup'])).toThrow('process.exit(0) called');
        expect(cleanUpBash).toHaveBeenCalledWith('example');
    });
});
