import type { Command } from 'commander';

/**
 * Get the options that should be excluded from suggestions.
 * This includes options that have already been used after the active command.
 * An option is considered already in the words if its short or long form is present in the remaining words.
 * @param remainingWords - The words input by the user after the active command.
 * @param activeCommand - The current command being processed.
 * @returns 
 */
export const getAvailableOptions = (remainingWords: string[], activeCommand: Command): string[] => {
    return activeCommand.options.reduce<string[]>((acc, option) => {
        if (option.hidden) return acc;

        if (
            (!option.short || remainingWords.includes(option.short))
            ||
            (!option.long || remainingWords.includes(option.long))
        )
            return acc;


        if (option.short) acc.push(option.short);
        if (option.long) acc.push(option.long);


        return acc;
    }, []);
};