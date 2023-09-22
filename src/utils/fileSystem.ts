import { join } from "path";
import os from 'os';

export const autocompletionDir = join(os.homedir(), ".autocomplete")
export const bashrcFile = join(os.homedir(), ".bashrc");

export function getAutocompleteFile(bin_name: string) {
    return join(autocompletionDir, bin_name);
}