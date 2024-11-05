import os from 'os';
import { join } from "path";

/**
 * Returns the location of the autocomplete directory
 * @returns The location of the autocomplete directory
 */
export const getAutocompleteDir = () => {
    return join(os.homedir(), ".autocomplete");
};

/**
 * Returns the location of the bashrc file
 * @returns The location of the bashrc file
 */
export const getBashrcFile = () => {
    return join(os.homedir(), ".bashrc");
};

/**
 * Returns the location of the autocomplete file
 * @param bin_name The name of the binary
 * @returns The location of the autocomplete file
 */
export function getAutocompleteFile(bin_name: string) {
    return join(getAutocompleteDir(), bin_name);
}

/**
 * Returns the bash completion block to be added to the bash profile
 * @param completionFile The location of the completion file
 * @returns The bash completion block to be added to the bash profile
 */
export function getCompletionBlock(completionFile: string) {
    return `source ${completionFile.replace(os.homedir(), "~")}\n`;
}