import type { Command } from './command.js';


/**
 * Get the active command based on the input words and the current command.
 * Walks down the command tree: each word matching a visible sub-command
 * (by name or alias) of the command found so far becomes the new active command.
 * @param inputWords - The words input by the user.
 * @param currentCommand - The command to start from (usually the root program).
 * @param currentCommandIdx - The index to return when no sub-command is found.
 * @returns The deepest active command and its index in the input words.
 */
export const getActiveCommand = (
    inputWords: string[],
    currentCommand: Command,
    currentCommandIdx: number
): { activeCommand: Command, activeCommandIdx: number; } => {

    let activeCommand = currentCommand;
    let activeCommandIdx = currentCommandIdx;

    for (let i = 0; i < inputWords.length; i++) {
        const word = inputWords[i];
        const subCommand = activeCommand.commands
            .filter(cmd => !cmd.hidden())
            .find(cmd => cmd.name() === word || cmd.aliases().includes(word));

        if (!subCommand) continue;

        activeCommand = subCommand;
        activeCommandIdx = i;
    }

    return { activeCommand, activeCommandIdx };
};
