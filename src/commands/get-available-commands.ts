import type { Command } from './command.js';


/**
 * Get the commands that should be included in suggestions.
 * This includes commands that are hidden or not available in the current context.
 * @param activeCommand 
 * @returns 
 */
export const getAvailableCommands = (activeCommand: Command): string[] => {
    return activeCommand.commands
        .filter(cmd => !cmd.hidden())
        .map(cmd => cmd.name());
};
