import { promises as fs } from 'fs';
import { join } from 'path';
import os from 'os';
import { autocompletionDir, bashrcFile, getAutocompleteFile } from './fileSystem';
import getCompletionBlock from './get-completion-block';

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
 * Install autocomplete file
 * @param bin_name 
 */
export async function setupBash(bin_name: string) {


    await fs.mkdir(autocompletionDir, { mode: 0o755, recursive: true });
    const completionFile = getAutocompleteFile(bin_name);

    console.log(`Write ${completionFile}`);
    await fs.writeFile(completionFile, generateBashTemplate(bin_name));

    console.log(`Write .bashrc`);
    await fs.appendFile(bashrcFile, getCompletionBlock(completionFile));

}