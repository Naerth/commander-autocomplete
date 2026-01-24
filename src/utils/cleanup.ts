import fs from 'fs';
import { getBashrcFile, getAutocompleteFile, getCompletionBlock, backupBashRc, validateBinName } from './helpers.js';

/**
 * Cleans up bash autocomplete configuration for a binary
 * @param bin_name name of binary
 * @param backup whether to backup .bashrc before modifying
 * @throws {Error} If the binary name is invalid
 */
export function cleanUpBash(bin_name: string, backup: boolean = true) {
    // Validate bin_name to prevent command injection and path traversal
    validateBinName(bin_name);

    console.log('Cleanup autocompletion');
    const completionFile = getAutocompleteFile(bin_name);
    const bashrcFile = getBashrcFile();

    if (backup) {
        const backupFile = backupBashRc(bashrcFile);
        console.log(`Backup .bashrc to ${backupFile}`);
    }

    if (fs.existsSync(completionFile)) {
        console.log(`Removing ${completionFile}`);
        fs.unlinkSync(completionFile);
    }

    // Check if .bashrc exists before attempting to read it
    if (!fs.existsSync(bashrcFile)) {
        console.log('.bashrc not found, nothing to clean');
        return;
    }

    const bashrcContent = fs.readFileSync(bashrcFile, { encoding: 'utf-8' });
    const completionBlock = getCompletionBlock(completionFile);
    const newBashrcContent = bashrcContent.replaceAll(completionBlock, "");

    const originalLines = bashrcContent.split("\n");
    const newLine = newBashrcContent.split("\n");
    const removedLines = originalLines.filter(line => !newLine.includes(line));
    // ask user confirmation
    if (removedLines.length > 0) {

        console.log('next lines will be removed from .bashrc');
        console.log('-------------------');
        console.log(removedLines.join('\n'));
        console.log('-------------------');

        fs.writeFileSync(bashrcFile, newBashrcContent);
    }
    else {
        console.log('Nothing to remove in .bashrc');
    }

}