import fs from 'fs';
import { getCompletionBlock, getAutocompleteDir, getBashrcFile, getAutocompleteFile, backupBashRc } from './helpers.js';
import { cleanUpBash } from './cleanup.js';

/**
 * Template for bash autocomplete
 * @param binaryName 
 * @returns 
 */
const generateBashTemplate = (binaryName: string) => `
function ${binaryName}_comp() {
    
    local currentWord
    COMPREPLY=() # Array variable storing the possible completions.
    currentWord=\${COMP_WORDS[COMP_CWORD]}
    COMPREPLY=($(compgen -W "$1" -- \${currentWord}))
    [[ $COMPREPLY ]] && return

    _filedir
}

function ${binaryName}_completion {
    suggestions=$(${binaryName} completion "\${COMP_WORDS[@]}")
    ${binaryName}_comp "$suggestions"
}

complete -F "${binaryName}_completion" ${binaryName}

`;

/**
 * Create and write autocomplete file
 * @param binaryName name of binary
 */
export function setupBash(binaryName: string) {
    
    const backupFile = backupBashRc(getBashrcFile());
    console.log(`Backup .bashrc to ${backupFile}`);

    cleanUpBash(binaryName, false);

    fs.mkdirSync(getAutocompleteDir(), { mode: 0o755, recursive: true });
    const completionFile = getAutocompleteFile(binaryName);

    console.log(`Write ${completionFile}`);
    fs.appendFileSync(completionFile, generateBashTemplate(binaryName));

    console.log(`Write .bashrc`);
    fs.appendFileSync(getBashrcFile(), getCompletionBlock(completionFile));

}