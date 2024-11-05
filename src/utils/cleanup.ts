import fs from 'fs';
import { getBashrcFile, getAutocompleteFile, getCompletionBlock } from './helpers.js';

export function cleanUpBash(bin_name: string) {
    console.log('Cleanup autocompletion');
    const completionFile = getAutocompleteFile(bin_name);
    const bashrcFile = getBashrcFile();

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
        console.log('Nothing to remove in .bashrc')
    }

}