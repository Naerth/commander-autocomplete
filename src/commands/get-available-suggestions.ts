import type { Command } from './command.js';
import { getAvailableArgumentsChoices } from './get-available-arguments-choices.js';
import { getAvailableCommands } from './get-available-commands.js';
import { getAvailableOptions } from './get-available-options.js';

/**
 * Get the words that should be excluded from suggestions.
 * This includes options and arguments that have already been used
 * after the active command.
 * @param inputWords - The words input by the user.
 * @param activeCommand - The current command being processed.
 * @param activeCommandIdx - The index of the active command in the input words.
 * @returns An array of words that should be excluded from suggestions.
 */
export const getAvailableCommandAvailableSuggestions = (
    remainingWords: string[],
    activeCommand: Command,
): string[] => {

    /**
     * Get the options that are already in the remaining words.
     * An option is considered already in the words if its short or long form is present in the remaining words.
     */
    const availableOptions = getAvailableOptions(
        remainingWords,
        activeCommand
    );

    /**
     * Get the arguments choices that are already in the remaining words.
     * An argument choice is considered already in the words if one value expected by the argument is present in the remaining words.
     * None of the argument choices will be available for suggestions if at least one of them is already in the words.
     */
    const availableArgumentsChoices = getAvailableArgumentsChoices(
        remainingWords,
        activeCommand
    );


    const availableCommand = getAvailableCommands(activeCommand);


    return [
        ...availableCommand,
        ...availableOptions,
        ...availableArgumentsChoices,
    ];
};