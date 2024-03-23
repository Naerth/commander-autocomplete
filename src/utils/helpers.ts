import { Command } from "../commands/command.js";
import { join } from "path";
import { homedir } from 'os';

export const autocompleteDir = join(homedir(), ".autocomplete");
export const bashrcFile = join(homedir(), ".bashrc");

/**
 * Get visible commands
 * @param command 
 * @returns List of visible commands
 */
export const getVisibleCommands = (command: Command) => command.commands.filter(cmd => !cmd._hidden);

/**
 * Get options flags of visible options
 * @param command 
 * @returns List of flags
 */
export function getFlags(command: Command, excludableFlags: string[] = []) {
    const visibleOptions = command.options.filter(opt => !opt.hidden);

    return visibleOptions.reduce<string[]>((acc, option) => {
        const flags = option.flags.split(/[,\|\s]+/g).filter(Boolean);
        if (!flags.some(flag => excludableFlags.includes(flag)))
            acc.push(...flags);
        return acc;
    }, []);
}
/**
 * Returns the location of the autocomplete file
 * @param bin_name The name of the binary
 * @returns The location of the autocomplete file
 */
export function getAutocompleteFile(bin_name: string) {
    return join(autocompleteDir, bin_name);
}

/**
 * Returns the bash completion block to be added to the bash profile
 * @param completionFile The location of the completion file
 * @returns The bash completion block to be added to the bash profile
 */
export function getCompletionBlock(completionFile: string) {
    return `source ${completionFile.replace(homedir(), "~")}\n`;
}