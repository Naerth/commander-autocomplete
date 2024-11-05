import { autocomplete } from './autocomplete';
import { Command } from '../commands/command.js';

describe('autocomplete', () => {

    it('should return undefined when no command, option or autocomplete are available', async () => {
        const program = new Command();
        program.name('example');
        const result = await autocomplete(program);
        expect(result).toBeUndefined();
    });

    it('should return an array of commands', async () => {
        const program = new Command();
        program.command('git');
        program.command('npm');
        program.command('yarn');
        const result = await autocomplete(program);
        expect(result).toEqual(['git', 'npm', 'yarn']);
    });

    it('should return an array of options', async () => {
        const program = new Command();
        program.option('-f, --force');
        program.option('-v, --verbose');
        program.option('-q, --quiet');
        const result = await autocomplete(program);
        expect(result).toEqual(['--force', '--quiet', '--verbose', '-f', '-q', '-v']);
    });

    it('should return an array of commands and options', async () => {
        const program = new Command();
        program.command('git');
        program.command('npm');
        program.command('yarn');
        program.option('-f, --force');
        program.option('-v, --verbose');
        program.option('-q, --quiet');
        const result = await autocomplete(program);
        expect(result).toEqual(['git', 'npm', 'yarn', '--force', '--quiet', '--verbose', '-f', '-q', '-v']);
    });

    it('should return an array of commands and options with a custom filter', async () => {
        const program = new Command();
        program.command('npm');
        program.command('yarn');
        program.command('git');
        program.option('-f, --force');
        program.option('-v, --verbose');
        program.option('-q, --quiet');

        program.args = ['test', '--f'];

        const result = await autocomplete(program);
        expect(result).toEqual(['--force']);
    });

    it('should return only subcommand options', async () => {
        const program = new Command();
        program.command('npm');
        program.command('yarn')
            .option('-t, --test');

        program.command('git')
            .option('-f, --force')
            .option('-v, --verbose')
            .option('-q, --quiet');

        program.args = ['test', 'git'];

        const result = await autocomplete(program);
        expect(result).toEqual(['--force', '--quiet', '--verbose', '-f', '-q', '-v']);
    });
});
