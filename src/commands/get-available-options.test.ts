import { Command } from './command.js';
import { getAvailableOptions } from './get-available-options';
import { Option } from 'commander';

const makeOption = (
    short: string | undefined,
    long: string | undefined,
    hidden = false
) => {

    const options = [short, long].filter(Boolean);
    const option = new Option(options.join(', '));
    option.hidden = hidden;
    return option;
};

const makeCommand = (options: Array<{ short?: string; long?: string; hidden?: boolean; }>): Command => {
    const command = new Command();
    options.forEach(opt => command.addOption(makeOption(opt.short, opt.long, opt.hidden)));

    return command;
};

describe('getAvailableOptions', () => {
    it('returns all options if none are present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: '--all' },
            { short: '-b', long: '--beta' },
        ]);
        const result = getAvailableOptions([], command);
        expect(result).toEqual(['-a', '--all', '-b', '--beta']);
    });

    it('excludes options whose short form is present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: '--all' },
            { short: '-b', long: '--beta' },
        ]);
        const result = getAvailableOptions(['-a'], command);
        expect(result).toEqual(['-b', '--beta']);
    });

    it('excludes options whose long form is present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: '--all' },
            { short: '-b', long: '--beta' },
        ]);
        const result = getAvailableOptions(['--beta'], command);
        expect(result).toEqual(['-a', '--all']);
    });

    it('excludes options if both short and long are present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: '--all' },
            { short: '-b', long: '--beta' },
        ]);
        const result = getAvailableOptions(['-a', '--all', '-b', '--beta'], command);
        expect(result).toEqual([]);
    });

    it('excludes hidden options', () => {
        const command = makeCommand([
            { short: '-a', long: '--all', hidden: true },
            { short: '-b', long: '--beta' },
        ]);
        const result = getAvailableOptions([], command);
        expect(result).toEqual(['-b', '--beta']);
    });

    it('handles options with only short or only long forms', () => {
        const command = makeCommand([
            { short: '-a' },
            { long: '--beta' },
        ]);
        const result = getAvailableOptions([], command);
        expect(result).toEqual(['-a', '--beta']);
    });

    it('excludes options with only short form if present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: undefined },
            { short: undefined, long: '--beta' },
        ]);
        const result = getAvailableOptions(['-a'], command);
        expect(result).toEqual(['--beta']);
    });

    it('excludes options with only long form if present in remainingWords', () => {
        const command = makeCommand([
            { short: '-a', long: undefined },
            { short: undefined, long: '--beta' },
        ]);
        const result = getAvailableOptions(['--beta'], command);
        expect(result).toEqual(['-a']);
    });

    it('returns empty array if all options are hidden', () => {
        const command = makeCommand([
            { short: '-a', long: '--all', hidden: true },
            { short: '-b', long: '--beta', hidden: true },
        ]);
        const result = getAvailableOptions([], command);
        expect(result).toEqual([]);
    });
});