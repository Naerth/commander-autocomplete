import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import os from 'os';
import { bashrcFile, getAutocompleteFile } from './fileSystem';
import getCompletionBlock from './get-completion-block';

export async function cleanUpBash(bin_name: string) {
    const completionFile = getAutocompleteFile(bin_name);

    if (!existsSync(completionFile)) {
        console.log("completion file is not installed");
        return;
    }

    console.log(`Removing ${completionFile}`);
    await fs.unlink(completionFile);

    console.log(`Removing completion script from ~/.bashrc`);
    const bashrcContent = await fs.readFile(bashrcFile, { encoding: 'utf-8' });
    const completionBlock = getCompletionBlock(completionFile);
    await fs.writeFile(bashrcFile, bashrcContent.replace(completionBlock, ""));

}