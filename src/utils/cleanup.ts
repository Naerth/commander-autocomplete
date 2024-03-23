import { existsSync, readFileSync, unlinkSync, writeFileSync, copyFileSync } from 'fs';
import { getCompletionBlock, bashrcFile, getAutocompleteFile } from './helpers.js';

export function cleanUpBash(bin_name: string) {
    console.log('Cleanup autocompletion');
    const completionFile = getAutocompleteFile(bin_name);

    if (existsSync(completionFile)) {
        console.log(`Removing ${completionFile}`);
        unlinkSync(completionFile);
    }

    const bashrcContent = readFileSync(bashrcFile, { encoding: 'utf-8' });
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
        
        writeFileSync(bashrcFile, newBashrcContent);
    }
    else {
        console.log('Nothing to remove in .bashrc')
    }

}