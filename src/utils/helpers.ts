import { Command } from "../commands/command";
import { join } from "path";
import os from 'os';

export const autocompleteDir = join(os.homedir(), ".autocomplete")
export const bashrcFile = join(os.homedir(), ".bashrc");

/**
 * Get visible commands
 * @param command 
 * @returns List of visible commands
 */
export const getVisibleCommands = (command: Command) => command.commands.filter(cmd => !cmd._hidden)

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
    return `source ${completionFile.replace(os.homedir(), "~")}\n`
}