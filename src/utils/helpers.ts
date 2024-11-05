import os from 'os';
import path from "path";
import fs from 'fs';
/**
 * Returns the location of the autocomplete directory
 * @returns The location of the autocomplete directory
 */
export const getAutocompleteDir = () => {
    return path.join(os.homedir(), ".autocomplete");
};

/**
 * Returns the location of the bashrc file
 * @returns The location of the bashrc file
 */
export const getBashrcFile = () => {
    return path.join(os.homedir(), ".bashrc");
};

/**
 * Returns the location of the autocomplete file
 * @param bin_name The name of the binary
 * @returns The location of the autocomplete file
 */
export function getAutocompleteFile(bin_name: string) {
    return path.join(getAutocompleteDir(), bin_name);
}

/**
 * Returns the bash completion block to be added to the bash profile
 * @param completionFile The location of the completion file
 * @returns The bash completion block to be added to the bash profile
 */
export function getCompletionBlock(completionFile: string) {
    return `source ${completionFile.replace(os.homedir(), "~")}\n`;
}

/**
 * Copy file to a backup file
 * @param file The file to be backed up
 * @returns false if the file is not a bash file, otherwise the location of the backup file
 */
export function backupBashRc(file: string) {
    const dirname = path.dirname(file);
    const basename = path.basename(file);
    const timestamp = Date.now();
    const backupBashRc = path.join(dirname, `${basename}.${timestamp}`);

    fs.copyFileSync(file, backupBashRc);

    return backupBashRc;
}