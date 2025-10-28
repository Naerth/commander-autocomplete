import fs from 'fs';
import { getBashrcFile, getAutocompleteFile, getCompletionBlock, backupBashRc } from './helpers.js';

export function cleanUpBash(binaryName: string, backup: boolean = true) {

    console.log('Cleanup autocompletion');
    const completionFile = getAutocompleteFile(binaryName);
    const bashrcFile = getBashrcFile();

    if (backup) {
        const backupFile = backupBashRc(bashrcFile);
        console.log(`Backup .bashrc to ${backupFile}`);
    }

    if (fs.existsSync(completionFile)) {
        console.log(`Removing ${completionFile}`);
        fs.unlinkSync(completionFile);
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