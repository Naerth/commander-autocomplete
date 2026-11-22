import fs from 'fs';
import { getBashrcFile, getAutocompleteFile, getCompletionBlock, backupBashRc, validateBinName } from './helpers.js';

/**
 * Cleans up bash autocomplete configuration for a binary
 * @param bin_name name of binary
 * @param backup whether to backup .bashrc before modifying it
 * @throws {Error} If the binary name is invalid
 */
export function cleanUpBash(bin_name: string, backup: boolean = true) {
    // Validate bin_name to prevent command injection and path traversal
    validateBinName(bin_name);

    console.log('Cleanup autocompletion');
    const completionFile = getAutocompleteFile(bin_name);
    const bashrcFile = getBashrcFile();

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
    const completionLine = getCompletionBlock(completionFile).trim();

    const originalLines = bashrcContent.split('\n');
    const keptLines = originalLines.filter(line => line.trim() !== completionLine);

    if (keptLines.length === originalLines.length) {
        console.log('Nothing to remove in .bashrc');
        return;
    }

    // Only backup when .bashrc is really going to be modified
    if (backup) {
        const backupFile = backupBashRc(bashrcFile);
        console.log(`Backup .bashrc to ${backupFile}`);
    }

    console.log('next lines will be removed from .bashrc');
    console.log('-------------------');
    console.log(originalLines.filter(line => line.trim() === completionLine).join('\n'));
    console.log('-------------------');

    fs.writeFileSync(bashrcFile, keptLines.join('\n'));
}
