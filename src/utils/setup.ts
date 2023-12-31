import { mkdirSync, appendFileSync } from 'fs';
import { getCompletionBlock, autocompleteDir, bashrcFile, getAutocompleteFile } from './helpers.js';

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


    mkdirSync(autocompleteDir, { mode: 0o755, recursive: true });
    const completionFile = getAutocompleteFile(bin_name);

    console.log(`Write ${completionFile}`);
    appendFileSync(completionFile, generateBashTemplate(bin_name));

    console.log(`Write .bashrc`);
    appendFileSync(bashrcFile, getCompletionBlock(completionFile));

}