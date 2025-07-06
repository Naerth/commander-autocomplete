import { getAvailableCommandAvailableSuggestions } from './get-available-suggestions';
import { getAvailableOptions } from './get-available-options';
import { getAvailableArgumentsChoices } from './get-available-arguments-choices';
import { getAvailableCommands } from './get-available-commands';
import { Command } from './command';

// Mock dependencies
jest.mock('./get-available-options');
jest.mock('./get-available-arguments-choices');
jest.mock('./get-available-commands');

const mockedGetAvailableOptions = getAvailableOptions as jest.MockedFunction<typeof getAvailableOptions>;
const mockedGetAvailableArgumentsChoices = getAvailableArgumentsChoices as jest.MockedFunction<typeof getAvailableArgumentsChoices>;
const mockedGetAvailableCommands = getAvailableCommands as jest.MockedFunction<typeof getAvailableCommands>;

describe('getAvailableCommandAvailableSuggestions', () => {
    const mockCommand: Command = new Command('root');

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('returns combined suggestions from commands, options, and argument choices', () => {
        mockedGetAvailableCommands.mockReturnValue(['sub1', 'sub2']);
        mockedGetAvailableOptions.mockReturnValue(['--foo', '-f']);
        mockedGetAvailableArgumentsChoices.mockReturnValue(['choice1', 'choice2']);

        const result = getAvailableCommandAvailableSuggestions(['foo', 'bar'], mockCommand);

        expect(result).toEqual(['sub1', 'sub2', '--foo', '-f', 'choice1', 'choice2']);
        expect(mockedGetAvailableCommands).toHaveBeenCalledWith(mockCommand);
        expect(mockedGetAvailableOptions).toHaveBeenCalledWith(['foo', 'bar'], mockCommand);
        expect(mockedGetAvailableArgumentsChoices).toHaveBeenCalledWith(['foo', 'bar'], mockCommand);
    });

    it('returns empty array if all dependencies return empty arrays', () => {
        mockedGetAvailableCommands.mockReturnValue([]);
        mockedGetAvailableOptions.mockReturnValue([]);
        mockedGetAvailableArgumentsChoices.mockReturnValue([]);

        const result = getAvailableCommandAvailableSuggestions([], mockCommand);

        expect(result).toEqual([]);
    });

    it('handles when only some dependencies return values', () => {
        mockedGetAvailableCommands.mockReturnValue(['sub1']);
        mockedGetAvailableOptions.mockReturnValue([]);
        mockedGetAvailableArgumentsChoices.mockReturnValue(['choice1']);

        const result = getAvailableCommandAvailableSuggestions(['foo'], mockCommand);

        expect(result).toEqual(['sub1', 'choice1']);
    });
});