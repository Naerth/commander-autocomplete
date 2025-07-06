import { Argument } from 'commander';
import { Command } from './command.js';
import { getAvailableArgumentsChoices } from './get-available-arguments-choices';


const createProgram = () => new Command();

describe('getAvailableArgumentsChoices', () => {

    it('returns all choices if none are present in remainingWords', () => {
        
        const argument = new Argument('<arg>')
        argument.choices(['foo', 'bar', 'baz']);
        const program = createProgram().addArgument(argument);

        const result = getAvailableArgumentsChoices([], program);
        expect(result).toEqual(['foo', 'bar', 'baz']);
    });

    it('excludes choices if any are present in remainingWords', () => {

        const argument = new Argument('<arg>')
        argument.choices(['foo', 'bar']);
        const argument2 = new Argument('<arg>')
        argument.choices(['baz']);
        const program = createProgram().addArgument(argument).addArgument(argument2);
        
        const result = getAvailableArgumentsChoices(['foo'], program);
        expect(result).toEqual(['baz']);
    });

    it('excludes all choices for an argument if any of its choices are present', () => {

        const argument = new Argument('<arg>')
        argument.choices(['foo', 'bar']);

        const argument2 = new Argument('<arg>')
        argument2.choices(['baz', 'qux']);
        const program = createProgram().addArgument(argument).addArgument(argument2);
        

        const result = getAvailableArgumentsChoices(['qux'], program);
        expect(result).toEqual(['foo', 'bar']);
    });

    it('returns empty array if all choices are present in remainingWords', () => {
        const argument = new Argument('<arg>')
        argument.choices(['foo', 'bar', 'baz']);
        const program = createProgram().addArgument(argument);

        const result = getAvailableArgumentsChoices(['foo', 'bar', 'baz'], program);
        expect(result).toEqual([]);
    });

    it('skips arguments with no argChoices', () => {
        const argument = new Argument('<arg>')
        argument.choices(['foo']);

        const program = createProgram().addArgument(argument);

        const result = getAvailableArgumentsChoices([], program);
        expect(result).toEqual(['foo']);
    });

    it('returns empty array if registeredArguments is empty', () => {

        const program = createProgram();

        const result = getAvailableArgumentsChoices([], program);
        expect(result).toEqual([]);
    });
});