import { existsSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import { getCompletionBlock, bashrcFile, getAutocompleteFile } from './helpers';

export async function cleanUpBash(bin_name: string) {
    const completionFile = getAutocompleteFile(bin_name);

    if (!existsSync(completionFile)) {
        console.log("completion file is not installed");
        return;
    }

    console.log(`Removing ${completionFile}`);
    await unlinkSync(completionFile);

    console.log(`Removing completion script from ~/.bashrc`);
    const bashrcContent = await readFileSync(bashrcFile, { encoding: 'utf-8' });
    const completionBlock = getCompletionBlock(completionFile);
    await writeFileSync(bashrcFile, bashrcContent.replace(completionBlock, ""));

}