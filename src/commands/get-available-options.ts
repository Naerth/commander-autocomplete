import type { Command } from 'commander';

/**
 * Get the options that should be included in suggestions.
 * This includes options that have already been used after the active command.
 * An option is considered already in the words if its short or long form is present in the remaining words.
 * @param remainingWords - The words input by the user after the active command.
 * @param activeCommand - The current command being processed.
 * @returns 
 */
export const getAvailableOptions = (remainingWords: string[], activeCommand: Command): string[] => {
    return activeCommand.options.reduce<string[]>((availableOptions, option) => {
        if (option.hidden) return availableOptions;

        if (
            (option.short && remainingWords.includes(option.short)) ||
            (option.long && remainingWords.includes(option.long))
        )
            return availableOptions;


        if (option.short) availableOptions.push(option.short);
        if (option.long) availableOptions.push(option.long);


        return availableOptions;
    }, []);
};