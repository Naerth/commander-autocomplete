import { getActiveOption } from './get-active-option';
import { Command } from './command';
import { Option } from 'commander';


const createProgram = () => {
    return new Command();
};

describe('getActiveOption', () => {

    const optionA = new Option('-a, --all', 'Option A');
    const optionB = new Option('-b, --beta', 'Option B');
    const optionC = new Option('-c', 'Option C');
    const command = createProgram().command('root');

    command.addOption(optionA);
    command.addOption(optionB);
    command.addOption(optionC);



    it('returns the option matching the last flag in the last two words', () => {
        expect(getActiveOption(['foo', '-a'], command)).toBe(optionA);
        expect(getActiveOption(['foo', '--beta'], command)).toBe(optionB);
        expect(getActiveOption(['foo', '-c'], command)).toBe(optionC);
    });

    it('returns the option matching the flag if it is the second to last word', () => {
        expect(getActiveOption(['-a', 'bar'], command)).toBe(optionA);
        expect(getActiveOption(['--all', 'bar'], command)).toBe(optionA);
    });

    it('returns undefined if no flag is found in the last two words', () => {
        expect(getActiveOption(['foo', 'bar'], command)).toBeUndefined();
        expect(getActiveOption([], command)).toBeUndefined();
    });

    it('returns undefined if the flag does not match any option', () => {
        expect(getActiveOption(['foo', '-z'], command)).toBeUndefined();
        expect(getActiveOption(['--unknown', 'bar'], command)).toBeUndefined();
    });

    it('returns the last flag if both last two words are flags', () => {
        expect(getActiveOption(['-a', '-b'], command)).toBe(optionB);
        expect(getActiveOption(['--all', '--beta'], command)).toBe(optionB);
    });

    it('handles options with only short or only long flags', () => {
        const shortOnly = new Option('-s');
        const longOnly = new Option('--long');

        const command = createProgram().command('root');

        command.addOption(shortOnly);
        command.addOption(longOnly);

        expect(getActiveOption(['foo', '-s'], command)).toBe(shortOnly);
        expect(getActiveOption(['foo', '--long'], command)).toBe(longOnly);
        expect(getActiveOption(['-s', '--long'], command)).toBe(longOnly);
    });

    it('ignores words that are not flags in the last two positions', () => {
        expect(getActiveOption(['foo', 'bar', '-a'], command)).toBe(optionA);
        expect(getActiveOption(['foo', 'bar', '--all'], command)).toBe(optionA);
        expect(getActiveOption(['foo', 'bar', 'baz'], command)).toBeUndefined();
    });

    it('returns undefined if activeCommand.options is empty', () => {
        const command = createProgram().command('root');
        expect(getActiveOption(['-a'], command)).toBeUndefined();
    });

    it('returns undefined if inputWords is empty', () => {
        expect(getActiveOption([], command)).toBeUndefined();
    });
});