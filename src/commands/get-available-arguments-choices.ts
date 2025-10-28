import type { Command } from 'commander';

/**
 * Get the arguments choices that should be included in suggestions.
 * This includes arguments choices that have already been used after the active command.
 * An argument choice is considered already in the words if one value expected by the argument is present in the remaining words.
 * None of the argument choices will be available for suggestions if at least one of them is already in the words.
 * @param remainingWords 
 * @param activeCommand 
 * @returns 
 */
export const getAvailableArgumentsChoices = (
    remainingWords: string[],
    activeCommand: Command,
) => {

    return activeCommand.registeredArguments.reduce<string[]>((availableChoices, argument) => {

        if (!argument.argChoices?.length || argument.argChoices.some(choice => remainingWords.includes(choice)))
            return availableChoices;

        availableChoices.push(...argument.argChoices);

        return availableChoices;
    }, []);
};