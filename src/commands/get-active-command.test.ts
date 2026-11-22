import { Command } from './command.js';
import { getActiveCommand } from './get-active-command';

const createProgram = () => {
    return new Command();
};

describe('getActiveCommand', () => {
    it('returns the subcommand if it matches an input word', () => {

        const program = createProgram();
        const rootCmd = program.command('root');
        const subCmd = rootCmd.command('sub');
        const inputWords = ['sub'];
        const result = getActiveCommand(inputWords, rootCmd as any, 0);

        expect(result.activeCommand).toBe(subCmd);
        expect(result.activeCommandIdx).toBe(0);
    });

    it('skips hidden subcommands', () => {
        const program = createProgram();
        const rootCmd = program.command('root');
        const visibleCmd = rootCmd.command('visible');
        rootCmd.command('hidden', { hidden: true });

        const inputWords = ['hidden', 'visible'];
        const result = getActiveCommand(inputWords, rootCmd as any, 0);

        expect(result.activeCommand).toBe(visibleCmd);
        expect(result.activeCommandIdx).toBe(1);
    });

    it('returns the current command if no subcommand matches', () => {
        const program = createProgram();
        const rootCmd = program.command('root');
        rootCmd.command('sub');
        const inputWords = ['other'];
        const result = getActiveCommand(inputWords, rootCmd as any, 0);

        expect(result.activeCommand).toBe(rootCmd);
        expect(result.activeCommandIdx).toBe(0);
    });

    it('returns the first matching subcommand if multiple match', () => {
        const program = createProgram();
        const rootCmd = program.command('root');

        rootCmd.command('foo');
        const sub2 = rootCmd.command('bar');
        const inputWords = ['bar', 'foo'];

        const result = getActiveCommand(inputWords, rootCmd as any, 0);

        expect(result.activeCommand).toBe(sub2);
        expect(result.activeCommandIdx).toBe(0);
    });

    it('returns the current command and index if inputWords is empty', () => {
        const program = createProgram();
        const rootCmd = program.command('root');
        const inputWords: string[] = [];
        const result = getActiveCommand(inputWords, rootCmd, 2);

        expect(result.activeCommand).toBe(rootCmd);
        expect(result.activeCommandIdx).toBe(2);
    });

    it('goes down to nested subcommands', () => {
        const program = createProgram();
        const hello = program.command('hello');
        const world = hello.command('world');
        const deep = world.command('deep');

        expect(getActiveCommand(['hello', 'world', ''], program, -1)).toEqual({ activeCommand: world, activeCommandIdx: 1 });
        expect(getActiveCommand(['hello', '--debug', 'world', 'deep'], program, -1)).toEqual({ activeCommand: deep, activeCommandIdx: 3 });
    });

    it('does not jump to a nested subcommand whose parent was not typed', () => {
        const program = createProgram();
        program.command('hello').command('world');

        expect(getActiveCommand(['world'], program, -1)).toEqual({ activeCommand: program, activeCommandIdx: -1 });
    });

    it('matches subcommands by alias', () => {
        const program = createProgram();
        const hello = program.command('hello').alias('hi');

        expect(getActiveCommand(['hi'], program, -1)).toEqual({ activeCommand: hello, activeCommandIdx: 0 });
    });
});
