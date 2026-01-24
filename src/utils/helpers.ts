import os from 'os';
import path from "path";
import fs from 'fs';

/**
 * Regular expression for valid binary names.
 * Only allows alphanumeric characters, hyphens, and underscores.
 * Must start with a letter or underscore.
 */
const VALID_BIN_NAME_REGEX = /^[a-zA-Z_][a-zA-Z0-9_-]*$/;

/**
 * Validates a binary name to prevent command injection and path traversal.
 * @param bin_name The name of the binary to validate
 * @throws {Error} If the binary name is invalid
 */
export function validateBinName(bin_name: string): void {
    if (!bin_name || typeof bin_name !== 'string') {
        throw new Error('Binary name is required and must be a string');
    }

    if (bin_name.length > 255) {
        throw new Error('Binary name exceeds maximum length of 255 characters');
    }

    if (!VALID_BIN_NAME_REGEX.test(bin_name)) {
        throw new Error(
            `Invalid binary name "${bin_name}". ` +
            'Binary name must start with a letter or underscore and contain only alphanumeric characters, hyphens, and underscores.'
        );
    }
}

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
 * @throws {Error} If the binary name is invalid
 */
export function getAutocompleteFile(bin_name: string) {
    validateBinName(bin_name);
    return path.join(getAutocompleteDir(), bin_name);
}

/**
 * Replaces the home directory path with ~ for shell compatibility.
 * Uses a safe replacement method that handles special characters.
 * @param filePath The file path to process
 * @returns The path with home directory replaced by ~
 */
function replaceHomeDirWithTilde(filePath: string): string {
    const homeDir = os.homedir();
    if (filePath.startsWith(homeDir)) {
        return '~' + filePath.slice(homeDir.length);
    }
    return filePath;
}

/**
 * Returns the bash completion block to be added to the bash profile
 * @param completionFile The location of the completion file
 * @returns The bash completion block to be added to the bash profile
 */
export function getCompletionBlock(completionFile: string) {
    return `source ${replaceHomeDirWithTilde(completionFile)}\n`;
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