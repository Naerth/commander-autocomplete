import { Command } from './command.js';
import { getAvailableCommands } from './get-available-commands';

const createProgram = () => new Command();

describe('getAvailableCommands', () => {


    it('returns names of commands that are not hidden', () => {

        const program = createProgram();

        program.command('foo');
        program.command('bar');
        program.command('baz', { hidden: true });

        const result = getAvailableCommands(program);
        expect(result).toEqual(['foo', 'bar']);
    });

    it('returns an empty array if all commands are hidden', () => {

        const program = createProgram();

        program.command('foo', { hidden: true });
        program.command('bar', { hidden: true });


        const result = getAvailableCommands(program);
        expect(result).toEqual([]);
    });

    it('returns an empty array if there are no commands', () => {
        const program = createProgram();
        const result = getAvailableCommands(program);
        expect(result).toEqual([]);
    });
});