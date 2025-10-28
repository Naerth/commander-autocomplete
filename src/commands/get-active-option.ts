import type { Option } from 'commander';
import type { Command } from './command.js';

/**
 * Get the active option based on the input words and the current command.
 * @param inputWords - The words input by the user.
 * @param activeCommand - The current command being processed.
 * @returns The active option if found, otherwise undefined.
 */
export const getActiveOption = (
    inputWords: string[],
    activeCommand: Command,
): Option | undefined => {

    // Find the last flag in the two last words of the input
    const lastFlag = inputWords.slice(-2).findLast(word => word.startsWith('-'));

    if (!lastFlag) return;

    return activeCommand.options.find(option => option.short === lastFlag || option.long === lastFlag);

};
