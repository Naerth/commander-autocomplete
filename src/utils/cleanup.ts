import { promises as fs, existsSync } from 'fs';
import { join } from 'path';
import os from 'os';

export async function cleanUpBash(bin_name: string) {
    const completionFile = join(os.homedir(), ".autocomplete", `.${bin_name}`)

    if (!existsSync(completionFile)) {
        console.log("completion file is not installed");
        return;
    }
    
    console.log(`Removing ${completionFile}`);
    await fs.unlink(completionFile);

    console.log(`Remove "source ${completionFile.replace(os.homedir(), "~")}" from your .bashrc to complete the cleanup`);
}