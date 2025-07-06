import type { Command } from './command.js';


/**
 * Get the active command based on the input words and the current command.
 * @param inputWords - The words input by the user.
 * @param currentCommand - The current command being processed.
 * @param currentCommandIdx - The index of the current command in the input words.
 * @returns 
 */
export const getActiveCommand = (
    inputWords: string[],
    currentCommand: Command,
    currentCommandIdx: number
): { activeCommand: Command , activeCommandIdx: number; } => {

    // Iterate through the input words to find the active command
    for (let i = 0; i < inputWords.length; i++) {
        const word = inputWords[i];
        const subCommand = currentCommand.commands.filter(cmd => !cmd.hidden()).find(cmd => cmd.name() === word);
        if (!subCommand) continue;

        return {
            activeCommand: subCommand,
            activeCommandIdx: i
        };
    }

    // If no sub-command is found, return the current command and index
    return {
        activeCommand: currentCommand,
        activeCommandIdx: currentCommandIdx
    };

};