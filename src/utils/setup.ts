import fs from 'fs';
import { getCompletionBlock, getAutocompleteDir, getBashrcFile, getAutocompleteFile, backupBashRc } from './helpers.js';
import { cleanUpBash } from './cleanup.js';

/**
 * Template for bash autocomplete
 * @param bin_name 
 * @returns 
 */
const generateBashTemplate = (bin_name: string) => `
function ${bin_name}_comp() {
    
    local cur
    COMPREPLY=() # Array variable storing the possible completions.
    cur=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=($(compgen -W "$1" -- \${cur}))
    [[ $COMPREPLY ]] && return

    _filedir
}

function ${bin_name}_completion {
    prop=$(${bin_name} completion "\${COMP_WORDS[@]}")
    ${bin_name}_comp "$prop"
}

complete -F "${bin_name}_completion" ${bin_name}

`;

/**
 * Create and write autocomplete file
 * @param bin_name name of binary
 */
export function setupBash(bin_name: string) {
    
    const backupFile = backupBashRc(getBashrcFile());
    console.log(`Backup .bashrc to ${backupFile}`);

    cleanUpBash(bin_name, false);

    fs.mkdirSync(getAutocompleteDir(), { mode: 0o755, recursive: true });
    const completionFile = getAutocompleteFile(bin_name);

    console.log(`Write ${completionFile}`);
    fs.appendFileSync(completionFile, generateBashTemplate(bin_name));

    console.log(`Write .bashrc`);
    fs.appendFileSync(getBashrcFile(), getCompletionBlock(completionFile));

}