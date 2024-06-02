import { homedir } from 'os';
import { join } from "path";

export const autocompleteDir = join(homedir(), ".autocomplete");
export const bashrcFile = join(homedir(), ".bashrc");

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